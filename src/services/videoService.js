import supabase from '../lib/supabase';

/**
 * Video service for handling video uploads and processing
 */

const STORAGE_BUCKET = 'chatbot-videos';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];

/**
 * Validates video file before upload
 * @param {File} file - The video file to validate
 * @returns {Object} - Validation result
 */
export const validateVideoFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }
  
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      duration: null // Will be set after processing
    }
  };
};

/**
 * Gets video duration from file
 * @param {File} file - The video file
 * @returns {Promise<number>} - Duration in seconds
 */
export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    });
    
    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video metadata'));
    });
    
    video.src = url;
  });
};

/**
 * Generates thumbnail from video file
 * @param {File} file - The video file
 * @param {number} timeInSeconds - Time to capture thumbnail (default: 1)
 * @returns {Promise<Blob>} - Thumbnail image blob
 */
export const generateVideoThumbnail = (file, timeInSeconds = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const url = URL.createObjectURL(file);
    
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(timeInSeconds, video.duration);
    });
    
    video.addEventListener('seeked', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate thumbnail'));
        }
      }, 'image/jpeg', 0.8);
    });
    
    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video for thumbnail'));
    });
    
    video.src = url;
  });
};

/**
 * Uploads video to Supabase Storage
 * @param {File} file - The video file
 * @param {string} chatbotId - ID of the chatbot
 * @param {string} userId - ID of the user
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Object>} - Upload result with video data
 */
export const uploadVideo = async (file, chatbotId, userId, onProgress = null) => {
  try {
    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Get video metadata
    const duration = await getVideoDuration(file);
    const thumbnail = await generateVideoThumbnail(file);
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${chatbotId}/${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const thumbnailFileName = `${chatbotId}/${userId}/thumbnails/${Date.now()}_thumb.jpg`;
    
    // Upload video file
    const { data: videoUpload, error: videoError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (videoError) {
      throw new Error(`Video upload failed: ${videoError.message}`);
    }
    
    // Upload thumbnail
    const { data: thumbnailUpload, error: thumbnailError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(thumbnailFileName, thumbnail, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (thumbnailError) {
      console.warn('Thumbnail upload failed:', thumbnailError);
    }
    
    // Get public URLs
    const { data: videoUrl } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);
    
    const { data: thumbnailUrl } = thumbnailUpload ? supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(thumbnailFileName) : { data: null };
    
    // Save video metadata to database
    const videoData = {
      id: Date.now().toString(),
      chatbot_id: chatbotId,
      user_id: userId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      duration: duration,
      storage_path: fileName,
      thumbnail_path: thumbnailFileName,
      video_url: videoUrl.publicUrl,
      thumbnail_url: thumbnailUrl?.publicUrl || null,
      upload_status: 'completed',
      created_at: new Date().toISOString()
    };
    
    const { data: dbData, error: dbError } = await supabase
      .from('chatbot_videos_x7k9p2q1')
      .insert([videoData])
      .select()
      .single();
    
    if (dbError) {
      // If database save fails, clean up storage
      await supabase.storage.from(STORAGE_BUCKET).remove([fileName]);
      if (thumbnailUpload) {
        await supabase.storage.from(STORAGE_BUCKET).remove([thumbnailFileName]);
      }
      throw new Error(`Database save failed: ${dbError.message}`);
    }
    
    return {
      success: true,
      video: {
        id: dbData.id,
        url: videoUrl.publicUrl,
        thumbnailUrl: thumbnailUrl?.publicUrl || null,
        duration: duration,
        fileName: file.name,
        fileSize: file.size
      }
    };
    
  } catch (error) {
    console.error('Video upload failed:', error);
    throw error;
  }
};

/**
 * Deletes video from storage and database
 * @param {string} videoId - ID of the video to delete
 * @param {string} userId - ID of the user (for authorization)
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteVideo = async (videoId, userId) => {
  try {
    // Get video data from database
    const { data: videoData, error: fetchError } = await supabase
      .from('chatbot_videos_x7k9p2q1')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      throw new Error(`Failed to fetch video data: ${fetchError.message}`);
    }
    
    if (!videoData) {
      throw new Error('Video not found or access denied');
    }
    
    // Delete from storage
    const filesToDelete = [videoData.storage_path];
    if (videoData.thumbnail_path) {
      filesToDelete.push(videoData.thumbnail_path);
    }
    
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filesToDelete);
    
    if (storageError) {
      console.error('Storage deletion failed:', storageError);
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('chatbot_videos_x7k9p2q1')
      .delete()
      .eq('id', videoId)
      .eq('user_id', userId);
    
    if (dbError) {
      throw new Error(`Database deletion failed: ${dbError.message}`);
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Video deletion failed:', error);
    throw error;
  }
};

/**
 * Gets video data by ID
 * @param {string} videoId - ID of the video
 * @param {string} userId - ID of the user (for authorization)
 * @returns {Promise<Object>} - Video data
 */
export const getVideo = async (videoId, userId) => {
  try {
    const { data, error } = await supabase
      .from('chatbot_videos_x7k9p2q1')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw new Error(`Failed to fetch video: ${error.message}`);
    }
    
    return data;
    
  } catch (error) {
    console.error('Get video failed:', error);
    throw error;
  }
};

/**
 * Gets all videos for a chatbot
 * @param {string} chatbotId - ID of the chatbot
 * @param {string} userId - ID of the user (for authorization)
 * @returns {Promise<Array>} - Array of video data
 */
export const getChatbotVideos = async (chatbotId, userId) => {
  try {
    const { data, error } = await supabase
      .from('chatbot_videos_x7k9p2q1')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Get chatbot videos failed:', error);
    throw error;
  }
};

/**
 * Processes video for optimization (placeholder for future implementation)
 * @param {string} videoId - ID of the video to process
 * @returns {Promise<Object>} - Processing result
 */
export const processVideo = async (videoId) => {
  // This is a placeholder for future video processing features
  // Could include:
  // - Video compression
  // - Format conversion
  // - Quality optimization
  // - Subtitle generation
  
  try {
    // For now, just mark as processed
    const { data, error } = await supabase
      .from('chatbot_videos_x7k9p2q1')
      .update({
        processing_status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', videoId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Video processing failed: ${error.message}`);
    }
    
    return { success: true, video: data };
    
  } catch (error) {
    console.error('Video processing failed:', error);
    throw error;
  }
};

/**
 * Creates storage bucket if it doesn't exist
 * @returns {Promise<void>}
 */
export const initializeVideoStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.find(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      // Create bucket
      const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        allowedMimeTypes: ALLOWED_TYPES,
        fileSizeLimit: MAX_FILE_SIZE
      });
      
      if (error) {
        console.error('Failed to create storage bucket:', error);
      } else {
        console.log('Video storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }
};
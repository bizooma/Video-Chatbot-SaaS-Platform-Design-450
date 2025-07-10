/**
 * Video utility functions for processing and validation
 */

/**
 * Compresses video file using canvas and MediaRecorder API
 * @param {File} file - The video file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} - Compressed video blob
 */
export const compressVideo = async (file, options = {}) => {
  const {
    quality = 0.8,
    maxWidth = 1280,
    maxHeight = 720,
    targetBitrate = 1000000 // 1Mbps
  } = options;
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.addEventListener('loadedmetadata', () => {
      // Calculate dimensions maintaining aspect ratio
      let { videoWidth, videoHeight } = video;
      const aspectRatio = videoWidth / videoHeight;
      
      if (videoWidth > maxWidth) {
        videoWidth = maxWidth;
        videoHeight = maxWidth / aspectRatio;
      }
      
      if (videoHeight > maxHeight) {
        videoHeight = maxHeight;
        videoWidth = maxHeight * aspectRatio;
      }
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // Setup MediaRecorder for compression
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: targetBitrate
      });
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: 'video/webm' });
        resolve(compressedBlob);
      };
      
      mediaRecorder.onerror = (error) => {
        reject(new Error(`Compression failed: ${error.message}`));
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Draw video frames to canvas
      const drawFrame = () => {
        if (video.ended || video.paused) {
          mediaRecorder.stop();
          return;
        }
        
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        requestAnimationFrame(drawFrame);
      };
      
      video.addEventListener('play', drawFrame);
      video.play();
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for compression'));
    });
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Extracts multiple thumbnails from video at different timestamps
 * @param {File} file - The video file
 * @param {number} count - Number of thumbnails to extract
 * @returns {Promise<Array>} - Array of thumbnail blobs
 */
export const extractThumbnails = async (file, count = 3) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const thumbnails = [];
    let currentIndex = 0;
    
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const interval = video.duration / (count + 1);
      const timestamps = Array.from({ length: count }, (_, i) => interval * (i + 1));
      
      const captureNext = () => {
        if (currentIndex >= timestamps.length) {
          resolve(thumbnails);
          return;
        }
        
        video.currentTime = timestamps[currentIndex];
      };
      
      video.addEventListener('seeked', () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            thumbnails.push(blob);
          }
          currentIndex++;
          captureNext();
        }, 'image/jpeg', 0.8);
      });
      
      captureNext();
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to extract thumbnails'));
    });
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Gets detailed video metadata
 * @param {File} file - The video file
 * @returns {Promise<Object>} - Video metadata
 */
export const getVideoMetadata = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.addEventListener('loadedmetadata', () => {
      const metadata = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight,
        hasAudio: false, // Will be determined by audio context
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
        bitrate: (file.size * 8) / video.duration // Approximate bitrate
      };
      
      // Check for audio track
      if (video.webkitAudioDecodedByteCount !== undefined) {
        metadata.hasAudio = video.webkitAudioDecodedByteCount > 0;
      }
      
      resolve(metadata);
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to get video metadata'));
    });
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Validates video quality and suggests optimizations
 * @param {Object} metadata - Video metadata from getVideoMetadata
 * @returns {Object} - Validation result with suggestions
 */
export const validateVideoQuality = (metadata) => {
  const suggestions = [];
  const warnings = [];
  let score = 100;
  
  // Check duration
  if (metadata.duration > 180) { // 3 minutes
    warnings.push('Video is longer than 3 minutes. Consider shortening for better engagement.');
    score -= 10;
  } else if (metadata.duration < 10) {
    warnings.push('Video is very short. Consider adding more content.');
    score -= 5;
  }
  
  // Check resolution
  if (metadata.width > 1920 || metadata.height > 1080) {
    suggestions.push('Consider reducing resolution to 1080p for faster loading.');
    score -= 5;
  } else if (metadata.width < 640 || metadata.height < 480) {
    warnings.push('Video resolution is quite low. This may affect quality.');
    score -= 10;
  }
  
  // Check file size
  const sizePerSecond = metadata.fileSize / metadata.duration;
  if (sizePerSecond > 2000000) { // 2MB per second
    suggestions.push('Video file is large. Consider compressing for faster loading.');
    score -= 10;
  }
  
  // Check aspect ratio
  const commonRatios = [16/9, 4/3, 1/1, 9/16];
  const ratio = metadata.aspectRatio;
  const isCommonRatio = commonRatios.some(r => Math.abs(r - ratio) < 0.1);
  
  if (!isCommonRatio) {
    suggestions.push('Consider using a standard aspect ratio (16:9, 4:3, 1:1, or 9:16).');
    score -= 5;
  }
  
  // Check bitrate
  if (metadata.bitrate > 5000000) { // 5Mbps
    suggestions.push('High bitrate detected. Compression could reduce file size significantly.');
    score -= 5;
  }
  
  return {
    score: Math.max(0, score),
    quality: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    suggestions,
    warnings,
    metadata
  };
};

/**
 * Formats video duration for display
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration (e.g., "2:34")
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.4 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
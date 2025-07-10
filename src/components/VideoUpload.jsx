import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../contexts/ChatbotContext';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  uploadVideo, 
  deleteVideo, 
  getChatbotVideos,
  validateVideoFile,
  initializeVideoStorage
} from '../services/videoService';

const { FiUpload, FiVideo, FiTrash2, FiPlay, FiPause, FiCheck, FiAlertCircle, FiClock, FiFileText } = FiIcons;

const VideoUpload = ({ chatbot }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { updateChatbot } = useChatbot();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Initialize storage and load videos
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeVideoStorage();
        await loadVideos();
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [chatbot.id]);

  const loadVideos = async () => {
    try {
      const chatbotVideos = await getChatbotVideos(chatbot.id, user.id);
      setVideos(chatbotVideos);
      
      // Set the first video as active if chatbot doesn't have a video URL
      if (chatbotVideos.length > 0 && !chatbot.video) {
        updateChatbot(chatbot.id, { video: chatbotVideos[0].video_url });
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadError(null);
    
    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setUploadError(validation.errors.join(', '));
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const result = await uploadVideo(file, chatbot.id, user.id);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        // Update chatbot with new video
        updateChatbot(chatbot.id, { video: result.video.url });
        
        // Reload videos
        await loadVideos();
        
        // Reset upload state
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error.message);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await deleteVideo(videoId, user.id);
      
      // If this was the active video, clear it
      const videoToRemove = videos.find(v => v.id === videoId);
      if (videoToRemove && chatbot.video === videoToRemove.video_url) {
        updateChatbot(chatbot.id, { video: null });
      }
      
      // Reload videos
      await loadVideos();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to remove video:', error);
      setUploadError(error.message);
    }
  };

  const handleSelectVideo = (video) => {
    updateChatbot(chatbot.id, { video: video.video_url });
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Video Management</h2>
        <div className="text-sm text-gray-500">
          Bot: {chatbot.name}
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <SafeIcon icon={FiAlertCircle} className="text-red-600" />
          <span className="text-red-800">{uploadError}</span>
          <button 
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Uploading Video...</span>
            <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Current Video Display */}
      {chatbot.video && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Video</h3>
          <div className="relative max-w-md mx-auto">
            <video
              ref={videoRef}
              src={chatbot.video}
              className="w-full rounded-lg shadow-sm"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <button
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors rounded-lg"
            >
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-gray-800 text-2xl" />
              </div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Video Library */}
      {videos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Library</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-colors ${
                  chatbot.video === video.video_url 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectVideo(video)}
              >
                {video.thumbnail_url ? (
                  <img 
                    src={video.thumbnail_url} 
                    alt="Video thumbnail"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <SafeIcon icon={FiVideo} className="text-gray-400 text-2xl" />
                  </div>
                )}
                
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{video.file_name}</h4>
                    {chatbot.video === video.video_url && (
                      <SafeIcon icon={FiCheck} className="text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{formatFileSize(video.file_size)}</span>
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveVideo(video.id);
                        }}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUpload} className="text-gray-500 text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload a new video
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your video file here, or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Choose Video File
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Guidelines */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
          <SafeIcon icon={FiFileText} />
          <span>Video Guidelines</span>
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Maximum file size: 100MB</li>
          <li>• Supported formats: MP4, WebM, MOV, AVI</li>
          <li>• Recommended length: 30 seconds to 2 minutes</li>
          <li>• Use clear audio and good lighting</li>
          <li>• Videos are automatically optimized for web delivery</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUpload;
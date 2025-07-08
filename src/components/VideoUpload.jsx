import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../contexts/ChatbotContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiVideo, FiTrash2, FiPlay, FiPause } = FiIcons;

const VideoUpload = ({ chatbot }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { updateChatbot } = useChatbot();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

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

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateChatbot(chatbot.id, { video: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveVideo = () => {
    updateChatbot(chatbot.id, { video: null });
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Video Upload</h2>
        <div className="text-sm text-gray-500">
          Bot: {chatbot.name}
        </div>
      </div>

      {!chatbot.video ? (
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
                Upload your support video
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Video</h3>
              <button
                onClick={handleRemoveVideo}
                className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiTrash2} />
                <span>Remove</span>
              </button>
            </div>
            
            <div className="relative">
              <video
                ref={videoRef}
                src={chatbot.video}
                className="w-full max-w-md mx-auto rounded-lg shadow-sm"
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
                  <SafeIcon 
                    icon={isPlaying ? FiPause : FiPlay} 
                    className="text-gray-800 text-2xl" 
                  />
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiVideo} />
              <span>Replace Video</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </motion.div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Video Guidelines:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep videos under 2 minutes for best engagement</li>
          <li>• Use clear audio and good lighting</li>
          <li>• Supported formats: MP4, WebM, OGV</li>
          <li>• Maximum file size: 50MB</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUpload;
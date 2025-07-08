import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../contexts/ChatbotContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiUpload,
  FiLink,
  FiTrash2,
  FiSave,
  FiRefreshCw,
  FiFile,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiBook,
  FiPlus,
  FiX
} = FiIcons;

const ChatbotTraining = ({ chatbot }) => {
  const { updateChatbot } = useChatbot();
  const [activeTab, setActiveTab] = useState('documents');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  // Document upload state
  const [documents, setDocuments] = useState(chatbot.trainingData?.documents || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // URL training state
  const [urls, setUrls] = useState(chatbot.trainingData?.urls || []);
  const [newUrl, setNewUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState({});
  
  // FAQ training state
  const [faqs, setFaqs] = useState(chatbot.trainingData?.faqs || []);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  
  // Training settings
  const [trainingSettings, setTrainingSettings] = useState({
    responseStyle: chatbot.trainingData?.settings?.responseStyle || 'friendly',
    maxResponseLength: chatbot.trainingData?.settings?.maxResponseLength || 150,
    includeContext: chatbot.trainingData?.settings?.includeContext || true,
    fallbackMessage: chatbot.trainingData?.settings?.fallbackMessage || "I'm sorry, I don't have information about that. Would you like to speak with someone from our team?"
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const handleFileUpload = async (files) => {
    const supportedTypes = ['text/plain', 'application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    for (const file of files) {
      if (supportedTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const newDoc = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'processing',
          content: await readFileContent(file)
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        // Simulate processing
        setTimeout(() => {
          setDocuments(prev => prev.map(doc => 
            doc.id === newDoc.id ? { ...doc, status: 'processed' } : doc
          ));
        }, 2000);
      }
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const addUrl = async () => {
    if (!newUrl.trim()) return;
    
    const urlId = Date.now();
    const newUrlObj = {
      id: urlId,
      url: newUrl.trim(),
      addedAt: new Date().toISOString(),
      status: 'processing',
      title: '',
      content: ''
    };
    
    setUrls(prev => [...prev, newUrlObj]);
    setUrlStatus(prev => ({ ...prev, [urlId]: 'processing' }));
    setNewUrl('');
    
    // Simulate URL processing
    setTimeout(() => {
      setUrls(prev => prev.map(url => 
        url.id === urlId 
          ? { 
              ...url, 
              status: 'processed',
              title: `Content from ${new URL(url.url).hostname}`,
              content: 'Extracted content from webpage...'
            } 
          : url
      ));
      setUrlStatus(prev => ({ ...prev, [urlId]: 'processed' }));
    }, 3000);
  };

  const removeUrl = (id) => {
    setUrls(prev => prev.filter(url => url.id !== id));
  };

  const addFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    
    const faqObj = {
      id: Date.now(),
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim(),
      addedAt: new Date().toISOString()
    };
    
    setFaqs(prev => [...prev, faqObj]);
    setNewFaq({ question: '', answer: '' });
  };

  const removeFaq = (id) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          // Save training data to chatbot
          const trainingData = {
            documents,
            urls,
            faqs,
            settings: trainingSettings,
            lastTrained: new Date().toISOString(),
            status: 'trained'
          };
          
          updateChatbot(chatbot.id, { 
            trainingData,
            isAiTrained: true 
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const tabs = [
    { id: 'documents', label: 'Documents', icon: FiFile },
    { id: 'urls', label: 'Websites', icon: FiGlobe },
    { id: 'faqs', label: 'FAQs', icon: FiBook },
    { id: 'settings', label: 'Settings', icon: FiRefreshCw }
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Training</h2>
        <button
          onClick={startTraining}
          disabled={isTraining || (documents.length === 0 && urls.length === 0 && faqs.length === 0)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SafeIcon icon={isTraining ? FiRefreshCw : FiSave} className={isTraining ? 'animate-spin' : ''} />
          <span>{isTraining ? 'Training...' : 'Train Chatbot'}</span>
        </button>
      </div>

      {/* Training Progress */}
      {isTraining && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Training Progress</span>
            <span className="text-sm font-medium text-blue-900">{trainingProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${trainingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SafeIcon icon={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <SafeIcon icon={FiUpload} className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Training Documents
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported: PDF, TXT, DOC, CSV, Markdown
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx,.csv,.md"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Document List */}
            {documents.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiFile} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {doc.status === 'processing' && (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Processing...</span>
                        </div>
                      )}
                      {doc.status === 'processed' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <SafeIcon icon={FiCheckCircle} />
                          <span className="text-sm">Ready</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'urls' && (
          <div className="space-y-6">
            {/* URL Input */}
            <div className="flex space-x-4">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter website URL to train from..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              />
              <button
                onClick={addUrl}
                disabled={!newUrl.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Add URL</span>
              </button>
            </div>

            {/* URL List */}
            {urls.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Training URLs</h4>
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiGlobe} className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {url.title || new URL(url.url).hostname}
                        </p>
                        <p className="text-sm text-gray-500">{url.url}</p>
                        <p className="text-xs text-gray-400">
                          Added {new Date(url.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {url.status === 'processing' && (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Crawling...</span>
                        </div>
                      )}
                      {url.status === 'processed' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <SafeIcon icon={FiCheckCircle} />
                          <span className="text-sm">Ready</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeUrl(url.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            {/* FAQ Input */}
            <div className="space-y-4 p-6 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">Add New FAQ</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="What question do visitors commonly ask?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                  rows={4}
                  placeholder="Provide a helpful answer..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addFaq}
                disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Add FAQ</span>
              </button>
            </div>

            {/* FAQ List */}
            {faqs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Custom FAQs</h4>
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{faq.question}</h5>
                      <button
                        onClick={() => removeFaq(faq.id)}
                        className="text-red-600 hover:text-red-700 transition-colors ml-4"
                      >
                        <SafeIcon icon={FiX} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{faq.answer}</p>
                    <p className="text-xs text-gray-400">
                      Added {new Date(faq.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Response Style
              </label>
              <select
                value={trainingSettings.responseStyle}
                onChange={(e) => setTrainingSettings(prev => ({ ...prev, responseStyle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="friendly">Friendly & Conversational</option>
                <option value="professional">Professional & Formal</option>
                <option value="casual">Casual & Relaxed</option>
                <option value="empathetic">Empathetic & Supportive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Maximum Response Length
              </label>
              <select
                value={trainingSettings.maxResponseLength}
                onChange={(e) => setTrainingSettings(prev => ({ ...prev, maxResponseLength: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={100}>Short (100 characters)</option>
                <option value={150}>Medium (150 characters)</option>
                <option value={200}>Long (200 characters)</option>
                <option value={300}>Very Long (300 characters)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fallback Message
              </label>
              <textarea
                value={trainingSettings.fallbackMessage}
                onChange={(e) => setTrainingSettings(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                rows={3}
                placeholder="Message to show when the chatbot doesn't know the answer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Include Context</h4>
                <p className="text-sm text-gray-600">Use conversation history for better responses</p>
              </div>
              <button
                onClick={() => setTrainingSettings(prev => ({ ...prev, includeContext: !prev.includeContext }))}
                className="flex items-center"
              >
                <SafeIcon 
                  icon={trainingSettings.includeContext ? FiIcons.FiToggleRight : FiIcons.FiToggleLeft} 
                  className={`text-3xl ${trainingSettings.includeContext ? 'text-blue-600' : 'text-gray-400'}`} 
                />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Training Status */}
      {chatbot.trainingData?.status === 'trained' && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheckCircle} className="text-green-600" />
            <div>
              <p className="font-medium text-green-900">Chatbot Successfully Trained</p>
              <p className="text-sm text-green-700">
                Last trained: {new Date(chatbot.trainingData.lastTrained).toLocaleString()}
              </p>
              <p className="text-sm text-green-700">
                Training data: {documents.length} documents, {urls.length} URLs, {faqs.length} FAQs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotTraining;
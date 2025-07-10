import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../contexts/ChatbotContext';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  uploadTrainingDocument, 
  addTrainingUrl, 
  addTrainingFaq, 
  getTrainingData,
  deleteTrainingData,
  trainChatbot
} from '../services/trainingService';
import { isValidTrainingFile, formatFileSize } from '../utils/fileUtils';
import { isValidUrl, getDomainFromUrl } from '../utils/webUtils';

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
  FiX,
  FiInfo,
  FiLock,
  FiMessageCircle,
  FiSettings,
  FiAlertTriangle,
  FiDownload,
  FiFileText,
  FiClock,
  FiToggleLeft,
  FiToggleRight
} = FiIcons;

const EnhancedChatbotTraining = ({ chatbot }) => {
  const { updateChatbot } = useChatbot();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isPlanLimited, setIsPlanLimited] = useState(false);
  
  // Document upload state
  const [documents, setDocuments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // URL training state
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState({});
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  
  // FAQ training state
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  
  // Training settings
  const [trainingSettings, setTrainingSettings] = useState({
    responseStyle: chatbot.trainingData?.settings?.responseStyle || 'friendly',
    maxResponseLength: chatbot.trainingData?.settings?.maxResponseLength || 150,
    includeContext: chatbot.trainingData?.settings?.includeContext || true,
    fallbackMessage: chatbot.trainingData?.settings?.fallbackMessage || "I'm sorry, I don't have information about that. Would you like to speak with someone from our team?"
  });

  // Load training data on component mount
  useEffect(() => {
    const loadTrainingData = async () => {
      try {
        // Check if user is on a paid plan
        if (user.plan !== 'pro' && user.plan !== 'enterprise') {
          setIsPlanLimited(true);
          return;
        }
        
        setIsPlanLimited(false);
        const data = await getTrainingData(chatbot.id);
        
        // Organize data by type
        const docs = data.filter(item => item.type === 'document');
        const urlData = data.filter(item => item.type === 'url');
        const faqData = data.filter(item => item.type === 'faq');
        
        setDocuments(docs);
        setUrls(urlData);
        
        // Parse FAQ data
        const parsedFaqs = faqData.map(faq => {
          const content = faq.content;
          let question = faq.title;
          let answer = '';
          
          // Try to extract Q&A format if available
          if (content.includes('Q:') && content.includes('A:')) {
            const qPart = content.split('A:')[0];
            question = qPart.replace('Q:', '').trim();
            answer = content.split('A:')[1].trim();
          } else {
            answer = content;
          }
          
          return {
            id: faq.id,
            question,
            answer,
            status: faq.status,
            addedAt: faq.created_at
          };
        });
        
        setFaqs(parsedFaqs);
      } catch (error) {
        console.error('Failed to load training data:', error);
      }
    };
    
    loadTrainingData();
  }, [chatbot.id, user.plan]);

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
    
    if (isPlanLimited) {
      return;
    }
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const handleFileUpload = async (files) => {
    const validFiles = files.filter(file => isValidTrainingFile(file));
    
    for (const file of validFiles) {
      try {
        // Add file to state with processing status
        const tempId = Date.now() + Math.random();
        const newDoc = {
          id: tempId,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'processing'
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        // Upload file for processing
        const result = await uploadTrainingDocument({
          chatbotId: chatbot.id,
          userId: user.id,
          file
        });
        
        // Update document with real ID and status
        setDocuments(prev => prev.map(doc => 
          doc.id === tempId 
            ? { ...doc, id: result.documentId, status: 'processed' } 
            : doc
        ));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        // Update document with error status - use file name to identify since tempId might be out of scope
        setDocuments(prev => prev.map(doc => 
          doc.name === file.name && doc.status === 'processing'
            ? { ...doc, status: 'failed', error: error.message }
            : doc
        ));
      }
    }
  };

  const handleFileSelect = (e) => {
    if (isPlanLimited) {
      return;
    }
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const removeDocument = async (id) => {
    try {
      await deleteTrainingData(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Failed to remove document:', error);
    }
  };

  const addUrl = async () => {
    if (!newUrl.trim() || isPlanLimited) return;
    
    setIsValidatingUrl(true);
    
    try {
      // Validate URL first
      const valid = await isValidUrl(newUrl);
      if (!valid) {
        throw new Error('Invalid or inaccessible URL');
      }
      
      const urlId = Date.now();
      const newUrlObj = {
        id: urlId,
        url: newUrl.trim(),
        addedAt: new Date().toISOString(),
        status: 'processing',
        domain: getDomainFromUrl(newUrl.trim())
      };
      
      setUrls(prev => [...prev, newUrlObj]);
      setUrlStatus(prev => ({ ...prev, [urlId]: 'processing' }));
      setNewUrl('');
      
      // Add URL for processing
      const result = await addTrainingUrl({
        chatbotId: chatbot.id,
        userId: user.id,
        url: newUrl.trim()
      });
      
      // Update URL with real ID
      setUrls(prev => prev.map(url => 
        url.id === urlId 
          ? { ...url, id: result.urlId } 
          : url
      ));
      
      // URL processing is handled asynchronously by the server
      // Status will be updated on next data load
    } catch (error) {
      console.error('Failed to add URL:', error);
      setUrlStatus(prev => ({ ...prev, [newUrl]: 'failed' }));
    } finally {
      setIsValidatingUrl(false);
    }
  };

  const removeUrl = async (id) => {
    try {
      await deleteTrainingData(id);
      setUrls(prev => prev.filter(url => url.id !== id));
    } catch (error) {
      console.error('Failed to remove URL:', error);
    }
  };

  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim() || isPlanLimited) return;
    
    try {
      // Add FAQ to state with processing status
      const faqTempId = Date.now(); // Use a specific variable name for FAQ
      const faqObj = {
        id: faqTempId,
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        addedAt: new Date().toISOString(),
        status: 'processing'
      };
      
      setFaqs(prev => [...prev, faqObj]);
      
      // Add FAQ for processing
      const result = await addTrainingFaq({
        chatbotId: chatbot.id,
        userId: user.id,
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim()
      });
      
      // Update FAQ with real ID
      setFaqs(prev => prev.map(faq => 
        faq.id === faqTempId 
          ? { ...faq, id: result.faqId, status: 'processed' } 
          : faq
      ));
      
      // Reset form
      setNewFaq({ question: '', answer: '' });
    } catch (error) {
      console.error('Failed to add FAQ:', error);
      // Update FAQ with error status using the specific FAQ temp ID
      const faqTempId = Date.now();
      setFaqs(prev => prev.map(faq => 
        faq.id === faqTempId
          ? { ...faq, status: 'failed', error: error.message }
          : faq
      ));
    }
  };

  const removeFaq = async (id) => {
    try {
      await deleteTrainingData(id);
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (error) {
      console.error('Failed to remove FAQ:', error);
    }
  };

  const startTraining = async () => {
    if (isPlanLimited) return;
    
    setIsTraining(true);
    setTrainingProgress(0);
    
    try {
      // Start progress animation
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + (95 - prev) / 10;
        });
      }, 500);
      
      // Train chatbot with all the data
      const result = await trainChatbot(chatbot.id);
      
      // Complete progress
      clearInterval(interval);
      setTrainingProgress(100);
      
      // Save training data to chatbot
      const trainingData = {
        settings: trainingSettings,
        lastTrained: result.lastTrained,
        status: 'trained'
      };
      
      updateChatbot(chatbot.id, { 
        trainingData,
        isAiTrained: true 
      });
      
      // Reset training state after a delay
      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Training failed:', error);
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  const tabs = [
    { id: 'documents', label: 'Documents', icon: FiFile },
    { id: 'urls', label: 'Websites', icon: FiGlobe },
    { id: 'faqs', label: 'FAQs', icon: FiBook },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  // Render plan upgrade message if user is not on a paid plan
  if (isPlanLimited) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">AI Training</h2>
        </div>
        
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiLock} className="text-amber-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Upgrade to Access AI Training
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            AI training is available on our Pro and Enterprise plans. Upgrade to train your chatbot with your own documents, websites, and FAQs.
          </p>
          <button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
            onClick={() => window.location.hash = '#pricing'}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-sm font-medium text-blue-900">{Math.round(trainingProgress)}%</span>
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
      <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SafeIcon icon={tab.icon} />
            <span>{tab.label}</span>
            {tab.id === 'documents' && documents.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">
                {documents.length}
              </span>
            )}
            {tab.id === 'urls' && urls.length > 0 && (
              <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2 py-0.5">
                {urls.length}
              </span>
            )}
            {tab.id === 'faqs' && faqs.length > 0 && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium rounded-full px-2 py-0.5">
                {faqs.length}
              </span>
            )}
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
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                  <span className="text-sm text-gray-500">
                    {documents.length} document{documents.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <SafeIcon icon={
                          doc.type?.includes('pdf') ? FiFileText :
                          doc.type?.includes('word') ? FiFileText :
                          FiFile
                        } className="text-blue-600" />
                      </div>
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
                      {doc.status === 'failed' && (
                        <div className="flex items-center space-x-2 text-red-600" title={doc.error || 'Processing failed'}>
                          <SafeIcon icon={FiAlertCircle} />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                        title="Remove document"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Document Tips */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex space-x-3">
                <SafeIcon icon={FiInfo} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Tips for effective document training</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use clear, well-formatted documents for best results</li>
                    <li>• Break large documents into smaller, focused files</li>
                    <li>• Include frequently asked questions and their answers</li>
                    <li>• Provide mission statements, policies, and key information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'urls' && (
          <div className="space-y-6">
            {/* URL Input */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Enter website URL to train from..."
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addUrl()}
                />
                {isValidatingUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                onClick={addUrl}
                disabled={!newUrl.trim() || isValidatingUrl}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
              >
                <SafeIcon icon={FiPlus} />
                <span>Add URL</span>
              </button>
            </div>

            {/* URL List */}
            {urls.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Training URLs</h4>
                  <span className="text-sm text-gray-500">
                    {urls.length} URL{urls.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <SafeIcon icon={FiGlobe} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {url.title || url.domain || new URL(url.url).hostname}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-md">{url.url}</p>
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
                      {url.status === 'failed' && (
                        <div className="flex items-center space-x-2 text-red-600" title={url.error || 'Processing failed'}>
                          <SafeIcon icon={FiAlertCircle} />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeUrl(url.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                        title="Remove URL"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* URL Training Tips */}
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex space-x-3">
                <SafeIcon icon={FiInfo} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Tips for website training</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Add your organization's website pages with key information</li>
                    <li>• Include FAQ pages, mission statements, and program details</li>
                    <li>• Add blog posts that explain your work and impact</li>
                    <li>• Make sure URLs are publicly accessible for best results</li>
                  </ul>
                </div>
              </div>
            </div>
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
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Custom FAQs</h4>
                  <span className="text-sm text-gray-500">
                    {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                          <SafeIcon icon={FiMessageCircle} className="text-purple-600 text-sm" />
                        </div>
                        <h5 className="font-medium text-gray-900">{faq.question}</h5>
                      </div>
                      <div className="flex items-center space-x-2">
                        {faq.status === 'processing' && (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs">Processing</span>
                          </div>
                        )}
                        <button
                          onClick={() => removeFaq(faq.id)}
                          className="text-red-600 hover:text-red-700 transition-colors p-1"
                          title="Remove FAQ"
                        >
                          <SafeIcon icon={FiX} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 ml-9">{faq.answer}</p>
                    <p className="text-xs text-gray-400 ml-9">
                      Added {new Date(faq.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {/* FAQ Tips */}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex space-x-3">
                <SafeIcon icon={FiInfo} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Tips for effective FAQs</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Write questions as your visitors would ask them</li>
                    <li>• Keep answers clear, concise, and accurate</li>
                    <li>• Include FAQs about donation process, volunteer opportunities, and programs</li>
                    <li>• Add common questions about your organization's mission and impact</li>
                  </ul>
                </div>
              </div>
            </div>
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
                <SafeIcon icon={trainingSettings.includeContext ? FiToggleRight : FiToggleLeft} 
                  className={`text-3xl ${trainingSettings.includeContext ? 'text-blue-600' : 'text-gray-400'}`} />
              </button>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex space-x-3">
                <SafeIcon icon={FiAlertTriangle} className="text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Training Limitations</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Changes to settings require retraining the chatbot</li>
                    <li>• Each training session may take several minutes to process</li>
                    <li>• Large documents may be truncated to optimize performance</li>
                    <li>• Training quality depends on the quality of your source materials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Training Status */}
      {chatbot.trainingData?.status === 'trained' && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheckCircle} className="text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-green-900">Chatbot Successfully Trained</p>
              <p className="text-sm text-green-700">
                Last trained: {new Date(chatbot.trainingData.lastTrained).toLocaleString()}
              </p>
              <p className="text-sm text-green-700">
                Training data: {documents.length} documents, {urls.length} URLs, {faqs.length} FAQs
              </p>
            </div>
            <button 
              onClick={() => window.location.hash = '#preview'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <SafeIcon icon={FiMessageCircle} />
              <span>Test Chatbot</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatbotTraining;
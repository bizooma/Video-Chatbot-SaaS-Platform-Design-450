import supabase from '../lib/supabase';
import { extractTextFromFile } from '../utils/fileUtils';
import { fetchUrlContent } from '../utils/webUtils';

/**
 * Uploads a document for chatbot training
 * @param {Object} data - Document data
 * @param {string} data.chatbotId - ID of the chatbot
 * @param {string} data.userId - ID of the user
 * @param {File} data.file - The file to upload
 * @returns {Promise<Object>} - Result of the upload
 */
export const uploadTrainingDocument = async (data) => {
  try {
    const { chatbotId, userId, file } = data;
    
    // Extract text from file
    const content = await extractTextFromFile(file);
    
    // Store in database
    const { data: trainingData, error } = await supabase
      .from('chatbot_training_data_xp7l3k2q')
      .insert({
        chatbot_id: chatbotId,
        user_id: userId,
        title: file.name,
        content,
        type: 'document',
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        status: 'processing'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error storing training document:', error);
      throw new Error('Failed to store training document');
    }
    
    // Process the document (convert to embeddings)
    // This would normally call your AI service to process the text
    // For now we'll simulate this with a timeout
    setTimeout(async () => {
      await updateTrainingDataStatus(trainingData.id, 'processed');
    }, 3000);
    
    return { success: true, documentId: trainingData.id };
  } catch (error) {
    console.error('Document upload failed:', error);
    throw error;
  }
};

/**
 * Adds a URL for chatbot training
 * @param {Object} data - URL data
 * @param {string} data.chatbotId - ID of the chatbot
 * @param {string} data.userId - ID of the user
 * @param {string} data.url - The URL to scrape and train from
 * @returns {Promise<Object>} - Result of the URL addition
 */
export const addTrainingUrl = async (data) => {
  try {
    const { chatbotId, userId, url } = data;
    
    // First add the URL to the database with pending status
    const { data: trainingData, error } = await supabase
      .from('chatbot_training_data_xp7l3k2q')
      .insert({
        chatbot_id: chatbotId,
        user_id: userId,
        title: url,
        content: '', // Will be populated after scraping
        type: 'url',
        url,
        status: 'processing'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error storing training URL:', error);
      throw new Error('Failed to store training URL');
    }
    
    // Fetch content from URL (in a real app, this would be done in a background job)
    try {
      const content = await fetchUrlContent(url);
      
      // Update the database with the content
      await supabase
        .from('chatbot_training_data_xp7l3k2q')
        .update({
          content,
          title: content.title || url,
          updated_at: new Date().toISOString()
        })
        .eq('id', trainingData.id);
        
      // Process the content (convert to embeddings)
      // This would normally call your AI service to process the text
      // For now we'll simulate this with a timeout
      setTimeout(async () => {
        await updateTrainingDataStatus(trainingData.id, 'processed');
      }, 3000);
    } catch (urlError) {
      console.error('Error fetching URL content:', urlError);
      await updateTrainingDataStatus(trainingData.id, 'failed', urlError.message);
    }
    
    return { success: true, urlId: trainingData.id };
  } catch (error) {
    console.error('URL training addition failed:', error);
    throw error;
  }
};

/**
 * Adds a FAQ for chatbot training
 * @param {Object} data - FAQ data
 * @param {string} data.chatbotId - ID of the chatbot
 * @param {string} data.userId - ID of the user
 * @param {string} data.question - The FAQ question
 * @param {string} data.answer - The FAQ answer
 * @returns {Promise<Object>} - Result of the FAQ addition
 */
export const addTrainingFaq = async (data) => {
  try {
    const { chatbotId, userId, question, answer } = data;
    
    const content = `Q: ${question}\nA: ${answer}`;
    
    // Store in database
    const { data: trainingData, error } = await supabase
      .from('chatbot_training_data_xp7l3k2q')
      .insert({
        chatbot_id: chatbotId,
        user_id: userId,
        title: question,
        content,
        type: 'faq',
        status: 'processing'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error storing training FAQ:', error);
      throw new Error('Failed to store training FAQ');
    }
    
    // Process the FAQ (convert to embeddings)
    // This would normally call your AI service to process the text
    // For now we'll simulate this with a timeout
    setTimeout(async () => {
      await updateTrainingDataStatus(trainingData.id, 'processed');
    }, 1000);
    
    return { success: true, faqId: trainingData.id };
  } catch (error) {
    console.error('FAQ addition failed:', error);
    throw error;
  }
};

/**
 * Updates the status of a training data item
 * @param {string} id - ID of the training data
 * @param {string} status - New status
 * @param {string} errorMessage - Optional error message
 * @returns {Promise<Object>} - Result of the update
 */
export const updateTrainingDataStatus = async (id, status, errorMessage = null) => {
  try {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (errorMessage) {
      updateData.error_message = errorMessage;
    }
    
    const { data, error } = await supabase
      .from('chatbot_training_data_xp7l3k2q')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating training data status:', error);
      throw new Error('Failed to update training data status');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Status update failed:', error);
    throw error;
  }
};

/**
 * Gets all training data for a chatbot
 * @param {string} chatbotId - ID of the chatbot
 * @returns {Promise<Array>} - Array of training data items
 */
export const getTrainingData = async (chatbotId) => {
  try {
    const { data, error } = await supabase
      .from('chatbot_training_data_xp7l3k2q')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching training data:', error);
      throw new Error('Failed to fetch training data');
    }
    
    return data || [];
  } catch (error) {
    console.error('Get training data failed:', error);
    throw error;
  }
};

/**
 * Deletes a training data item
 * @param {string} id - ID of the training data to delete
 * @returns {Promise<Object>} - Result of the deletion
 */
export const deleteTrainingData = async (id) => {
  try {
    const { error } = await supabase
      .from('chatbot_training_data_xp7l3k2q')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting training data:', error);
      throw new Error('Failed to delete training data');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Delete training data failed:', error);
    throw error;
  }
};

/**
 * Trains a chatbot with all its training data
 * @param {string} chatbotId - ID of the chatbot to train
 * @returns {Promise<Object>} - Result of the training
 */
export const trainChatbot = async (chatbotId) => {
  try {
    // In a real implementation, this would send a request to your AI service
    // to train the chatbot with all the processed data
    // For now, we'll just simulate a successful training
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return { 
      success: true, 
      message: 'Chatbot trained successfully',
      lastTrained: new Date().toISOString()
    };
  } catch (error) {
    console.error('Chatbot training failed:', error);
    throw error;
  }
};
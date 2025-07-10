/**
 * Extracts text content from different file types
 * @param {File} file - The file to extract text from
 * @returns {Promise<string>} - The extracted text
 */
export const extractTextFromFile = async (file) => {
  // In a real implementation, you would use libraries to extract text from different file types
  // For this demo, we'll just read text files directly and simulate extraction for other types
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        
        // For text files, just return the content directly
        if (file.type === 'text/plain') {
          resolve(content);
          return;
        }
        
        // For PDFs, we would normally use a PDF parsing library
        // For this demo, we'll just simulate extraction
        if (file.type === 'application/pdf') {
          // Simulate extracted text from PDF
          resolve(`Simulated extracted text from PDF: ${file.name}\n\nThis content would normally be extracted from the PDF file using a library like pdf.js or a server-side PDF parser.`);
          return;
        }
        
        // For Word documents
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.type === 'application/msword') {
          // Simulate extracted text from Word
          resolve(`Simulated extracted text from Word document: ${file.name}\n\nThis content would normally be extracted from the Word document using a library like mammoth.js or a server-side Word parser.`);
          return;
        }
        
        // For other types, just return a placeholder
        resolve(`Extracted content from ${file.name} (${file.type})`);
      } catch (error) {
        reject(new Error(`Failed to extract text from file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read the file as text (for text files) or as binary string (for other types)
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
};

/**
 * Gets file type from extension
 * @param {string} fileName - The file name
 * @returns {string} - The file type
 */
export const getFileTypeFromName = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  
  const typeMap = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    md: 'text/markdown',
    csv: 'text/csv',
    json: 'application/json',
    html: 'text/html',
    htm: 'text/html'
  };
  
  return typeMap[extension] || 'application/octet-stream';
};

/**
 * Validates if a file is an acceptable type for training
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const isValidTrainingFile = (file) => {
  const validTypes = [
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html',
    'application/json'
  ];
  
  // Check by MIME type first
  if (validTypes.includes(file.type)) {
    return true;
  }
  
  // If MIME type check fails, check by extension
  const extension = file.name.split('.').pop().toLowerCase();
  const validExtensions = ['txt', 'md', 'csv', 'pdf', 'doc', 'docx', 'html', 'htm', 'json'];
  
  return validExtensions.includes(extension);
};

/**
 * Format file size in a human-readable format
 * @param {number} bytes - The file size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
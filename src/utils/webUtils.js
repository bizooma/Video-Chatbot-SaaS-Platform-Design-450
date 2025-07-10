/**
 * Fetches content from a URL for training
 * @param {string} url - The URL to fetch content from
 * @returns {Promise<Object>} - The fetched content and metadata
 */
export const fetchUrlContent = async (url) => {
  try {
    // In a real implementation, this would be a server-side function
    // that scrapes the content from the URL
    // For this demo, we'll simulate fetching content
    
    // First, check if the URL is valid
    new URL(url); // Will throw if invalid
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, generate simulated content based on the URL
    const domain = new URL(url).hostname;
    const path = new URL(url).pathname;
    
    // Simulate different content based on domain
    let title, content;
    
    if (domain.includes('example.com')) {
      title = 'Example Domain';
      content = 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.';
    } else if (domain.includes('wikipedia.org')) {
      title = `Wikipedia: ${path.split('/').pop().replace(/-/g, ' ')}`;
      content = `This is simulated Wikipedia content for ${path.split('/').pop().replace(/-/g, ' ')}. In a real implementation, this would be the actual content scraped from the Wikipedia page.`;
    } else if (domain.includes('github.com')) {
      title = `GitHub: ${path.split('/').slice(1, 3).join('/')}`;
      content = `This is simulated GitHub repository content for ${path.split('/').slice(1, 3).join('/')}. In a real implementation, this would be the actual content scraped from the GitHub repository.`;
    } else {
      title = `Content from ${domain}`;
      content = `This is simulated content from ${url}. In a real implementation, this would be the actual content scraped from the website.`;
    }
    
    return {
      title,
      content,
      url,
      domain,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
      throw new Error('Invalid URL format');
    }
    throw new Error(`Failed to fetch content from URL: ${error.message}`);
  }
};

/**
 * Validates if a URL is valid and accessible
 * @param {string} url - The URL to validate
 * @returns {Promise<boolean>} - Whether the URL is valid
 */
export const isValidUrl = async (url) => {
  try {
    // Check if the URL is valid
    new URL(url);
    
    // In a real implementation, you would make a HEAD request to check if the URL is accessible
    // For this demo, we'll just simulate it
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Extracts domain name from URL
 * @param {string} url - The URL to extract domain from
 * @returns {string} - The domain name
 */
export const getDomainFromUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
};
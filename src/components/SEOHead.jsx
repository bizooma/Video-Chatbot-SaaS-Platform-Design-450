import React from 'react';

const SEOHead = ({
  title = "NPO Bots - AI Chatbots Built for Nonprofits | Increase Donations & Volunteers",
  description = "Transform your nonprofit's website with AI-powered chatbots. Increase donations by 300%, boost volunteer signups, and engage supporters 24/7. Built specifically for nonprofits. Start free trial.",
  keywords = "nonprofit chatbot,donation chatbot,volunteer recruitment,nonprofit AI,charity chatbot,fundraising automation,nonprofit marketing,volunteer management,donation optimization,nonprofit technology",
  canonicalUrl = "https://npobots.com",
  ogImage = "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752002958443-npobots-logo.png",
  pageType = "website",
  structuredData = null
}) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://npobots.com/#organization",
        "name": "NPO Bots",
        "alternateName": "NPOBots",
        "url": "https://npobots.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752002958443-npobots-logo.png",
          "width": 300,
          "height": 100
        },
        "description": "AI-powered chatbots built specifically for nonprofit organizations to increase donations, recruit volunteers, and engage supporters.",
        "foundingDate": "2024",
        "founder": {
          "@type": "Person",
          "name": "Joe Bizooma"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-845-377-9730",
          "contactType": "customer service",
          "email": "joe@bizooma.com"
        },
        "sameAs": [
          "https://bizooma.com"
        ],
        "areaServed": "United States",
        "serviceType": "SaaS Chatbot Platform",
        "award": "Veteran-Owned Small Business"
      },
      {
        "@type": "WebSite",
        "@id": "https://npobots.com/#website",
        "url": "https://npobots.com",
        "name": "NPO Bots",
        "description": description,
        "publisher": {
          "@id": "https://npobots.com/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "SoftwareApplication",
        "name": "NPO Bots Chatbot Platform",
        "description": "AI-powered chatbot platform designed specifically for nonprofit organizations",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web-based",
        "offers": {
          "@type": "Offer",
          "price": "99",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "AI-powered chat responses",
          "Volunteer recruitment forms", 
          "Donation collection",
          "Video message integration",
          "Custom branding",
          "Analytics dashboard",
          "Email integration",
          "Phone integration"
        ]
      },
      {
        "@type": "Service",
        "name": "Nonprofit Chatbot Development",
        "description": "Custom AI chatbot development for nonprofit organizations to increase engagement and donations",
        "provider": {
          "@id": "https://npobots.com/#organization"
        },
        "areaServed": "United States",
        "audience": {
          "@type": "Audience",
          "name": "Nonprofit Organizations"
        }
      }
    ]
  };

  // Set document title and meta tags using DOM manipulation since we don't have react-helmet-async
  React.useEffect(() => {
    // Set title
    document.title = title;
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
    }

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = keywords;
      document.head.appendChild(metaKeywords);
    }

    // Set canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
    }

    // Set Open Graph meta tags
    const ogTags = [
      { property: 'og:type', content: pageType },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'NPO Bots - AI Chatbots for Nonprofits' },
      { property: 'og:site_name', content: 'NPO Bots' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', tag.content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        metaTag.setAttribute('content', tag.content);
        document.head.appendChild(metaTag);
      }
    });

    // Set Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: canonicalUrl },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:image:alt', content: 'NPO Bots - AI Chatbots for Nonprofits' }
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', tag.content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        metaTag.setAttribute('content', tag.content);
        document.head.appendChild(metaTag);
      }
    });

    // Set structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]#seo-structured-data');
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData || defaultStructuredData);
    } else {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.id = 'seo-structured-data';
      structuredDataScript.textContent = JSON.stringify(structuredData || defaultStructuredData);
      document.head.appendChild(structuredDataScript);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, pageType, structuredData]);

  return null; // This component doesn't render anything visible
};

export default SEOHead;
import React from 'react';

const VoiceSEOContent = () => {
  // This component contains content specifically optimized for voice search
  // Hidden from visual display but crawlable by search engines
  
  const voiceSearchQuestions = [
    {
      question: "What is NPO Bots?",
      answer: "NPO Bots is an AI-powered chatbot platform built specifically for nonprofit organizations. It helps nonprofits increase donations, recruit volunteers, and engage supporters through intelligent chatbots on their websites."
    },
    {
      question: "How much does NPO Bots cost?",
      answer: "NPO Bots costs $99 per month for one chatbot on one website, including advanced analytics, priority support, custom branding, and all nonprofit features."
    },
    {
      question: "How can chatbots help nonprofits?",
      answer: "Chatbots help nonprofits by providing 24/7 supporter engagement, collecting volunteer information, processing donations, answering common questions, and increasing conversion rates by up to 300%."
    },
    {
      question: "What features does NPO Bots include?",
      answer: "NPO Bots includes AI chat responses, volunteer signup forms, donation collection buttons, video message integration, email and phone buttons, custom branding, analytics dashboard, and priority support."
    },
    {
      question: "Is NPO Bots veteran owned?",
      answer: "Yes, NPO Bots is proudly veteran-owned and operated, with 100% US-based staff providing quality support and ensuring data security for nonprofit organizations."
    },
    {
      question: "How long does it take to set up a nonprofit chatbot?",
      answer: "Most nonprofits can launch their chatbot in under 10 minutes using NPO Bots' intuitive builder. No technical skills or coding required."
    },
    {
      question: "Can NPO Bots integrate with my nonprofit website?",
      answer: "Yes, NPO Bots can be embedded on any website platform including WordPress, Wix, Squarespace, and more. Just copy and paste a simple code script."
    },
    {
      question: "How do nonprofit chatbots increase donations?",
      answer: "Nonprofit chatbots increase donations by providing instant engagement, emotional video messages, quick donation buttons with preset amounts, and personalized supporter interactions that build trust and urgency."
    }
  ];

  const structuredFAQData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": voiceSearchQuestions.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Voice Search Optimized Content - Hidden but Crawlable */}
      <div className="sr-only" aria-hidden="true">
        <h2>Voice Search Answers for NPO Bots</h2>
        {voiceSearchQuestions.map((faq, index) => (
          <div key={index}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredFAQData)}
      </script>

      {/* Business Hours Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "NPO Bots",
          "telephone": "+1-845-377-9730",
          "email": "joe@bizooma.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "2465 US-1S, Suite 1045",
            "addressLocality": "St. Augustine",
            "addressRegion": "FL",
            "postalCode": "32086",
            "addressCountry": "US"
          },
          "openingHours": [
            "Mo-Fr 09:00-17:00"
          ],
          "timeZone": "America/New_York"
        })}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://npobots.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Nonprofit Chatbots",
              "item": "https://npobots.com#features"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Pricing",
              "item": "https://npobots.com#pricing"
            }
          ]
        })}
      </script>

      {/* Review Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "NPO Bots Chatbot Platform",
          "description": "AI-powered chatbot platform for nonprofit organizations",
          "brand": {
            "@type": "Brand",
            "name": "NPO Bots"
          },
          "offers": {
            "@type": "Offer",
            "price": "99",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "1",
            "bestRating": "5",
            "worstRating": "1"
          }
        })}
      </script>
    </>
  );
};

export default VoiceSEOContent;
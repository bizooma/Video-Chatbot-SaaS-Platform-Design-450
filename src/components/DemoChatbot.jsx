import React,{useState,useRef} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {sendEmail} from '../services/emailService';
import {saveVolunteerInfo} from '../services/volunteerService';

const {FiMessageCircle,FiMail,FiPhone,FiX,FiPlay,FiPause,FiSend,FiHeart,FiUsers,FiUser,FiCheckCircle,FiAlertCircle,FiCalendar}=FiIcons;

const DemoChatbot=()=> {
  const [isOpen,setIsOpen]=useState(false);
  const [isVideoPlaying,setIsVideoPlaying]=useState(false);
  const [isEmailModalOpen,setIsEmailModalOpen]=useState(false);
  const [isVolunteerModalOpen,setIsVolunteerModalOpen]=useState(false);
  const [messages,setMessages]=useState([
    {id: 1,text: "Hi! I'm NPO Bots demo assistant. Try out our nonprofit features - volunteer signup,donations,and more!",sender: 'bot'}
  ]);
  const [inputMessage,setInputMessage]=useState('');
  const [showVideoMessage,setShowVideoMessage]=useState(false);
  const messagesEndRef = useRef(null);

  // Email form state
  const [emailForm,setEmailForm]=useState({name: '',email: '',message: ''});
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [submitStatus,setSubmitStatus]=useState('');

  // Volunteer form state
  const [volunteerForm,setVolunteerForm]=useState({
    name: '',
    email: '',
    phone: '',
    availableDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    }
  });
  const [isSubmittingVolunteer,setIsSubmittingVolunteer]=useState(false);
  const [volunteerSubmitStatus,setVolunteerSubmitStatus]=useState('');

  // Demo nonprofit chatbot configuration - HARDCODED for this SaaS platform demo
  const demoChatbot={
    name: 'NPO Bots',
    welcomeMessage: "Hi! I'm NPO Bots demo assistant. Try out our nonprofit features!",
    email: 'joe@bizooma.com',// HARDCODED email for this demo
    phone: '845-377-9730',// HARDCODED phone number for this demo
    chatEnabled: true,
    emailEnabled: true,
    phoneEnabled: true,
    volunteerEnabled: true,
    donationEnabled: true,
    donationAmounts: [25,50,100,250],
    youtubeVideoId: 'g1wVgV58JbE',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/g1wVgV58JbE?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1',
    videoThumbnail: 'https://img.youtube.com/vi/g1wVgV58JbE/maxresdefault.jpg'
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot=()=> {
    setIsOpen(!isOpen);
    if (!isOpen && !showVideoMessage) {
      setTimeout(()=> {
        setShowVideoMessage(true);
        const videoMessage={
          id: Date.now(),
          text: "👆 Click the video above to see how NPO Bots works! Try the volunteer button and donation options below too!",
          sender: 'bot'
        };
        setMessages(prev=> [...prev,videoMessage]);
      },1000);
    }
  };

  const handleVideoClick=()=> {
    setIsVideoPlaying(true);
    const videoMessage={
      id: Date.now(),
      text: "🎥 Great! This demo shows how nonprofits can use NPO Bots to engage supporters with video,collect volunteers,and accept donations!",
      sender: 'bot'
    };
    setMessages(prev=> [...prev,videoMessage]);
  };

  const sendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    
    if (!trimmedMessage) {
      return; // Don't send empty messages
    }

    console.log('Sending message:', trimmedMessage);

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: 'user'
    };

    setMessages(prev => {
      console.log('Current messages:', prev);
      const newMessages = [...prev, userMessage];
      console.log('New messages after adding user message:', newMessages);
      return newMessages;
    });

    // Clear input
    setInputMessage('');

    // Send bot response after a delay
    setTimeout(() => {
      const responses = [
        "Thanks for trying NPO Bots! Nonprofits love how easy it is to connect with supporters.",
        "Great question! NPO Bots helps nonprofits increase volunteer signups by 300% with personalized video messages.",
        "This chat works alongside volunteer signup and donation buttons - perfect for nonprofit engagement!",
        "Ready to boost your nonprofit's impact? NPO Bots makes it easy to share your mission through video!",
        "Did you try the volunteer button? It's one of our most popular nonprofit features!",
        "The donation buttons can link to your payment processor - making giving quick and easy!",
        "Video messages create emotional connections that increase both donations and volunteer participation!",
        "You can customize everything - donation amounts, volunteer forms, and all messaging from your dashboard!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botResponse = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot'
      };

      console.log('Adding bot response:', botResponse);
      
      setMessages(prev => {
        const newMessages = [...prev, botResponse];
        console.log('Messages after adding bot response:', newMessages);
        return newMessages;
      });
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleEmailClick=()=> {
    setIsEmailModalOpen(true);
  };

  const handleEmailFormSubmit=async (e)=> {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const emailData={
        name: emailForm.name,
        email: emailForm.email,
        message: emailForm.message,
        chatbotId: 'demo',
        recipientEmail: demoChatbot.email
      };

      console.log('Sending email with data:',emailData);
      const result=await sendEmail(emailData);
      console.log('Email result:',result);

      if (result.success) {
        if (result.fallback && result.mailtoLink) {
          // Handle mailto fallback
          window.location.href=result.mailtoLink;
          const emailMessage={
            id: Date.now(),
            text: `📧 Opening your email client to send message to ${demoChatbot.email}. Please send the email from your email application.`,
            sender: 'bot'
          };
          setMessages(prev=> [...prev,emailMessage]);
        } else {
          // Show success message in chat
          const emailMessage={
            id: Date.now(),
            text: `📧 Thank you ${emailForm.name}! Your message has been sent successfully to ${demoChatbot.email}. We'll get back to you soon!`,
            sender: 'bot'
          };
          setMessages(prev=> [...prev,emailMessage]);
        }

        // Reset form and close modal
        setEmailForm({name: '',email: '',message: ''});
        setIsEmailModalOpen(false);
        setSubmitStatus('success');
      }
    } catch (error) {
      console.error('Email send error:',error);
      setSubmitStatus('error');
      // Show error message in chat
      const errorMessage={
        id: Date.now(),
        text: `❌ Sorry,there was an error sending your message: ${error.message}. Please try again or contact us directly at ${demoChatbot.email}.`,
        sender: 'bot'
      };
      setMessages(prev=> [...prev,errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolunteerFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingVolunteer(true);
    setVolunteerSubmitStatus('');

    try {
      // Check for required fields
      if (!volunteerForm.name || !volunteerForm.email) {
        throw new Error('Please fill in all required fields');
      }

      // Get selected days as array
      const selectedDays = Object.entries(volunteerForm.availableDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day);

      // Format selected days as a readable string
      const availableDaysString = selectedDays.length > 0 
        ? selectedDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')
        : 'Flexible';

      // Prepare volunteer data
      const volunteerData = {
        name: volunteerForm.name,
        email: volunteerForm.email,
        phone: volunteerForm.phone || null,
        availableDays: availableDaysString,
        chatbotId: 'demo',
        status: 'new'
      };

      console.log('Submitting volunteer data:', volunteerData);
      const result = await saveVolunteerInfo(volunteerData);
      console.log('Volunteer signup result:', result);

      if (result.success) {
        // Show success message in chat
        const volunteerMessage = {
          id: Date.now(),
          text: `🙋‍♀️ Thank you ${volunteerForm.name}! Your volunteer information has been submitted successfully. Our volunteer coordinator will contact you soon at ${volunteerForm.email} to discuss opportunities!`,
          sender: 'bot'
        };
        setMessages(prev => [...prev, volunteerMessage]);

        // Reset form and close modal
        setVolunteerForm({
          name: '',
          email: '',
          phone: '',
          availableDays: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
          }
        });
        setIsVolunteerModalOpen(false);
        setVolunteerSubmitStatus('success');
      }
    } catch (error) {
      console.error('Volunteer signup error:', error);
      setVolunteerSubmitStatus('error');
      
      // Show detailed error message in chat
      const errorMessage = {
        id: Date.now(),
        text: `❌ Sorry, there was an error submitting your volunteer information: ${error.message}. Please try again or contact us directly at ${demoChatbot.email}.`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingVolunteer(false);
    }
  };

  const handlePhoneClick=()=> {
    // HARDCODED phone for this demo - opens actual phone dialer
    window.location.href=`tel:${demoChatbot.phone}`;
    const phoneMessage={
      id: Date.now(),
      text: "📞 Calling 845-377-9730! In the full platform,this would be your nonprofit's custom phone number that supporters can reach.",
      sender: 'bot'
    };
    setMessages(prev=> [...prev,phoneMessage]);
  };

  const handleVolunteerClick=()=> {
    setIsVolunteerModalOpen(true);
  };

  const handleDonationClick=(amount)=> {
    const donationMessage={
      id: Date.now(),
      text: `❤️ Thank you for your generous $${amount} donation! In the full platform,this would redirect to your secure donation page with the amount pre-filled.`,
      sender: 'bot'
    };
    setMessages(prev=> [...prev,donationMessage]);
  };

  const handleToggleDay = (day) => {
    setVolunteerForm(prev => ({
      ...prev,
      availableDays: {
        ...prev.availableDays,
        [day]: !prev.availableDays[day]
      }
    }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0,scale: 0.8,y: 20}}
            animate={{opacity: 1,scale: 1,y: 0}}
            exit={{opacity: 0,scale: 0.8,y: 20}}
            className="bg-white rounded-xl shadow-2xl w-96 h-[650px] mb-4 flex flex-col overflow-hidden border-2 border-blue-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 relative flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h3 className="font-semibold">{demoChatbot.name}</h3>
                </div>
                <button
                  onClick={toggleChatbot}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-lg" />
                </button>
              </div>
            </div>

            {/* Video Section */}
            <div className="relative h-36 bg-black flex-shrink-0">
              {!isVideoPlaying ? (
                <>
                  <img
                    src={demoChatbot.videoThumbnail}
                    alt="NPO Bots Demo"
                    className="w-full h-full object-cover"
                    onError={(e)=> {
                      e.target.style.display='none';
                      e.target.nextSibling.style.display='flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center hidden">
                    <div className="text-center text-white">
                      <SafeIcon icon={FiPlay} className="text-4xl mb-2 mx-auto" />
                      <p className="text-sm font-medium">NPO Bots Demo</p>
                      <p className="text-xs opacity-90">Click to watch</p>
                    </div>
                  </div>
                  <button
                    onClick={handleVideoClick}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <SafeIcon icon={FiPlay} className="text-white text-2xl ml-1" />
                    </div>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <p className="text-white text-sm font-medium">Watch NPO Bots Demo</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full">
                  <iframe
                    src={demoChatbot.youtubeEmbedUrl}
                    title="NPO Bots Demo"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 min-h-0">
              {messages.map((message)=> (
                <motion.div
                  key={message.id}
                  initial={{opacity: 0,y: 10}}
                  animate={{opacity: 1,y: 0}}
                  className={`flex ${message.sender==='user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed ${message.sender==='user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm border'}`}>
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white flex-shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Try sending a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiSend} className="text-sm" />
                </button>
              </div>
            </div>

            {/* Volunteer Button */}
            <div className="px-4 pb-2 flex-shrink-0">
              <button
                onClick={handleVolunteerClick}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <SafeIcon icon={FiUsers} className="text-lg" />
                <span>I Want to Volunteer</span>
              </button>
            </div>

            {/* Donation Buttons */}
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 text-center">Quick Donation</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {demoChatbot.donationAmounts.map((amount,index)=> (
                  <button
                    key={index}
                    onClick={()=> handleDonationClick(amount)}
                    className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 font-medium text-sm"
                  >
                    <SafeIcon icon={FiHeart} className="text-sm" />
                    <span>${amount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="p-4 bg-gray-50 border-t flex-shrink-0">
              <div className="flex space-x-2">
                <button
                  onClick={handleEmailClick}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <SafeIcon icon={FiMail} className="text-sm" />
                  <span>Email</span>
                </button>
                <button
                  onClick={handlePhoneClick}
                  className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <SafeIcon icon={FiPhone} className="text-sm" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <motion.div
            initial={{opacity: 0,scale: 0.9}}
            animate={{opacity: 1,scale: 1}}
            className="bg-white rounded-xl shadow-2xl w-96 max-w-[90vw] mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="text-blue-600" />
                  <span>Send us a message</span>
                </h3>
                <button
                  onClick={()=> setIsEmailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleEmailFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={emailForm.name}
                      onChange={(e)=> setEmailForm(prev=> ({...prev,name: e.target.value}))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={emailForm.email}
                      onChange={(e)=> setEmailForm(prev=> ({...prev,email: e.target.value}))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e)=> setEmailForm(prev=> ({...prev,message: e.target.value}))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your nonprofit or ask any questions..."
                    required
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📧 This message will be sent to <strong>{demoChatbot.email}</strong>
                  </p>
                </div>

                {submitStatus==='error' && (
                  <div className="bg-red-50 p-3 rounded-lg flex items-center space-x-2">
                    <SafeIcon icon={FiAlertCircle} className="text-red-600" />
                    <p className="text-sm text-red-800">
                      Failed to send message. Please try again.
                    </p>
                  </div>
                )}

                {submitStatus==='success' && (
                  <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="text-green-600" />
                    <p className="text-sm text-green-800">
                      Message sent successfully!
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSend} className="text-sm" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={()=> setIsEmailModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Volunteer Modal */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            className="bg-white rounded-xl shadow-2xl w-96 max-w-[90vw] mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="text-green-600" />
                  <span>Volunteer Sign-up</span>
                </h3>
                <button
                  onClick={() => setIsVolunteerModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleVolunteerFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm(prev => ({...prev, name: e.target.value}))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={volunteerForm.email}
                      onChange={(e) => setVolunteerForm(prev => ({...prev, email: e.target.value}))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm(prev => ({...prev, phone: e.target.value}))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days <span className="text-xs text-gray-500">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { day: 'monday', label: 'Monday' },
                      { day: 'tuesday', label: 'Tuesday' },
                      { day: 'wednesday', label: 'Wednesday' },
                      { day: 'thursday', label: 'Thursday' },
                      { day: 'friday', label: 'Friday' },
                      { day: 'saturday', label: 'Saturday' },
                      { day: 'sunday', label: 'Sunday' }
                    ].map(({day, label}) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border flex items-center space-x-2 transition-colors ${
                          volunteerForm.availableDays[day] 
                            ? 'bg-green-100 border-green-400 text-green-800' 
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={volunteerForm.availableDays[day]}
                          onChange={() => {}} // Handled by the button click
                          className="h-4 w-4 rounded accent-green-600"
                          readOnly
                        />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <SafeIcon icon={FiCalendar} className="inline-block mr-1" />
                    Our volunteer coordinator will contact you to discuss available opportunities.
                  </p>
                </div>

                {volunteerSubmitStatus === 'error' && (
                  <div className="bg-red-50 p-3 rounded-lg flex items-center space-x-2">
                    <SafeIcon icon={FiAlertCircle} className="text-red-600" />
                    <p className="text-sm text-red-800">
                      Failed to submit volunteer information. Please try again.
                    </p>
                  </div>
                )}

                {volunteerSubmitStatus === 'success' && (
                  <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="text-green-600" />
                    <p className="text-sm text-green-800">
                      Volunteer information submitted successfully!
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmittingVolunteer}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmittingVolunteer ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiUsers} className="text-sm" />
                        <span>Sign Up to Volunteer</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVolunteerModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Preview Toggle Button */}
      <div className="relative">
        <motion.button
          onClick={toggleChatbot}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-2 border-blue-200 relative group"
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          animate={{
            y: [0,-4,0],
            transition: {duration: 2,repeat: Infinity,ease: "easeInOut"}
          }}
        >
          <div className="relative w-20 h-20">
            <img
              src={demoChatbot.videoThumbnail}
              alt="NPO Bots Demo Preview"
              className="w-full h-full object-cover"
              onError={(e)=> {
                e.target.style.display='none';
                e.target.nextSibling.style.display='flex';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center hidden">
              <SafeIcon icon={FiPlay} className="text-white text-xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-colors">
              <div className="w-8 h-8 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <SafeIcon icon={FiPlay} className="text-white text-sm ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMessageCircle} className="text-white text-xs" />
            </div>
          </div>
        </motion.button>

        {!isOpen && (
          <motion.div
            className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{
              scale: [1,1.2,1],
              opacity: [1,0.7,1]
            }}
            transition={{duration: 2,repeat: Infinity}}
          />
        )}

        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Try NPO Bots!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default DemoChatbot;
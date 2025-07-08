import supabase from '../lib/supabase';

export const sendEmail = async (emailData) => {
  let messageId = Date.now().toString();
  
  try {
    console.log('Sending email with data:', emailData);
    
    // First, save to database
    try {
      const { data, error } = await supabase
        .from('contact_messages_x9k2m7p1q')
        .insert([
          {
            name: emailData.name,
            email: emailData.email,
            message: emailData.message,
            chatbot_id: emailData.chatbotId || 'demo',
            recipient_email: emailData.recipientEmail || 'joe@bizooma.com',
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Database save error:', error);
        throw new Error('Failed to save message to database');
      }

      if (data) {
        messageId = data.id;
        console.log('Message saved to database with ID:', messageId);
      }
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      throw new Error('Failed to save message');
    }

    // Prepare email data for multiple services
    const emailPayload = {
      name: emailData.name,
      email: emailData.email,
      message: emailData.message,
      _replyto: emailData.email,
      _subject: `NPO Bots - Message from ${emailData.name}`,
      _to: emailData.recipientEmail || 'joe@bizooma.com'
    };

    console.log('Sending email payload:', emailPayload);

    // Try multiple email services for better reliability
    let emailSent = false;
    let lastError = null;

    // Try Formspree first
    try {
      const formspreeResponse = await fetch('https://formspree.io/f/xpwzbvqb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      console.log('Formspree response status:', formspreeResponse.status);
      
      if (formspreeResponse.ok) {
        const responseData = await formspreeResponse.json();
        console.log('Formspree success:', responseData);
        emailSent = true;
      } else {
        const errorData = await formspreeResponse.text();
        console.log('Formspree error response:', errorData);
        lastError = new Error(`Formspree failed with status ${formspreeResponse.status}: ${errorData}`);
      }
    } catch (formspreeError) {
      console.error('Formspree error:', formspreeError);
      lastError = formspreeError;
    }

    // If Formspree failed, try EmailJS as backup
    if (!emailSent) {
      try {
        // Using a public EmailJS endpoint for testing
        const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'default_service',
            template_id: 'template_contact',
            user_id: 'public_key',
            template_params: {
              from_name: emailData.name,
              from_email: emailData.email,
              to_email: emailData.recipientEmail || 'joe@bizooma.com',
              message: emailData.message,
              subject: `NPO Bots - Message from ${emailData.name}`
            }
          })
        });

        if (emailjsResponse.ok) {
          console.log('EmailJS success');
          emailSent = true;
        }
      } catch (emailjsError) {
        console.error('EmailJS error:', emailjsError);
        lastError = emailjsError;
      }
    }

    // If both services failed, try a simple mailto fallback
    if (!emailSent) {
      console.log('All email services failed, using mailto fallback');
      
      // Create mailto link
      const subject = encodeURIComponent(`NPO Bots - Message from ${emailData.name}`);
      const body = encodeURIComponent(`
From: ${emailData.name} <${emailData.email}>
Message: ${emailData.message}

Reply directly to: ${emailData.email}
      `);
      const mailtoLink = `mailto:${emailData.recipientEmail || 'joe@bizooma.com'}?subject=${subject}&body=${body}`;
      
      // Store the mailto link for the frontend to use
      await supabase
        .from('contact_messages_x9k2m7p1q')
        .update({ 
          status: 'mailto_fallback',
          error_message: `Email services failed. Mailto link: ${mailtoLink}`
        })
        .eq('id', messageId);

      return {
        success: true,
        messageId: messageId,
        message: 'Email prepared. Opening email client...',
        mailtoLink: mailtoLink,
        fallback: true
      };
    }

    // Update database status on success
    try {
      await supabase
        .from('contact_messages_x9k2m7p1q')
        .update({ status: 'sent', updated_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (dbError) {
      console.log('Database update failed:', dbError);
    }

    return {
      success: true,
      messageId: messageId,
      message: 'Email sent successfully'
    };

  } catch (error) {
    console.error('Email service error:', error);
    
    // Update database status on failure
    try {
      await supabase
        .from('contact_messages_x9k2m7p1q')
        .update({ 
          status: 'failed', 
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);
    } catch (dbError) {
      console.log('Database error update failed:', dbError);
    }

    throw error;
  }
};

export const getContactMessages = async (chatbotId = null) => {
  try {
    let query = supabase
      .from('contact_messages_x9k2m7p1q')
      .select('*')
      .order('created_at', { ascending: false });

    if (chatbotId) {
      query = query.eq('chatbot_id', chatbotId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }

    return data;
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};
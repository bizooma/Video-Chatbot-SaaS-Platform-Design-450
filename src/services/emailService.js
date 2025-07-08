import supabase from '../lib/supabase';

export const sendEmail = async (emailData) => {
  let messageId = Date.now().toString();
  
  try {
    // For demo purposes, we'll use a third-party email service
    // In production, you would use your preferred email service
    
    // First, let's try to save to database (if available)
    try {
      const { data, error } = await supabase
        .from('contact_messages_x7k9m2p3q8')
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

      if (data) {
        messageId = data.id;
      }
    } catch (dbError) {
      console.log('Database save failed, continuing with email send:', dbError);
    }

    // Use fetch to send email via a webhook service
    const response = await fetch('https://formspree.io/f/xpwzbvqb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailData.email,
        name: emailData.name,
        message: emailData.message,
        _replyto: emailData.email,
        _subject: `NPO Bots - Message from ${emailData.name}`,
        _to: emailData.recipientEmail || 'joe@bizooma.com'
      })
    });

    if (!response.ok) {
      throw new Error(`Email service responded with ${response.status}`);
    }

    // Update database status if we have a record
    try {
      await supabase
        .from('contact_messages_x7k9m2p3q8')
        .update({ status: 'sent' })
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
    
    // Update database status if we have a record
    try {
      await supabase
        .from('contact_messages_x7k9m2p3q8')
        .update({ 
          status: 'failed', 
          error_message: error.message 
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
      .from('contact_messages_x7k9m2p3q8')
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
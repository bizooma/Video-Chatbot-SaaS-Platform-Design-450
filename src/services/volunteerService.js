import supabase from '../lib/supabase';

export const saveVolunteerInfo = async (volunteerData) => {
  try {
    console.log('Saving volunteer data:', volunteerData);

    // Prepare the data for insertion
    const insertData = {
      name: volunteerData.name,
      email: volunteerData.email,
      phone: volunteerData.phone || null,
      available_days: volunteerData.availableDays || null,
      chatbot_id: volunteerData.chatbotId || 'demo',
      status: volunteerData.status || 'new',
      created_at: new Date().toISOString()
    };

    console.log('Insert data prepared:', insertData);

    // Save to volunteers database table
    const { data, error } = await supabase
      .from('volunteers_x9k2m7p1q')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Database save error:', error);
      throw new Error(`Failed to save volunteer data: ${error.message}`);
    }

    if (data) {
      console.log('Volunteer saved to database with ID:', data.id);
      
      // Also save as a contact message for the business owner to see in their dashboard
      try {
        await supabase
          .from('contact_messages_x9k2m7p1q')
          .insert([
            {
              name: volunteerData.name,
              email: volunteerData.email,
              message: `Volunteer Sign-up\nPhone: ${volunteerData.phone || 'Not provided'}\nAvailable Days: ${volunteerData.availableDays || 'Flexible'}`,
              chatbot_id: volunteerData.chatbotId || 'demo',
              recipient_email: 'joe@bizooma.com', // Default recipient
              status: 'volunteer_signup',
              created_at: new Date().toISOString()
            }
          ]);
        console.log('Contact message created successfully');
      } catch (contactError) {
        console.warn('Failed to create contact message, but volunteer was saved:', contactError);
        // Don't fail the whole operation if contact message fails
      }
      
      return {
        success: true,
        volunteerId: data.id,
        message: 'Volunteer information saved successfully'
      };
    }
    
    throw new Error('Failed to save volunteer information');
  } catch (error) {
    console.error('Volunteer service error:', error);
    throw error;
  }
};

export const getVolunteers = async (chatbotId = null) => {
  try {
    let query = supabase
      .from('volunteers_x9k2m7p1q')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (chatbotId) {
      query = query.eq('chatbot_id', chatbotId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching volunteers:', error);
      throw new Error('Failed to fetch volunteers');
    }
    
    return data || [];
  } catch (error) {
    console.error('Get volunteers error:', error);
    throw error;
  }
};

export const updateVolunteerStatus = async (volunteerId, status, notes = null) => {
  try {
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };
    
    if (notes !== null) {
      updateData.notes = notes;
    }
    
    const { data, error } = await supabase
      .from('volunteers_x9k2m7p1q')
      .update(updateData)
      .eq('id', volunteerId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating volunteer status:', error);
      throw new Error('Failed to update volunteer status');
    }
    
    return {
      success: true,
      volunteer: data
    };
  } catch (error) {
    console.error('Update volunteer status error:', error);
    throw error;
  }
};
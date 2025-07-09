import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // First check localStorage for user session
        const savedUser = localStorage.getItem('videobot_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
        
        // Also check Supabase session as fallback
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !savedUser) {
          // If we have a Supabase session but no saved user, get user data from custom table
          const { data: userData, error } = await supabase
            .from('users_n7q3k5p1d8')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (userData && !error) {
            const safeUser = { ...userData };
            delete safeUser.password;
            setUser(safeUser);
            localStorage.setItem('videobot_user', JSON.stringify(safeUser));
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signup = async (email, password, userData) => {
    setAuthError(null);
    try {
      // First try to create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Create user record in our custom users table
      const { data: user, error: userError } = await supabase
        .from('users_n7q3k5p1d8')
        .insert({
          id: authData.user.id,
          email: email.toLowerCase(),
          password: password, // In production, this should be hashed
          name: userData.name || '',
          plan: 'free',
          phone: userData.phone || '',
          company: userData.company || '',
          website: userData.website || '',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) {
        throw new Error('Failed to create user profile');
      }

      const safeUser = { ...user };
      delete safeUser.password;
      setUser(safeUser);
      localStorage.setItem('videobot_user', JSON.stringify(safeUser));
      return safeUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      // First try custom authentication
      const { data: verifyResult, error: verifyError } = await supabase
        .rpc('verify_user_password', {
          user_email: email.toLowerCase(),
          user_password: password
        });

      if (verifyError) {
        throw new Error('Authentication failed');
      }

      const result = verifyResult;
      
      if (result.success) {
        const safeUser = result.user;
        setUser(safeUser);
        localStorage.setItem('videobot_user', JSON.stringify(safeUser));
        
        // Also try to sign in with Supabase Auth as backup
        try {
          await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
          });
        } catch (supabaseError) {
          // If Supabase auth fails, that's okay - we'll use custom auth
          console.log('Supabase auth failed, using custom auth');
        }
        
        return safeUser;
      } else {
        throw new Error(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('videobot_user');
  };

  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    const { data: updatedUser, error } = await supabase
      .from('users_n7q3k5p1d8')
      .update({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        website: profileData.website
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile');
    }

    const safeUser = { ...updatedUser };
    delete safeUser.password;
    setUser(safeUser);
    localStorage.setItem('videobot_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const changePassword = async (currentPassword, newPassword) => {
    // Verify current password first
    const { data: verifyResult, error: verifyError } = await supabase
      .rpc('verify_user_password', {
        user_email: user.email,
        user_password: currentPassword
      });

    if (verifyError || !verifyResult.success) {
      throw new Error('Current password is incorrect');
    }

    // Update password in custom table
    const { error: updateError } = await supabase
      .from('users_n7q3k5p1d8')
      .update({ password: newPassword })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Failed to update password');
    }

    // Also try to update in Supabase Auth if possible
    try {
      await supabase.auth.updateUser({ password: newPassword });
    } catch (supabaseError) {
      // If Supabase auth update fails, that's okay - we updated custom table
      console.log('Supabase auth update failed, but custom table updated');
    }

    return { success: true };
  };

  const cancelMembership = async (cancellationData) => {
    if (cancellationData.confirmEmail !== user.email) {
      throw new Error('Email confirmation does not match your account email');
    }

    const { error } = await supabase
      .from('users_n7q3k5p1d8')
      .update({
        plan: 'free',
        cancellation_reason: cancellationData.reason,
        cancellation_feedback: cancellationData.feedback,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      throw new Error('Failed to cancel membership');
    }

    // Log the cancellation
    await supabase
      .from('cancellations_log_n7q3k5p1d8')
      .insert({
        user_id: user.id,
        email: user.email,
        reason: cancellationData.reason,
        feedback: cancellationData.feedback,
        cancelled_at: new Date().toISOString()
      });

    return { success: true };
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loading,
    updateProfile,
    changePassword,
    cancelMembership,
    resetPassword,
    updatePassword,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
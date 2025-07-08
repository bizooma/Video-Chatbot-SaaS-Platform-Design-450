import React,{createContext,useContext,useState,useEffect} from 'react';
import supabase from '../lib/supabase';

const AuthContext=createContext();

export const useAuth=()=> {
  const context=useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider=({children})=> {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [authError,setAuthError]=useState(null);

  useEffect(()=> {
    // Check for existing session
    const checkSession=async ()=> {
      try {
        const {data: {session}}=await supabase.auth.getSession();
        if (session) {
          // If we have a session,get the user data from our custom users table
          const {data: userData,error}=await supabase
            .from('users_n7q3k5p1d8')
            .select('*')
            .eq('email',session.user.email)
            .single();

          if (userData && !error) {
            const safeUser={...userData};
            delete safeUser.password;// Don't expose the password hash
            setUser(safeUser);
            localStorage.setItem('videobot_user',JSON.stringify(safeUser));
          }
        }
      } catch (error) {
        console.error('Session check error:',error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  },[]);

  const signup=async (email,password,userData)=> {
    setAuthError(null);
    try {
      // Sign up with Supabase Auth
      const {data: authData,error: authError}=await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Create user record in our custom users table
      const {data: user,error: userError}=await supabase
        .from('users_n7q3k5p1d8')
        .insert({
          id: authData.user.id,
          email: email.toLowerCase(),
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

      const safeUser={...user};
      delete safeUser.password;
      setUser(safeUser);
      localStorage.setItem('videobot_user',JSON.stringify(safeUser));
      return safeUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const login=async (email,password)=> {
    setAuthError(null);
    try {
      // Sign in with Supabase Auth
      const {data: authData,error: authError}=await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password
      });

      if (authError) {
        throw new Error('Invalid email or password');
      }

      // Get user data from our custom users table
      const {data: user,error: userError}=await supabase
        .from('users_n7q3k5p1d8')
        .select('*')
        .eq('email',email.toLowerCase())
        .single();

      if (userError || !user) {
        throw new Error('User profile not found');
      }

      const safeUser={...user};
      delete safeUser.password;
      setUser(safeUser);
      localStorage.setItem('videobot_user',JSON.stringify(safeUser));
      return safeUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout=async ()=> {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('videobot_user');
  };

  const resetPassword=async (email)=> {
    setAuthError(null);
    try {
      const {error}=await supabase.auth.resetPasswordForEmail(email.toLowerCase(),{
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      return {success: true};
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updatePassword=async (newPassword)=> {
    setAuthError(null);
    try {
      const {error}=await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      return {success: true};
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updateProfile=async (profileData)=> {
    const {data: updatedUser,error}=await supabase
      .from('users_n7q3k5p1d8')
      .update({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        website: profileData.website
      })
      .eq('id',user.id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile');
    }

    const safeUser={...updatedUser};
    delete safeUser.password;
    setUser(safeUser);
    localStorage.setItem('videobot_user',JSON.stringify(safeUser));
    return safeUser;
  };

  const changePassword=async (currentPassword,newPassword)=> {
    const {data: {session}}=await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to change your password');
    }

    // Verify current password by attempting to sign in
    const {error: signInError}=await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // Update the password in Supabase Auth
    const {error: updateError}=await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      throw new Error('Failed to update password');
    }

    return {success: true};
  };

  const cancelMembership=async (cancellationData)=> {
    if (cancellationData.confirmEmail !==user.email) {
      throw new Error('Email confirmation does not match your account email');
    }

    const {error}=await supabase
      .from('users_n7q3k5p1d8')
      .update({
        plan: 'free',
        cancellation_reason: cancellationData.reason,
        cancellation_feedback: cancellationData.feedback,
        cancelled_at: new Date().toISOString()
      })
      .eq('id',user.id);

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

    return {success: true};
  };

  const value={
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
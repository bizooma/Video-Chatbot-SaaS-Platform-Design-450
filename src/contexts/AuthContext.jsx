import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Initialize predefined user for demo purposes
    const initPaidUser = () => {
      const paidUsers = [
        {
          id: 'joe123',
          email: 'joe@legallyinnovative.com',
          name: 'Joe',
          plan: 'pro',
          phone: '+1 (555) 123-4567',
          company: 'Legally Innovative',
          website: 'https://legallyinnovative.com',
          createdAt: new Date().toISOString()
        }
      ];
      
      // Store predefined users in localStorage if not already present
      if (!localStorage.getItem('videobot_users')) {
        localStorage.setItem('videobot_users', JSON.stringify(paidUsers));
      }
    };
    
    initPaidUser();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('videobot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // For demo purposes, we'll simulate authentication
    // In production, this would validate credentials against a backend
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('videobot_users') || '[]');
    
    // Find user by email (case insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // In a real app, we would validate the password here
      // For this demo, we'll accept any password for the predefined user
      
      setUser(user);
      localStorage.setItem('videobot_user', JSON.stringify(user));
      return user;
    } else if (email === 'demo@example.com') {
      // Allow a demo login for testing
      const demoUser = {
        id: 'demo1',
        email: email,
        name: 'Demo User',
        plan: 'starter',
        phone: '',
        company: '',
        website: '',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      localStorage.setItem('videobot_user', JSON.stringify(demoUser));
      return demoUser;
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('videobot_user');
  };

  const updateProfile = async (profileData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('videobot_user', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('videobot_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('videobot_users', JSON.stringify(users));
    }
    
    return updatedUser;
  };

  const changePassword = async (currentPassword, newPassword) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would validate the current password
    // For this demo, we'll just simulate success
    if (currentPassword === 'wrongpassword') {
      throw new Error('Current password is incorrect');
    }
    
    // Password change successful (in real app, this would be handled server-side)
    return { success: true };
  };

  const cancelMembership = async (cancellationData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would cancel the subscription
    // For this demo, we'll just simulate the process
    console.log('Membership cancelled:', cancellationData);
    
    return { success: true };
  };

  const value = { 
    user, 
    login, 
    logout, 
    loading, 
    updateProfile, 
    changePassword, 
    cancelMembership 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
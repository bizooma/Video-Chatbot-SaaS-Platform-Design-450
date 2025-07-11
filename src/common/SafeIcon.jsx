import React from 'react';

const SafeIcon = ({ icon: Icon, className = "", ...props }) => {
  if (!Icon) {
    return null;
  }
  
  return <Icon className={`inline-block ${className}`} {...props} />;
};

export default SafeIcon;
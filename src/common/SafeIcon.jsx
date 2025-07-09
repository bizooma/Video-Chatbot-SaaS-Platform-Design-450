import React from 'react';

const SafeIcon = ({ src, alt, className = "", fallback, ...props }) => {
  const handleImageError = (e) => {
    if (fallback) {
      e.target.src = fallback;
    } else {
      e.target.style.display = 'none';
    }
  };

  return (
    <img
      src={src}
      alt={alt || "Icon"}
      className={`inline-block ${className}`}
      onError={handleImageError}
      {...props}
    />
  );
};

export default SafeIcon;
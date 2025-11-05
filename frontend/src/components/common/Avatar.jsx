import React from 'react';
import './Avatar.css';

function Avatar({ imageUrl, size = "medium", altText = "?" }) {
  const rootClass = `avatar-root avatar-${size}`;
  
  let content;
  
  if (imageUrl) {
    content = (
      <div 
        className="avatar-image"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
    );
  } else {
    const fallbackText = altText ? altText[0].toUpperCase() : "?";
    content = <div className="avatar-fallback">{fallbackText}</div>;
  }
  
  return <div className={rootClass}>{content}</div>;
}

export default Avatar;
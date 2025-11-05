import React from 'react';
import './Input.css';

function Input({ 
  type, 
  value, 
  onChange, 
  placeholder = "", 
  variant = "default", 
  disabled = false 
}) {
  const className = `input-root input-${variant}`;
  
  if (type === "textarea") {
    return (
      <textarea
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
      />
    );
  }
  
  return (
    <input
      className={className}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

export default Input;
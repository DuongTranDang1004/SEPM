import React from 'react';
import Icon from './Icon';
import './Button.css';

function Button({ 
  variant, 
  text = "", 
  size = "large", 
  onClick = null, 
  iconName = null, 
  isIconOnly = false 
}) {
  const classNames = ["btn"];
  
  // Add variant class
  if (["tenant", "landlord", "ghost"].includes(variant)) {
    classNames.push(`btn-${variant}`);
  } else {
    classNames.push("btn-tenant");
  }
  
  // Add size class
  classNames.push(size === "small" ? "btn-small" : "btn-large");
  
  // Add icon-only class
  if (isIconOnly) {
    classNames.push("btn-icon-only");
  }
  
  const finalClass = classNames.join(" ");
  
  // Determine icon properties
  const iconColor = variant === "tenant" ? "black" : "black";
  const iconSize = size === "small" ? "small" : "medium";
  
  // Build button content
  const buttonContent = [];
  
  if (iconName) {
    buttonContent.push(
      <Icon 
        key="icon"
        name={iconName} 
        size={iconSize} 
        color={iconColor} 
      />
    );
    
    if (!isIconOnly && text) {
      buttonContent.push(<span key="spacer" style={{ marginLeft: "8px" }} />);
    }
  }
  
  if (!isIconOnly) {
    buttonContent.push(<span key="text">{text || "Action"}</span>);
  }
  
  return (
    <button className={finalClass} onClick={onClick}>
      {buttonContent}
    </button>
  );
}

export default Button;
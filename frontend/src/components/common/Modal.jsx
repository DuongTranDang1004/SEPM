import React from 'react';
import Button from './Button';
import './Modal.css';

function Modal({ isOpen, onClose, title, children, size = "medium" }) {
  if (!isOpen) {
    return null;
  }
  
  const contentClass = `modal-content modal-${size}`;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={contentClass}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <Button
            variant="ghost"
            iconName="close"
            isIconOnly={true}
            size="small"
            onClick={onClose}
          />
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
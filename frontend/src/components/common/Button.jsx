import React from 'react';

const Button = (props) => { 
  return (
    <button className="custom-button" {...props}>
      {props.children || 'Button'}
    </button>
  );
};

// default export.
export default Button;
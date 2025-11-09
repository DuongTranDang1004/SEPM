import React from 'react';

const Button = (props) => { 
  return (
    <button className="custom-button" {...props}>
      {props.children || 'Button'}
    </button>
  );
};

// default export 합니다.
export default Button;
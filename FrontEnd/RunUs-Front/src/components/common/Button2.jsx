import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import "../../styles/Common/Button2.css";

const Button2 = forwardRef(({ src, onClick }, ref) => {
  return (
    <img
      src={src}
      alt="button"
      className="Button2"
      onClick={onClick}
      ref={ref}
    />
  );
});

// displayName을 추가하여 디버깅 및 개발 도구에서 쉽게 식별할 수 있도록 합니다.
Button2.displayName = "Button2";

Button2.propTypes = {
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button2;

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

Button2.propTypes = {
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
// 코드의 안정성을 높이고, 컴포넌트의 사용방법을 문서화하는 데 도움을 준다.
// 권장사항

export default Button2;

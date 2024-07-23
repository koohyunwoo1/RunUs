// import "../../styles/Common/Button.css";
// const Button = ({ text, onClick }) => {
//   return (
//     <button className="Button" onClick={onClick}>
//       {text}
//     </button>
//   );
// };

// export default Button;

import "../../styles/Common/Button.css";

const Button = ({ text, onClick, className, children }) => {
  return (
    <button className={`Button ${className}`} onClick={onClick}>
      {children || text}
    </button>
  );
};

export default Button;
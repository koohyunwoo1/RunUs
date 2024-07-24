// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../../assets/Logo.png";
// import "../../styles/Home/LogOutHeader.css";

// const LogOutHeader = () => {
//   return (
//     <div className="header-container">
//       <div className="header">
//         <Link to="/">
//           <img src={logo} alt="logo" className="logo" />
//         </Link>
//         <div className="auth-links">
//           <Link to="/signin">
//             <h3>로그인</h3>
//           </Link>
//           <Link to="/signup">
//             <h3>회원가입</h3>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LogOutHeader;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import "../../styles/Home/LogOutHeader.css";
const LogOutHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className={`header-container ${scrolled ? "scrolled" : ""}`}>
      <div className="header">
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <div className="auth-links">
          <Link to="/signin">
            <h3>로그인</h3>
          </Link>
          <Link to="/signup">
            <h3>회원가입</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LogOutHeader;

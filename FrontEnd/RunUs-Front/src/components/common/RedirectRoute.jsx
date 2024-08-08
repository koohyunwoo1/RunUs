import { Navigate } from "react-router-dom";

// RedirectRoute 컴포넌트 정의
const RedirectRoute = ({ children }) => {
  // localStorage에서 userData 가져오기
  const userData = localStorage.getItem('userData');
  console.log("hi" + userData)

  // userData가 있는 경우 /home으로 리디렉션, 그렇지 않으면 children 렌더링
  return userData ? <Navigate to="/home" /> : children;
};

export default RedirectRoute;
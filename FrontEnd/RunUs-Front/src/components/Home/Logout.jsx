import { useContext } from "react";
import { UserContext } from "../../hooks/UserContext"; // UserContext 파일 경로에 맞게 수정
import "../../styles/Home/Logout.css";

const Logout = () => {
  const { logoutUser } = useContext(UserContext);

  const handleLogout = async () => {
    logoutUser();
  };

  return (
    <div onClick={handleLogout} className="LogoutButton">
      로그아웃
    </div>
  );
};

export default Logout;

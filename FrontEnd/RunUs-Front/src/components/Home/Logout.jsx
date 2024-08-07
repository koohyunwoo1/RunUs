import { useContext } from "react";
import { UserContext } from "../../hooks/UserContext"; // UserContext 파일 경로에 맞게 수정
import Swal from "sweetalert2"
import "../../styles/Home/Logout.css";
import "../../styles/Common/CustomSwal.css"

const Logout = () => {
  const { logoutUser } = useContext(UserContext);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '정말 로그아웃 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네, 할래요!',
      cancelButtonText: "안 할래요!",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        cancelButton: 'custom-swal-cancel-button',
        confirmButton: 'custom-swal-confirm-button',
      }
    })
    if (result.isConfirmed) {
      logoutUser();
    }
  };

  return (
    <div className="logoutFooter">
      <p onClick={handleLogout} className="logoutText">
        로그아웃
      </p>
    </div>
  );
};

export default Logout;

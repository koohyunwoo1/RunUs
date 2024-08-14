import TabBar from "../../components/common/TabBar";
import "../../styles/MyPage/MyPageHome.css";
import MyPageProfile from "../../components/MyPage/MyPageProfile";
import MyPageTier from "../../components/MyPage/MyPageTier";
import EditIcon from "../../assets/editIcon.png";
import locationIcon from "../../assets/location.png";
import logoutImage from "../../assets/logout.png";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../hooks/UserContext"; // UserContext 파일 경로에 맞게 수정
import Swal from "sweetalert2";

const MyPageHome = () => {
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);

  const handleEditIconClick = () => {
    navigate("/my-page-edit", { replace: true });
  };

  const handleLocationClick = () => {
    navigate("/my-page-editLocation", { replace: true });
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "정말 로그아웃 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네, 할래요!",
      cancelButtonText: "안 할래요!",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        cancelButton: "custom-swal-cancel-button",
        confirmButton: "custom-swal-confirm-button",
      },
    });
    if (result.isConfirmed) {
      logoutUser();
    }
  };

  return (
    <div>
      <Header />
      <div className="MyPageHome" style={{ marginTop: "80px" }}>
        <div>
          <MyPageProfile />
        </div>
        <div className="MyPageTier">
          <MyPageTier />
        </div>

        <div className="MyPageEditSections">
          <div className="MyPageEditSection" onClick={handleEditIconClick}>
            <img src={EditIcon} alt="User Icon" className="edit-section-icon" />
            회원정보 수정
          </div>
          <div className="MyPageEditSection" onClick={handleLocationClick}>
            <img
              src={locationIcon}
              alt="Location Icon"
              className="edit-section-icon"
            />
            위치 수정
          </div>
          <div className="MyPageEditSection" onClick={handleLogout}>
            <img src={logoutImage} className="edit-section-icon" />
            로그아웃
          </div>
        </div>
        <TabBar />
      </div>
    </div>
  );
};

export default MyPageHome;

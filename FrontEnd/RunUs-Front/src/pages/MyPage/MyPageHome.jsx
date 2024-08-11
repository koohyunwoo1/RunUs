import TabBar from "../../components/common/TabBar";
import "../../styles/MyPage/MyPageHome.css";
import MyPageProfile from "../../components/MyPage/MyPageProfile";
import MyPageTier from "../../components/MyPage/MyPageTier";
import EditIcon from "../../assets/editIcon.png";
import locationIcon from "../../assets/location.png";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";

const MyPageHome = () => {
  const navigate = useNavigate();

  const handleEditIconClick = () => {
    navigate("/my-page-edit", { replace: true });
  };

  return (
    <div className="MyPageHome">
      <Header />
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
        <div className="MyPageEditSection" onClick={handleEditIconClick}>
          <img src={locationIcon} alt="Location Icon" className="edit-section-icon" />
          위치 수정
        </div>
      </div>

      <div className="bottom-spacing"></div>
      <TabBar />
    </div>
  );
};

export default MyPageHome;

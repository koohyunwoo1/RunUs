import TabBar from "../../components/common/TabBar";
import "../../styles/MyPage/MyPageHome.css";
import MyPageProfile from "../../components/MyPage/MyPageProfile";
import MyPageTier from "../../components/MyPage/MyPageTier";
import EditIcon from "../../assets/editIcon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
// import Logout from "../../components/Home/Logout";

const MyPageHome = () => {
  const navigate = useNavigate();

  const handleEditIconClick = () => {
    navigate("/my-page-edit", { replace: true });
  };

  return (
    <div>
      <div className="MyPageHome">
        <div>
          <img
            src={EditIcon}
            className="MyPageEditIcon"
            onClick={handleEditIconClick}
          />
        </div>
        <div>
          <MyPageProfile />
        </div>
        <div className="MyPageTier">
          {/* <h3 className="MyPageh3">러닝 티어</h3> */}
          <MyPageTier />
        </div>
        {/* <div
          style={{
            marginTop: "100px",
            textAlign: "right",
          }}
        >
          <Logout />
        </div> */}
      </div>
      <TabBar />
    </div>
  );
};

export default MyPageHome;

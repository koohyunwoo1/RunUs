import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Common/TabBar.css";
import homeIcon from "../../assets/home.png";
import reportIcon from "../../assets/report.png";
import runIcon from "../../assets/speed.png";
import runWhite from "../../assets/runWhite.png";
import communityIcon from "../../assets/group.png";
import profileIcon from "../../assets/user.png";
import "../../styles/Home/LoginHomeCustomSwal.css";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../hooks/UserContext";

const TabBar = ({ onRunClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useContext(UserContext);

  const handleTabClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleRunClick = async () => {
    const result = await Swal.fire({
      title: "모드를 선택해주세요!",
      html: `
        <div class="swal2-button-container2">
          <button id="soloMode" class="swal2-confirm2 swal2-styled2">솔로 모드</button>
          <button id="teamMode" class="swal2-cancel2 swal2-styled2">팀 모드</button>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      customClass: {
        popup: "custom-swal-popup2",
        title: "custom-swal-title2",
      },
      didOpen: () => {
        document
          .getElementById("soloMode")
          .addEventListener("click", handleSoloModeClick);
        document
          .getElementById("teamMode")
          .addEventListener("click", handleTeamModeClick);
      },
      willClose: () => {
        document
          .getElementById("soloMode")
          .removeEventListener("click", handleSoloModeClick);
        document
          .getElementById("teamMode")
          .removeEventListener("click", handleTeamModeClick);
      },
    });
  };

  const handleSoloModeClick = async () => {
    Swal.close();
    const result = await Swal.fire({
      title: "Run?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      customClass: {
        popup: "custom-swal-popup2",
        title: "custom-swal-title2",
        confirmButton: "swal2-confirm2 swal2-styled2",
        cancelButton: "swal2-cancel2 swal2-styled2",
      },
    });

    if (result.isConfirmed) {
      navigate("/countdown");
    }
  };

  const handleTeamModeClick = async () => {
    Swal.close();
    const result = await Swal.fire({
      title: "팀 옵션을 선택해주세요!",
      html: `
        <div class="swal2-button-container2">
          <button id="createTeam" class="swal2-confirm2 swal2-styled2">팀 생성</button>
          <button id="joinTeam" class="swal2-cancel2 swal2-styled2">팀 입장</button>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      customClass: {
        popup: "custom-swal-popup2",
        title: "custom-swal-title2",
      },
      didOpen: () => {
        document
          .getElementById("createTeam")
          .addEventListener("click", handleCreateTeamClick);
        document
          .getElementById("joinTeam")
          .addEventListener("click", handleJoinTeamClick);
      },
      willClose: () => {
        document
          .getElementById("createTeam")
          .removeEventListener("click", handleCreateTeamClick);
        document
          .getElementById("joinTeam")
          .removeEventListener("click", handleJoinTeamClick);
      },
    });
  };

  // 팀 생성 클릭 핸들러
  const handleCreateTeamClick = async () => {
    Swal.close();
    try {
      const requestBody = {
        ownerUserId: userData.userId,
        regionId: userData.regionId,
      };
      const response = await axios.post("api/v1/team/create_room", requestBody);

      console.log(response);
      const { roomId } = response.data.data;
      const { roomOwnerId } = response.data.data;
      const { partyId } = response.data.data;

      navigate(`/team-create/${roomId}/${partyId}/${roomOwnerId}`, {
        state: { roomOwnerId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinTeamClick = () => {
    Swal.close();
    navigate("/team-QR");
  };
  return (
    <div className="tab-bar">
      <div
        className={`tab-item ${location.pathname === "/home" ? "active" : ""}`}
        onClick={() => handleTabClick("/home")}
      >
        <img src={homeIcon} alt="Home" />
        <span>홈</span>
      </div>
      <div
        className={`tab-item ${
          location.pathname === "/report-home" ? "active" : ""
        }`}
        onClick={() => handleTabClick("/report-home")}
      >
        <img src={reportIcon} alt="Report" />
        <span>리포트</span>
      </div>
      <div className={`tab-item2 tab-item-run`} onClick={handleRunClick}>
        <img src={runWhite} alt="Run" />
        <span>Run Us</span>
      </div>
      <div
        className={`tab-item ${
          location.pathname === "/article-home" ? "active" : ""
        }`}
        onClick={() => handleTabClick("/article-home")}
      >
        <img src={communityIcon} alt="Community" />
        <span>커뮤니티</span>
      </div>
      <div
        className={`tab-item ${
          location.pathname === "/my-page-home" ? "active" : ""
        }`}
        onClick={() => handleTabClick("/my-page-home")}
      >
        <img src={profileIcon} alt="Profile" />
        <span>프로필</span>
      </div>
    </div>
  );
};

export default TabBar;

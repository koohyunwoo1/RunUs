import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/Home/LogInHome.css";
import Header from "../../components/common/Header";
import Button2 from "../../components/common/Button2";
import SoloProfile from "../../assets/SoloProfile2.png";
import TeamProfile from "../../assets/TeamProfile2.png";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import Weather from "../../components/common/Weather";
import LoginHomeMapView from "../../components/Home/LoginHomeMapView";
import "../../styles/Home/LoginHomeCustomSwal.css";

const LogInHome = () => {
  const [distance, setDistance] = useState("0km"); // 기본값
  const teamProfileRef = useRef(null);
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  // 팀 프로필 클릭 핸들러
  const handleTeamProfileClick = async () => {
    const result = await Swal.fire({
      title: "팀 옵션을 선택해주세요 !",
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

      navigate(`/team-create/${roomId}`, { state: { roomOwnerId } });
    } catch (err) {
      console.error(err);
    }
  };

  // 팀 입장 클릭 핸들러
  const handleJoinTeamClick = () => {
    Swal.close();
    navigate("/team-QR");
  };

  // 솔로 프로필 클릭 핸들러
  const handleSoloProfileClick = async () => {
    const result = await Swal.fire({
      title: "Run ?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      customClass: {
        popup: "custom-swal-popup2",
        title: "custom-swal-title2",
      },
    });

    if (result.isConfirmed) {
      navigate("/countdown");
    }
  };

  return (
    <div>
      <Header />
      <div className="LoginHome-container">
        <Weather />
        <div className="LoginHomeMapView">
          <LoginHomeMapView />
        </div>
        <div className="MainButton-container">
          <Button2 src={SoloProfile} onClick={handleSoloProfileClick} />
          <Button2
            src={TeamProfile}
            onClick={handleTeamProfileClick}
            ref={teamProfileRef}
          />
        </div>
      </div>
    </div>
  );
};

export default LogInHome;

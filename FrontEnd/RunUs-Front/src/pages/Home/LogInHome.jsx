import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/Home/LogInHome.css";
import TabBar from "../../components/common/TabBar";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import Weather from "../../components/common/Weather";
import LoginHomeMapView from "../../components/Home/LoginHomeMapView";
import "../../styles/Home/LoginHomeCustomSwal.css";

const LogInHome = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

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
        confirmButtonText: "swal2-confirm2",
        cancelButtonText: "swal2-cancel2",
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

      navigate(`/team-create/${roomId}/${partyId}/${roomOwnerId}`, { state: { roomOwnerId } });
    } catch (err) {
      console.error(err);
    }
  };


  const handleJoinTeamClick = () => {
    Swal.close();
    navigate("/team-QR");
  };

  return (
    <div>
      <div className="LoginHome-container">
        <Weather />
        <div className="LoginHomeMapView">
          <LoginHomeMapView />
        </div>
      </div>
      <TabBar onRunClick={handleRunClick} />
    </div>
  );
};

export default LogInHome;

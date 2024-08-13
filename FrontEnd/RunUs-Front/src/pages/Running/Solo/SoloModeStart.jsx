import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlay,
  faPause,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../../../styles/Running/Solo/SoloModeStart.css";
import { UserContext } from "../../../hooks/UserContext";

const SoloModeStart = () => {
  const [time, setTime] = useState(0); // 시간 상태
  const [distance, setDistance] = useState(0); // 이동 거리 상태
  const [location, setLocation] = useState({ latitude: null, longitude: null }); // 현재 위치 상태
  const [isRunning, setIsRunning] = useState(true); // 타이머 상태 자동 시작
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [calories, setCalories] = useState(0); // 칼로리 상태
  const prevLocation = useRef({
    latitude: null,
    longitude: null,
    timestamp: null,
    speed: null,
  }); // 이전 위치 정보
  const timerRef = useRef(null); // 타이머 참조
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, speed } = position.coords;
      const currentTime = Date.now();

      if (
        prevLocation.current.latitude !== null &&
        prevLocation.current.longitude !== null
      ) {
        const timeElapsed =
          (currentTime - prevLocation.current.timestamp) / 1000; // 초 단위로 변환
        const maxPossibleDistance =
          (prevLocation.current.speed || 0) * timeElapsed;
        const dist = calculateDistance(
          prevLocation.current.latitude,
          prevLocation.current.longitude,
          latitude,
          longitude
        );

        if (dist > maxPossibleDistance) {
          const correctedLocation = correctLocation(
            prevLocation.current.latitude,
            prevLocation.current.longitude,
            latitude,
            longitude,
            maxPossibleDistance
          );
          setDistance((prevDistance) => prevDistance + maxPossibleDistance);
          prevLocation.current = {
            ...correctedLocation,
            timestamp: currentTime,
            speed,
          };
          setLocation(correctedLocation);
        } else {
          setDistance((prevDistance) => prevDistance + dist);
          prevLocation.current = {
            latitude,
            longitude,
            timestamp: currentTime,
            speed,
          };
          setLocation({ latitude, longitude });
        }

        // 칼로리 계산 및 상태 업데이트
        const calculatedCalories = calculateCalories(distance);
        setCalories(calculatedCalories);
      } else {
        prevLocation.current = {
          latitude,
          longitude,
          timestamp: currentTime,
          speed,
        };
        setLocation({ latitude, longitude });
      }
    };

    const handleError = (error) => {
      setError(error.message);
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };

    if (isRunning) {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isRunning, distance]); // distance가 변경될 때마다 칼로리 계산

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // 매초 시간 증가
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning((prev) => !prev); // 타이머 상태 토글
  };

  const handleEnd = async () => {
    const result = await Swal.fire({
      title: "정말 종료하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예, 종료합니다",
      cancelButtonText: "아니오, 계속하기",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
      },
    });

    if (result.isConfirmed) {
      try {
        // 데이터 준비
        const userId = localStorage.getItem("userId");
        const partyId = null; // 솔로는 null
        const requestbody = {
          userId: userId,
          partyId: partyId,
          distance: parseInt(distance),
          time: time,
          kcal: parseInt(calories.toFixed(2)),
        };
        const response = await axios.post(
          `/api/v1/record/result_save`,
          requestbody
        );

        if (response.data.success) {
          console.log(response.data.data);
          navigate("/report-home");
        } else {
          console.error(response.data);
          Swal.fire({
            title: "저장 실패",
            text: "기록 저장에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "저장 실패",
          text: "기록 저장 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const φ1 = lat1 * rad;
    const φ2 = lat2 * rad;
    const Δφ = (lat2 - lat1) * rad;
    const Δλ = (lon2 - lon1) * rad;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const correctLocation = (lat1, lon1, lat2, lon2, maxDist) => {
    const dist = calculateDistance(lat1, lon1, lat2, lon2);
    const ratio = maxDist / dist;
    const correctedLat = lat1 + (lat2 - lat1) * ratio;
    const correctedLon = lon1 + (lon2 - lon1) * ratio;
    return { latitude: correctedLat, longitude: correctedLon };
  };

  const calculateCalories = (distance, weight = userData.weight) => {
    const distanceInKm = distance / 1000;
    const caloriesBurned = distanceInKm * weight * 1.036;
    return caloriesBurned;
  };

  return (
    <div className="SoloModeStart">
      <button className="backButton" onClick={() => navigate("/home")}>
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <div className="SoloModeStartHeader">
            <div>
              <h1 style={{ fontSize: "30px" }}>
                {formatTime(time)} <br />
              </h1>
              <div style={{ fontStyle: "oblique" }}>시간</div>
            </div>
            <div>
              <h1 style={{ fontSize: "30px" }}>
                {parseInt(calories.toFixed(2))} <br />
              </h1>
              <div style={{ fontStyle: "oblique" }}>칼로리</div>
            </div>
          </div>

          <div className="SoloModeStartDistance">
            <p>
              {(distance / 1000).toFixed(2)} <br />
              <span style={{ fontSize: "25px" }}>킬로미터</span>
            </p>
          </div>

          <div className="SoloModeStartButtons">
            <button className="iconButton" onClick={handleToggle}>
              <FontAwesomeIcon icon={isRunning ? faPause : faPlay} size="2x" />
            </button>
            <button className="iconButton" onClick={handleEnd}>
              <FontAwesomeIcon icon={faStop} size="2x" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoloModeStart;

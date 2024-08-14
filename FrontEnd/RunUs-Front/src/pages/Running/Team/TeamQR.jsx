import { useState, useEffect, useRef, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import "../../../styles/Running/Team/TeamQR.css";
import TabBar from "../../../components/common/TabBar";
import { UserContext } from "../../../hooks/UserContext";

// 뒤로가기 버튼 생성
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// 사용자 정의 훅: QR 코드 스캐닝
export const useCustomZxing = (onDecodeResult) => {
  const [reader, setReader] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && !reader) {
      // 비디오 스트림의 facingMode를 설정합니다
      const constraints = {
        video: {
          facingMode: "environment", // 후면 카메라를 사용하도록 설정
        },
      };

      // 비디오 스트림 요청
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          ref.current.srcObject = stream;
          const newReader = new BrowserMultiFormatReader();

          // QR 코드 스캔
          newReader
            .decodeFromVideoDevice(null, ref.current, (result) => {
              if (result) {
                onDecodeResult(result);
              } else {
                console.warn("Decoding result was null or undefined");
              }
            })
            .catch((err) => {
              console.error("Decoding error:", err);
            });

          setReader(newReader);
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err);
        });
    }

    return () => {
      if (reader) {
        reader.reset();
      }
      if (ref.current && ref.current.srcObject) {
        const stream = ref.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        ref.current.srcObject = null; // Ensure to nullify the srcObject
      }
    };
  }, [reader, onDecodeResult]);

  return { ref };
};

// 팀 QR 컴포넌트
export const TeamQR = () => {
  const [data, setData] = useState("No result");
  const { addUserToRoom, userData } = useContext(UserContext);
  const { ref } = useCustomZxing((result) => {
    handleScan(result);
  });

  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleScan = (result) => {
    if (result && result.text) {
      const resultData = result.text;
      setData(resultData);

      if (isValidURL(resultData)) {
        const roomId = extractRoomIdFromUrl(resultData);
        if (roomId) {
          addUserToRoom({
            userId: userData.userId,
            nickname: userData.nickname,
          });
          joinRoom(roomId);
          window.location.href = resultData; // URL로 이동
        } else {
          console.log(resultData);
        }
      } else {
        console.log(resultData);
      }
    }
  };

  const joinRoom = (roomId) => {
    const ws = new WebSocket(
      `wss://i11e103.p.ssafy.io:8001/ws/chat?roomId=${roomId}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection opened");

      const message = {
        type: "ENTER",
        roomId: roomId,
        sender: userData.nickname,
        message: "",
        userId: userData.userId,
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      const receivedData = event.data;
      console.log(receivedData);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error(error);
    };
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const extractRoomIdFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return (
    <div>
      <div className="header-container">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)} // 버튼 클릭 시 이전 페이지로 이동
          className="back-button"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <h3 className="header-title">QR 스캔</h3>
      </div>
      <TabBar />
      <div className="qr-reader-container">
        <video ref={ref} autoPlay style={{ height: "400px", width: "300px", borderRadius: "10px" }} />
      </div>
    </div>
  );
};

export default TeamQR;

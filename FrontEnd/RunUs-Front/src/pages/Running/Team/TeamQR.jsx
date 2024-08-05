import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

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
        if (ref.current.srcObject) {
          const stream = ref.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, [reader, onDecodeResult]);

  return { ref };
};

// 팀 QR 컴포넌트
export const TeamQR = () => {
  const [result, setResult] = useState("");
  const { ref } = useCustomZxing((result) => {
    if (result) {
      setResult(result.getText());
    }
  });

  return (
    <>
      <video ref={ref} autoPlay />
      <p></p>
    </>
  );
};

export default TeamQR;

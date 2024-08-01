import "../../styles/Report/ReportItem.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ReportItem = ({ onDistanceChange }) => {
  // API에서 가져온 데이터를 저장할 상태
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);

  // localStorage에서 userId 가져오기
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // 비동기 함수 정의
    const fetchData = async () => {
      try {
        const response = await axios.get("api/v1/record/recent", {
          params: { user_id: 1 }, // userId를 파라미터로 전달
        });

        // console.log(response.data); // 응답 데이터 구조 확인

        // 응답 데이터에서 배열 추출 (응답 데이터 구조에 맞게 수정)
        setReportData(response.data.data || []);
        setError(null); // 오류 초기화

        // 가장 최근 데이터에서 거리 값을 가져와서 부모 컴포넌트에 전달
        if (response.data.data && response.data.data.length > 0) {
          const latestDistance = response.data.data[0].distance;
          const convertedDistance = (latestDistance / 1000).toFixed(2) + " km";
          if (onDistanceChange) {
            onDistanceChange(convertedDistance);
          }
        }
      } catch (err) {
        setError(err.message);
        setReportData([]);
      }
    };

    fetchData();
  }, [userId, onDistanceChange]);

  const convertDistance = (meters) => {
    return (meters / 1000).toFixed(2);
  };

  const convertTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    const secsStr = String(secs).padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secsStr}`;
  };

  return (
    <div>
      {Array.isArray(reportData) && reportData.length > 0 ? (
        reportData.map((item, index) => (
          <div className="report_container" key={index}>
            <div className="record_container">
              <div className="record_date">{item.recordDate}</div>
              <div className="mode_indicator">
                {item.party_id ? "팀 모드" : "솔로 모드"}
              </div>
              <div className="record_details">
                <div className="distance">
                  {convertDistance(item.distance)} km
                </div>
                <div className="kcal">{item.kcal} kcal</div>
                <div className="time">{convertTime(item.time)}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>데이터가 없습니다.</div>
      )}
      <div className="pagination"></div>
    </div>
  );
};

export default ReportItem;

import "../../styles/Report/ReportItem.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaRunning, FaFire } from "react-icons/fa";

const ReportItem = () => {
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("api/v1/record/all", {
          params: { user_id: userId },
        });

        const data = response.data.data || [];
        const sortedData = data.sort(
          (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
        );

        setReportData(sortedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setReportData([]);
      }
    };

    fetchData();
  }, [userId]);

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
    <div className="recent_container">
      <h3 className="recent_active">최근 활동</h3>
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
                  <FaRunning />
                  {convertDistance(item.distance)} km
                </div>
                <div className="kcal">
                  <FaFire />
                  {item.kcal} kcal
                </div>
                <div className="time">
                  <IoMdTime />
                  {convertTime(item.time)}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <p className="noReport">데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ReportItem;

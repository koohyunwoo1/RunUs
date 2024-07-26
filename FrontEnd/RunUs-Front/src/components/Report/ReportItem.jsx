import "../../styles/Report/ReportItem.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ReportItem = () => {
  // API에서 가져온 데이터를 저장할 상태
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);

  // localStorage에서 userId 가져오기
  const userId = localStorage.getItem("userId");
  console.log(userId);
  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    // 비동기 함수 정의
    const fetchData = async () => {
      try {
        const response = await axios.get("api/v1/record/recent", {
          params: {
            userId: 1,
          },
        });
        // 상태 업데이트
        setReportData(response.data);
      } catch (err) {
        // 오류 상태 업데이트
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="report_container">
      <h2 className="running_date">최근 활동</h2>
      <ul>
        {reportData.map((item, index) => (
          <li key={index} className="record_container">
            <div className="record_name">측정 날짜: {item.time}초 </div>
            <div className="record_name">거리: {item.distance} 미터</div>
            <div className="record_name">칼로리: {item.kcal} kcal</div>
            <div className="record_name">시간: {item.time} 초</div>
          </li>
        ))}
      </ul>
      <div className="pagination"></div>
    </div>
  );
};

export default ReportItem;

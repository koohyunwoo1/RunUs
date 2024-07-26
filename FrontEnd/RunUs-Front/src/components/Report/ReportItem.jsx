import "../../styles/Report/ReportItem.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ReportItem = () => {
  // API에서 가져온 데이터를 저장할 상태
  const [reportData, setReportData] = useState([]);
  console.log(reportData);
  // 오류를 저장할 상태
  const [error, setError] = useState(null);
  // 페이지와 페이지당 항목 수 상태
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // localStorage에서 userId 가져오기
  const userId = localStorage.getItem("userId");

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    // 비동기 함수 정의
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/record/recent/1`, {});
        // 상태 업데이트
        setReportData(response.data);
      } catch (err) {
        // 오류 상태 업데이트
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // 데이터 렌더링
  return (
    <div className="report-item">
      <h2>최근 활동</h2>
      <ul>
        {reportData.map((item, index) => (
          <li key={index}>
            <div>측정 날짜: {item.time}초 </div>
            <div>거리: {item.distance} 미터</div>
            <div>칼로리: {item.kcal} kcal</div>
            <div>시간: {item.time} 초</div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        >
          이전 페이지
        </button>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>
          다음 페이지
        </button>
      </div>
    </div>
  );
};

export default ReportItem;

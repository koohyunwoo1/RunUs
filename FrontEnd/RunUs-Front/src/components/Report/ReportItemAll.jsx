import "../../styles/Report/ReportItem.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaRunning, FaFire } from "react-icons/fa";

const ReportItem = () => {
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true)
  const [filteredData, setFilteredData] = useState([]);
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'solo', 'team'
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("api/v1/record/all", {
          params: { 
            userId: userId,
            page: page,
            size: size,
          },
        });

        console.log('API response:', response.data);
        const data = response.data.data || [];
        const sortedData = data.sort(
          (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
        );

        setReportData(prevData => [...prevData, ...sortedData]);
        setHasMore(data.length === size)
        setError(null);
      } catch (err) {
        setError(err.message);
        setReportData([]);
      }
    };

    fetchData();
  }, [userId, page]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && hasMore) {
      setPage(prevPage => prevPage + 1) // 페이지 번호를 증가시켜 다음 데이터 요청
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore])

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

  useEffect(() => {
    if (filterMode === "all") {
      setFilteredData(reportData);
    } else {
      const modeFilteredData = reportData.filter(
        (item) =>
          (filterMode === "solo" && item.party_id === null) ||
          (filterMode === "team" && item.party_id !== null)
      );
      setFilteredData(modeFilteredData);
    }
  }, [reportData, filterMode]);

  const handleFilterChange = (event) => {
    setFilterMode(event.target.value);
  };

  const formatDate = (timestamp) => {
    console.log('Timestamp received:', timestamp)
    if (!timestamp) {
      return "N/A"; // or any other placeholder text
    }

    // Convert timestamp to Date object
    const date = new Date(timestamp);
    
    // Extract and format date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  };

  return (
    <div>
      <div className="record_selection">
        <h2 className="recent_active" style={{ fontFamily: "PreSemiBold" }}>
          최근 활동
        </h2>
        <select
          onChange={handleFilterChange}
          value={filterMode}
          style={{
            fontFamily: "PreSemiBold",
            border: "none",
            paddingRight: "10px",
          }}
        >
          <option value="all">모든 기록</option>
          <option value="solo">솔로 모드</option>
          <option value="team">팀 모드</option>
        </select>
      </div>

      {Array.isArray(filteredData) && filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <div className="report_container" key={index}>
            <div className="record_container">
              <div className="record_container2">
                <div className="mode_indicator">
                  {item.party_id === null ? "솔로 모드" : "팀 모드"}
                </div>
                <div className="record_date">{formatDate(item.record_date)}</div>
              </div>
              <div className="record_details">
                <div className="distance">
                  <FaRunning style={{ color: "gray" }} />
                  {convertDistance(item.distance)}
                  <span
                    style={{
                      color: "gray",
                      fontWeight: "15",
                      marginLeft: "3px",
                    }}
                  >
                    km
                  </span>
                </div>
                <div className="kcal">
                  <FaFire style={{ color: "rgb(255, 120, 0)" }} />
                  {item.kcal}
                  <span
                    style={{
                      color: "gray",
                      fontWeight: "15",
                      marginLeft: "3px",
                    }}
                  >
                    kcal
                  </span>
                </div>
                <div className="time">
                  <IoMdTime style={{ color: "brown" }} />
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

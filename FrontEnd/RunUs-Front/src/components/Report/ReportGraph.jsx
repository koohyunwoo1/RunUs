import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/Report/ReportGraph.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReportGraph = () => {
  const [graphData, setGraphData] = useState(null);
  const [graphTotalData, setGraphTotalData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [years, setYears] = useState([
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ]);

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `api/v1/record/graph/${selectedYear}`,
          {
            params: {
              user_id: userId,
            },
          }
        );
        console.log(response.data.data);
        setGraphData(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTotalData = async () => {
      try {
        const response = await axios.get("api/v1/record/total_distance", {
          params: {
            user_id: userId,
            year: selectedYear,
          },
        });
        console.log(response.data.data);
        setGraphTotalData(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    fetchTotalData();
  }, [selectedYear]);

  // 드롭다운에서 년도 변경 시 호출되는 함수
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // 거리 단위 변환 함수
  const convertDistance = (meters) => {
    return (meters / 1000).toFixed(2);
  };

  // 시간 단위 변환 함수
  const convertTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    const secsStr = String(secs).padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secsStr}`;
  };

  // X축 월 형식화
  const formatXAxisMonth = (month) => {
    return month + "월";
  };

  // 툴팁 내용 렌더링
  const renderTooltipContent = (props) => {
    if (props.active && props.payload && props.payload.length) {
      const { recordCount, totalTime, totalDistance } =
        props.payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="desc">
            <span>{`${recordCount}회`}</span>
            <span>{`${convertDistance(totalDistance)} km`}</span>
            <span>{`${convertTime(totalTime)}`}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h1 style={{ marginLeft: "15px" }}>
        {graphTotalData ? convertDistance(graphTotalData) : "0"} km
      </h1>
      <select
        onChange={handleYearChange}
        className="Report-Graph-Option"
        value={selectedYear}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <div className="Report-Graph">
        {graphData && Array.isArray(graphData) && graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={graphData}
              margin={{ top: 15, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis dataKey="month" tickFormatter={formatXAxisMonth} />
              <YAxis
                width={70}
                tickFormatter={(value) => convertDistance(value) + " km"}
              />
              <Tooltip content={renderTooltipContent} />
              <Bar dataKey="totalDistance" fill="#d3d3d3" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ReportGraph;

import "../../styles/Report/ReportItem.css"

const ReportItem = () => {
  return (
    <div className="report_container">
      <div className="running_date">
        2024.07.16
      </div>
      <div className="mode">
        솔로 모드
      </div>
      <div className="record_container">
        <div className="distance_record">1.2</div>
        <div className="kcal_record">224</div>
        <div className="time_record">03:14</div>
      </div>
      <div className="record_name">
        <div>km</div>
        <div>kcal</div>
        <div>시간</div>
      </div>
    </div>
  )
};

export default ReportItem;

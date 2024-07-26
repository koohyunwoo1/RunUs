import Header from "../../components/common/Header";
import "../../styles/Report/ReportHome.css";
import ReportItem from "../../components/Report/ReportItem";
import ReportGraph from "../../components/Report/ReportGraph";
const ReportHome = () => {
  return (
    <div>
      <Header />
      <div className="ReportHome">
        <ReportGraph />
      </div>
      <div>
        <ReportItem />
      </div>
    </div>
  );
};

export default ReportHome;

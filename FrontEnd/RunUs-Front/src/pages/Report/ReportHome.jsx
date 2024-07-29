import Header from "../../components/common/Header";
import "../../styles/Report/ReportHome.css";
import ReportGraph from "../../components/Report/ReportGraph";
import ReportItemAll from "../../components/Report/ReportItemAll";
const ReportHome = () => {
  return (
    <div>
      <Header />
      <div className="ReportHome">
        <ReportGraph />
      </div>
      <div>
        <ReportItemAll />
      </div>
    </div>
  );
};

export default ReportHome;

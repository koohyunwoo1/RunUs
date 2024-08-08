import Header from "../../components/common/Header";
import "../../styles/Report/ReportHome.css";
import ReportGraph from "../../components/Report/ReportGraph";
import ReportItemAll from "../../components/Report/ReportItemAll";
import TopButton from "../../components/common/TopButton"; // TopButton import

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
      <TopButton /> {/* TopButton 추가 */}
    </div>
  );
};

export default ReportHome;

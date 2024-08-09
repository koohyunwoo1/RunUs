import "../../styles/Report/ReportHome.css";
import ReportGraph from "../../components/Report/ReportGraph";
import ReportItemAll from "../../components/Report/ReportItemAll";
import TopButton from "../../components/common/TopButton"; // TopButton import
import TabBar from "../../components/common/TabBar";

const ReportHome = () => {
  return (
    <div>
      <div className="ReportHome" >
        <ReportGraph />
      </div>
      <div style={{ paddingBottom: "70px"}}>
        <ReportItemAll />
      </div>
      <TopButton /> {/* TopButton 추가 */}
      <TabBar />
    </div>
  );
};

export default ReportHome;

import Header from "../../../components/common/Header";
import "../../../styles/Running/Team/TeanCheck.css";
// import Measure from "../../../components/Running/common/Measure";
import Reverse from "../../../components/Running/Team/ReverseGeolocation";
const TeamCheck = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="TeamCheck">
        {/* <Measure /> */}
        <Reverse />
      </div>
    </div>
  );
};

export default TeamCheck;

import Header from "../../../components/common/Header";
import "../../../styles/Running/Solo/SoloMode.css";
import Measure from "../../../components/Running/common/Measure";
const SoloMode = () => {
  return (
    <div>
      <Header />
      <h1 className="SoloMode">SoloHome</h1>
      <Measure />
    </div>
  );
};

export default SoloMode;

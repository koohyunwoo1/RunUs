import React, { useEffect } from "react";
import "../../styles/Home/LogOutHome.css";
import { useInView } from "react-intersection-observer";
import LogOutHeader from "../../components/Home/LogOutHeader";

const LogOutHome = () => {
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (inView1) {
        document.querySelectorAll(".imageItem").forEach((item, index) => {
          item.style.transitionDelay = `${index * 0.3}s`;
          item.classList.add("animate");
        });
      }

      if (inView2) {
        document.querySelectorAll(".imageItem2").forEach((item, index) => {
          item.style.transitionDelay = `${index * 0.3}s`;
          item.classList.add("animate");
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [inView1, inView2]);

  return (
    <div>
      <LogOutHeader />
      <div className="LogOut-container">
        <h1 className="title">
          언제 어디서나 <br />
          RunUs와 즐겁게 달릴 수 있도록
        </h1>
        <h3 className="subtitle">
          건강하고 강한 당신을 위한 러닝 웹사이트로 뛰어보세요.
        </h3>
        <div className="image" ref={ref1}>
          {/* <img
            src="src/assets/Running(2).gif"
            // src="src/assets/RunningPhone.png"
            alt=""
            className={inView1 ? "imageItem animate" : "imageItem"}
          /> */}
        </div>
      </div>

      <div className="LogOut-container2">
        <span className="tag">목표 만들기</span>
        <h1 className="title2">시작이 어렵다면 ?</h1>
        <h1 className="title2">작은 미션부터 시작해보세요.</h1>
        <div className="image2" ref={ref2}>
          <img src="src/assets/logo2.png" alt="" className="imageItem" />
          <img src="src/assets/logo3.png" alt="" className="imageItem" />
          <img src="src/assets/logo2.png" alt="" className="imageItem" />
          <img src="src/assets/logo3.png" alt="" className="imageItem" />
        </div>
      </div>

      <div className="LogOut-container3">
        <span className="tag">루틴 만들기</span>
        <h1 className="title3">
          꾸준히 기록하고 <br />
          건강한 습관을 만들어보세요 !
        </h1>
        <div className="image3">
          <img
            src="src/assets/Phone.png"
            alt=""
            className={inView2 ? "imageItem2 animate" : "imageItem2"}
          />
        </div>
      </div>
    </div>
  );
};

export default LogOutHome;

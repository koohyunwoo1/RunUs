import "../../../styles/Running/Team/TeamSaying.css";
import React, { useState, useEffect } from "react";

// 인용구 배열
const quotes = [
  "내가 잘 뛰는 것은 타고났다기 보다는 노력했기 때문이다.",
  "마라톤 경주에서 가장 큰 감동을 받은 사람은 저 자신입니다.",
  "달리기는 내게 명상이며 순화된 정신이고, 우주와의 교류, 기분 전환제이며 영혼의 교감이다.",
  "할 수 있다, 잘 될 것이다. 라고 결심하라 ! 그러고 나서 방법을 찾아라.",
  "물고기는 헤엄치고 새는 날고 인간은 달린다",
  "인간은 빨리 달리기가 아니라 멀리 달리기 위해 태어났다. 아킬레스건, 목덜미 인대, 수많은 힘줄이 말해준다.",
  "기억하라. 잘 달린 뒤의 기분이 달리기를 할 생각만 하면서 하는 일 없이 지낸 뒤의 기분보다 훨씬 좋다는 것을.",
  "운동화 한 켤레 후다닥 신고 문 밖으로 달려 나가면, 당신이 있는 곳이 바로 여기, 자유. ",
];

const TeamSaying = () => {
  // 현재 표시될 인용구와 페이드 상태를 상태로 관리
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // 인용구 변경 주기를 설정 (여기서는 3초마다 변경)
    const interval = setInterval(() => {
      // 페이드 아웃 시작
      setFade(false);

      // 페이드 아웃 효과가 끝난 후 인용구 변경
      setTimeout(() => {
        // 현재 인용구의 인덱스를 찾음
        const currentIndex = quotes.indexOf(currentQuote);
        // 다음 인덱스를 계산하고, 배열의 끝에 도달하면 처음으로 돌아감
        const nextIndex = (currentIndex + 1) % quotes.length;
        // 다음 인용구를 상태로 설정
        setCurrentQuote(quotes[nextIndex]);
        // 페이드 인 시작
        setFade(true);
      }, 1000); // 페이드 아웃 시간
    }, 3000); // 인용구 변경 주기

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearInterval(interval);
  }, [currentQuote]); // currentQuote가 변경될 때마다 effect가 실행됨

  return (
    <div className={`team-saying ${fade ? "fade-in" : "fade-out"}`}>
      {/* fade 상태 변수 */}
      {/* fade가 true일때는 fade-in 클래스를 적용 */}
      {/* fade가 false일때는 fade-out 클래스를 적용 */}
      {currentQuote}
    </div>
  );
};

export default TeamSaying;

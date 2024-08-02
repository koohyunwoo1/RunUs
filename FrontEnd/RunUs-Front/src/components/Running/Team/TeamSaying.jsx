import "../../../styles/Running/Team/TeamSaying.css";
import React, { useState, useEffect } from "react";

// 인용구 배열
const quotes = [
  "내가 잘 뛰는 것은 타고났다기 보다는 노력했기 때문이다.",
  "마라톤 경주에서 가장 큰 감동을 받은 사람은 저 자신입니다.",
  "달리기는 내게 명상이며 순화된 정신이고, 우주와의 교류, 기분 전환제이며 영혼의 교감이다.",
  "할 수 있다, 잘 될 것이다. 라고 결심하라 ! 그러고 나서 방법을 찾아라.",
  "우사인 볼트가 세계에서 왜 제일 달리기가 빠른 사람인지 알아요 ? 끝까지 갔기 때문이에요.",
  "물고기는 헤엄치고 새는 날고 인간은 달린다",
  "인간은 빨리 달리기가 아니라 멀리 달리기 위해 태어났다. 아킬레스건, 목덜미 인대, 수많은 힘줄이 말해준다.",
  "기억하라. 잘 달린 뒤의 기분이 달리기를 할 생각만 하면서 하는 일 없이 지낸 뒤의 기분보다 훨씬 좋다는 것을.",
  "운동화 한 켤레 후다닥 신고 문 밖으로 달려 나가면, 당신이 있는 곳이 바로 여기, 자유. ",
];

const TeamSaying = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        const currentIndex = quotes.indexOf(currentQuote);
        const nextIndex = (currentIndex + 1) % quotes.length;
        setCurrentQuote(quotes[nextIndex]);
        setFade(true);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentQuote]);

  // 우사인 볼트와 관련된 인용구인지 확인하는 함수
  const isBoltQuote = (quote) => {
    return quote.includes("우사인 볼트");
  };

  // 클릭 이벤트 핸들러
  const handleClick = () => {
    if (isBoltQuote(currentQuote)) {
      window.location.href = "https://www.youtube.com/watch?v=3vAb86QXl1Q";
    }
  };

  return (
    <div
      className={`team-saying ${fade ? "fade-in" : "fade-out"}`}
      onClick={handleClick} // 클릭 이벤트 핸들러 추가
    >
      {currentQuote}
    </div>
  );
};

export default TeamSaying;

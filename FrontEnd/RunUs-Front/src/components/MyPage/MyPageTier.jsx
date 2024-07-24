import React, { useState, useEffect } from "react";
import "../../styles/MyPage/MyPageTier.css";

const tiers = [
  { name: "Unranked", min: 0, max: 49, color: "tier-unranked" },
  { name: "Bronze", min: 50, max: 349, color: "tier-bronze" },
  { name: "Silver", min: 350, max: 999, color: "tier-silver" },
  { name: "Gold", min: 1000, max: 1999, color: "tier-gold" },
  { name: "Platinum", min: 2000, max: 4999, color: "tier-platinum" },
  { name: "Diamond", min: 5000, max: Infinity, color: "tier-diamond" },
];

const MyPageTier = () => {
  const [xp, setXp] = useState(6000);
  // 임의의 경험치
  const [currentTier, setCurrentTier] = useState(tiers[0]);

  useEffect(() => {
    const tier = tiers.find((tier) => xp >= tier.min && xp <= tier.max);
    setCurrentTier(tier);
  }, [xp]);

  // 사용자가 input창을 통해서 경험치를 변경할때 호출되는 함수
  // const handleXpChange = (e) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (!isNaN(value)) {
  //     setXp(value);
  //   }
  // };

  // 다음 티어까지 남은 경험치 계싼
  const getNextTierInfo = () => {
    const nextTier = tiers.find((tier) => tier.min > xp);
    const nextTierXp = nextTier ? nextTier.min - xp : 0;
    return { name: nextTier ? nextTier.name : "최고 티어", xp: nextTierXp };
  };

  // 컴포넌트 렌더링
  return (
    <div className={`card ${currentTier.color}`}>
      <h2>{currentTier.name}</h2>
      <p>경험치: {xp}</p>
      {/* 경험치 */}
      {/* <input type="number" value={xp} onChange={handleXpChange} min="0" /> */}
      {/* 경험치 임시로 입력 */}
      <div className="experience-bar">
        <div
          className="filler"
          style={{
            width: `${
              currentTier.max === Infinity
                ? 100
                : ((xp - currentTier.min) /
                    (currentTier.max - currentTier.min)) *
                  100
            }%`,
          }}
        ></div>
      </div>
      {currentTier.name !== "Diamond" && (
        <p>
          {getNextTierInfo().name}까지: {getNextTierInfo().xp} 경험치
        </p>
      )}
    </div>
  );
};

export default MyPageTier;

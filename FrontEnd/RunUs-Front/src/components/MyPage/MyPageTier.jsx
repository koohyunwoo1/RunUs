import React, { useState, useEffect, useContext } from "react";
import "../../styles/MyPage/MyPageTier.css";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";

const tiers = [
  { name: "Unranked", min: 0, max: 49, color: "tier-unranked" },
  { name: "Bronze", min: 50, max: 349, color: "tier-bronze" },
  { name: "Silver", min: 350, max: 999, color: "tier-silver" },
  { name: "Gold", min: 1000, max: 1999, color: "tier-gold" },
  { name: "Platinum", min: 2000, max: 4999, color: "tier-platinum" },
  { name: "Diamond", min: 5000, max: Infinity, color: "tier-diamond" },
];

const MyPageTier = () => {
  const [xp, setXp] = useState(0);
  const userId = localStorage.getItem("userId");
  const [currentTier, setCurrentTier] = useState(tiers[0]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/v1/search-profile?userId=${userId}`)
        .then((response) => {
          const xp = response.data.data.exp;
          setXp(xp);
          const tier = tiers.find((tier) => xp >= tier.min && xp <= tier.max);
          setCurrentTier(tier || tiers[tiers.length - 1]); // 기본값으로 최고 티어 설정
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [userId]);

  // 다음 티어까지 남은 경험치 계산
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

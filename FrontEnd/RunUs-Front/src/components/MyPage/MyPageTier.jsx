import React, { useState, useEffect } from "react";
import "../../styles/MyPage/MyPageTier.css";
import axios from "axios";
import { CiCircleQuestion } from "react-icons/ci";

// 티어 정보
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
  const [currentTier, setCurrentTier] = useState(tiers[0]);
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/v1/search-profile?userId=${userId}`)
        .then((response) => {
          const xp = response.data.data.exp;
          setXp(xp);
          const tier = tiers.find((tier) => xp >= tier.min && xp <= tier.max);
          setCurrentTier(tier || tiers[tiers.length - 1]);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [userId]);

  const getNextTierInfo = () => {
    const nextTier = tiers.find((tier) => tier.min > xp);
    const nextTierXp = nextTier ? nextTier.min - xp : 0;
    return { name: nextTier ? nextTier.name : "최고 티어", xp: nextTierXp };
  };

  // 모달 열기
  const openModal = () => setShowModal(true);

  // 모달 닫기
  const closeModal = () => setShowModal(false);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('tier_modal-overlay')) {
      closeModal();
    }
  };

  return (
    <>
      <div className={`card ${currentTier.color}`}>
        <div className="tier-header">
          <h2 style={{ fontFamily: "VitroCore" }}>{currentTier.name}</h2>
          <div>
            <CiCircleQuestion className="tierHelp" onClick={openModal} />
          </div>
        </div>
        <p
          style={{
            fontFamily: "VitroCore",
            fontSize: "40px",
            fontStyle: "oblique",
          }}
        >
          {xp}
        </p>
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
            {getNextTierInfo().name}까지: {getNextTierInfo().xp}점 남음
          </p>
        )}
      </div>

      {showModal && (
        <div className="tier_modal-overlay" onClick={handleOverlayClick}>
          <div className="tier_modal-content">
            <ul>
              {tiers.map((tier) => (
                <li className="tierexplain" key={tier.name}>
                  <strong>
                    <span className={`${tier.color}-text`}>{tier.name}</span> :
                  </strong>{" "}
                  {tier.min}점 ~ {tier.max === Infinity ? "" : `${tier.max}점`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPageTier;

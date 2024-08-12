import React, { useState, useEffect, useRef } from "react";
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const userId = localStorage.getItem("userId");

  const cardRef = useRef(null);
  const [rect, setRect] = useState(null);

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

  useEffect(() => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, [cardRef.current]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rect) {
        const left = e.clientX - rect.left;
        const top = e.clientY - rect.top;
        const centerX = left - rect.width / 2;
        const centerY = top - rect.height / 2;
        const d = Math.sqrt(centerX ** 2 + centerY ** 2);

        cardRef.current.style.boxShadow = `
          ${-centerX / 10}px ${-centerY / 10}px 10px rgba(0, 0, 0, 0.1)
        `;

        cardRef.current.style.transform = `
          rotate3d(
            ${-centerY / 100}, ${centerX / 100}, 0, ${d / 10}deg
          )
        `;

        cardRef.current.classList.add("mousemove-effect");
      }
    };

    const handleMouseLeave = () => {
      cardRef.current.style.boxShadow = "";
      cardRef.current.style.transform = "";
      cardRef.current.classList.remove("mousemove-effect");
    };

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener("mousemove", handleMouseMove);
      cardElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (cardElement) {
        cardElement.removeEventListener("mousemove", handleMouseMove);
        cardElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [rect]);

  const getNextTierInfo = () => {
    const nextTier = tiers.find((tier) => tier.min > xp);
    const nextTierXp = nextTier ? nextTier.min - xp : 0;
    return { name: nextTier ? nextTier.name : "최고 티어", xp: nextTierXp };
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("tier_modal-overlay")) {
      closeModal();
    }
  };

  const handleCardClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800); // 클릭 애니메이션 지속 시간과 맞추기
  };

  return (
    <>
      <div
        className={`card ${currentTier.color} ${isFlipped ? "flip" : ""} ${
          isClicked ? "clicked" : ""
        }`}
        ref={cardRef} // Attach ref to card element
        onClick={handleCardClick}
      >
        <div className="tier-header">
          <h2 style={{ fontFamily: "VitroCore" }}>{currentTier.name}</h2>
          {/* <div>
            <CiCircleQuestion className="tierHelp" onClick={openModal} />
          </div> */}
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

import React, { useState, useEffect } from "react";

const AnimatedDistance = ({ targetDistance }) => {
  const [displayedDistance, setDisplayedDistance] = useState(0);

  useEffect(() => {
    const duration = 500;
    const start = performance.now();
    const end = targetDistance;

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const distance = Math.floor(progress * end);

      setDisplayedDistance(distance);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayedDistance(end);
      }
    };

    requestAnimationFrame(animate);
  }, [targetDistance]);

  return <span>{displayedDistance} km</span>;
};

export default AnimatedDistance;

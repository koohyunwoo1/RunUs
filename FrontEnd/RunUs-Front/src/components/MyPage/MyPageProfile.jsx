import React, { useState, useRef, useEffect, useContext } from "react";
import "../../styles/MyPage/MyPageProfile.css";
import NormalProfile from "../../assets/profile(normal).png";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";

const MyPageProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [nickname, setNickname] = useState("");
  // const { userId } = useContext(UserContext);
  const userId = localStorage.getItem("userId");
  console.log(userId);
  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/v1/search-profile?userId=${userId}`)
        .then((response) => {
          setNickname(response.data.data.nickname);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-container">
      <img
        src={profileImage || NormalProfile}
        className="profile-image"
        onClick={handleImageClick}
      />
      <input
        type="file"
        id="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
      />
      <h1>{nickname}</h1>
    </div>
  );
};

export default MyPageProfile;

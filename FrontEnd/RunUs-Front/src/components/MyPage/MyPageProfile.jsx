import React, { useState, useRef, useEffect } from "react";
import "../../styles/MyPage/MyPageProfile.css";
import NormalProfile from "../../assets/profile(normal).png";
import axios from "axios";
const MyPageProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 저장된 프로필 이미지를 가져옵니다.
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
    // 여기서 userId를 사용하여 닉네임을 가져올 수 있습니다.
    const userId = localStorage.getItem("userId");
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
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem("profileImage", imageData);
        // api 안만들어줘서 로컬에 저장함
        // 만들어주던가
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
        alt="Profile"
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

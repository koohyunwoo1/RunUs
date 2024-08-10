import React, { useState, useRef, useEffect } from "react";
import "../../styles/MyPage/MyPageProfile.css";
import NormalProfile from "../../assets/profile(normal).png";
import axios from "axios";

const BASE_URL = "http://localhost:8080"; // 서버의 베이스 URL

const MyPageProfile = () => {
  const [profileImage, setProfileImage] = useState(NormalProfile);
  const fileInputRef = useRef(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`/api/v1/search-profile?userId=${userId}`)
        .then((response) => {
          const { profileUrl, nickname } = response.data.data;
          if (profileUrl) {
            setProfileImage(`${BASE_URL}${profileUrl}`);
          }
          setNickname(nickname);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);

  const handleImageChange = async (e) => {
    const userId = localStorage.getItem("userId");
    const file = e.target.files[0];

    if (file) {
      const supportedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024;

      if (!supportedTypes.includes(file.type)) {
        alert("이미지 형식이 맞지 않습니다.");
        return;
      }

      if (file.size > maxSize) {
        alert("이미지 용량을 줄여주세요 !");
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file);

      try {
        const response = await axios.post("/api/v1/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const profileUrl = response.data.body.data.profileUrl;
        if (profileUrl) {
          setProfileImage(`${BASE_URL}${profileUrl}`);
        }
      } catch (error) {
        console.error("Image upload error:", error);
        setProfileImage(NormalProfile);
      }
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

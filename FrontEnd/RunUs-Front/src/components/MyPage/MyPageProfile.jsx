import React, { useState, useRef } from "react";
import "../../styles/MyPage/MyPageProfile.css";
import NormalProfile from "../../assets/profile(normal).png";

const MyPageProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

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
  // 프로필 이미지 클릭하면 파일 선택 창 오픈

  return (
    <div className="profile-container">
      <h1>user.nickname Profile</h1>
      <img
        src={profileImage || NormalProfile}
        // placeholder url을 사용하여 기본 이미지를 설정
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
    </div>
  );
};

export default MyPageProfile;

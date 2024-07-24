import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import "../../styles/MyPage/MyPageEdit.css";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const MyPageEdit = () => {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    region: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from local storage on component mount
  useEffect(() => {
    const fetchUserData = () => {
      const userData = JSON.parse(localStorage.getItem("userProfile")); // 로컬 스토리지에서 데이터 가져오기
      if (userData) {
        setForm(userData);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format phoneNumber to include dashes
    if (name === "phoneNumber") {
      // Remove non-numeric characters
      let formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3 && formattedValue.length <= 6) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3
        )}`;
      } else if (formattedValue.length > 6) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          6
        )}-${formattedValue.slice(6)}`;
      }
      setForm({
        ...form,
        [name]: formattedValue,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.nickname) errors.nickname = "닉네임은 필수입니다.";
    if (!form.email) errors.email = "이메일은 필수입니다.";
    if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "이메일이 유효하지 않습니다.";
    if (!form.phoneNumber) errors.phoneNumber = "휴대폰 번호는 필수입니다.";
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(form.phoneNumber))
      errors.phoneNumber =
        "휴대폰 번호는 올바른 형식이어야 합니다. (예: 010-1234-5678)";
    if (form.password && form.password.length < 8)
      errors.password = "비밀번호는 최소 8자리 이상이어야 합니다.";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Save updated data to local storage
      localStorage.setItem("userProfile", JSON.stringify(form));
      console.log("Form submitted", form); // 데이터 확인용 콘솔 출력
      navigate("/my-page-home"); // 수정 후 이동할 페이지
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div className="MyPageEdit">
        <h1>회원 정보 수정</h1>
        <form onSubmit={handleSubmit} className="MyPageEditForm">
          <div>
            <label className="MyPageEditLabel">이메일</label>
            <input
              type="email"
              name="email"
              className="MyPageEditInput"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="MyPageEditError">{errors.email}</p>}
          </div>
          <div>
            <label className="MyPageEditLabel">닉네임</label>
            <input
              type="text"
              name="nickname"
              className="MyPageEditInput"
              value={form.nickname}
              onChange={handleChange}
            />
            {errors.nickname && (
              <p className="MyPageEditError">{errors.nickname}</p>
            )}
          </div>
          <div>
            <label className="MyPageEditLabel">휴대폰 번호</label>
            <input
              type="text"
              name="phoneNumber"
              className="MyPageEditInput"
              value={form.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <p className="MyPageEditError">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="MyPageEditLabel">비밀번호</label>
            <input
              type="password"
              name="password"
              className="MyPageEditInput"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="MyPageEditError">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="MyPageEditLabel">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              className="MyPageEditInput"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="MyPageEditError">{errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <label className="MyPageEditLabel">사는 지역</label>
            <input
              type="text"
              name="region"
              className="MyPageEditInput"
              value={form.region}
              onChange={handleChange}
            />
          </div>
          <Button text={"수정 완료"} />
        </form>
      </div>
    </div>
  );
};

export default MyPageEdit;

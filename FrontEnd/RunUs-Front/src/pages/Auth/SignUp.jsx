import React, { useState } from "react";
import "../../styles/Auth/SignUp.css";
import LogOutHeader from "../../components/Home/LogOutHeader";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    emailDomain: "",
    nickname: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    weight: "",
    regionId: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // 하이픈 자동 추가
      const formattedValue = value
        .replace(/\D/g, "") // 숫자만 남기기
        .replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
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
    if (!form.emailDomain) errors.emailDomain = "도메인은 필수입니다."
    // if (!/\S+@\S+\.\S+/.test(form.email))
    //   errors.email = "이메일이 유효하지 않습니다.";
    if (!form.password) errors.password = "비밀번호는 필수입니다.";
    if (form.password.length < 8)
      errors.password = "비밀번호는 최소 8자리입니다.";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!form.weight) errors.weight = "체중은 필수입니다.";
    if (!form.phoneNumber) errors.phoneNumber = "휴대폰 번호는 필수입니다.";
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(form.phoneNumber))
      errors.phoneNumber =
        "휴대폰 번호는 올바른 형식이어야 합니다 (예: 010-1234-5678).";
    if (!form.regionId) errors.regionId = "사는 지역은 필수입니다."
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('/api/v1/signup', {
          nickname: form.nickname,
          email: `${form.email}@${form.emailDomain}`,
          password: form.password,
          phoneNumber: form.phoneNumber,
          weight: parseInt(form.weight, 10),
          regionId: parseInt(form.regionId, 10),
        });

        if (response.data.success) {
          console.log("회원 가입 성공", response.data)
          navigate("/signin"); // 회원가입 후 로그인 페이지로 이동
        } else {
          console.error("회원 가입 실패", response.data.message)
        }
      } catch (error) {
        console.error('회원가입 오류:', error);
      }
    }
  };

  return (
    <div>
      <LogOutHeader />
      <form onSubmit={handleSubmit} className="SignUpForm">
        <h1>회원 가입</h1>
        <div>
          <label className="SignUpLabel">이메일</label>
          <input
            type="text"
            name="email"
            className="SignUpInput"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="SignUpError">{errors.email}</p>}
        </div>
        <div>
          <label className="SignUpLabel">이메일 도메인</label>
          <input
            type="text"
            name="emailDomain"
            className="SignUpInput"
            value={form.emailDomain}
            onChange={handleChange}
          />
          {errors.emailDomain && <p className="SignUpError">{errors.emailDomain}</p>}
        </div>
        <div>
          <label className="SignUpLabel">닉네임</label>
          <input
            type="text"
            name="nickname"
            className="SignUpInput"
            value={form.nickname}
            onChange={handleChange}
          />
          {errors.nickname && <p className="SignUpError">{errors.nickname}</p>}
        </div>
        <div>
          <label className="SignUpLabel">휴대폰 번호</label>
          <input
            type="text"
            name="phoneNumber"
            className="SignUpInput"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <p className="SignUpError">{errors.phoneNumber}</p>
          )}
        </div>
        <div>
          <label className="SignUpLabel">비밀번호</label>
          <input
            type="password"
            name="password"
            className="SignUpInput"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="SignUpError">{errors.password}</p>}
        </div>
        <div>
          <label className="SignUpLabel">비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            className="SignUpInput"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="SignUpError">{errors.confirmPassword}</p>
          )}
        </div>
        <div>
          <label className="SignUpLabel">체중</label>
          <input
            type="number"
            name="weight"
            className="SignUpInput"
            value={form.weight}
            onChange={handleChange}
          />
          {errors.weight && <p className="SignUpError">{errors.weight}</p>}
        </div>
        <div>
          <label className="SignUpLabel">사는 지역</label>
          <input
            type="number"
            name="regionId"
            className="SignUpInput"
            value={form.regionId}
            onChange={handleChange}
          />
          {errors.regionId && <p className="SignUpError">{errors.regionId}</p>}
        </div>
        <Button text={"회원 가입"} />
      </form>
    </div>
  );
};

export default SignUp;

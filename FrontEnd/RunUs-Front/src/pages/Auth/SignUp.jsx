import React, { useState, useEffect, useContext } from "react";
import "../../styles/Auth/SignUp.css";
import LogOutHeader from "../../components/Home/LogOutHeader";
import Button from "../../components/common/Button";
import { UserContext } from "../../hooks/UserContext";
import axios from "axios";

const SignUp = () => {
  const { registerUser, error } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    emailDomain: "",
    nickname: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    weight: "",
    regionMajor: "", // 시/도
    regionId: "" // 시/군/구
  });

  const [errors, setErrors] = useState({});
  const [regionMajorOptions, setRegionMajorOptions] = useState([]);
  const [regionMinorOptions, setRegionMinorOptions] = useState([]);

  // 시/도 목록 가져오기
  useEffect(() => {
    const fetchRegionMajor = async () => {
      try {
        const response = await axios.get('/api/v1/region-major');
        setRegionMajorOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching region major data:', error);
      }
    };

    fetchRegionMajor();
  }, []);

  // 시/군/구 목록 가져오기
  useEffect(() => {
    const fetchRegionMinor = async (majorId) => {
      try {
        const response = await axios.get(`/api/v1/region-major/${majorId}`);
        setRegionMinorOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching region minor data:', error);
      }
    };

    if (form.regionMajor) {
      fetchRegionMinor(form.regionMajor);
    } else {
      setRegionMinorOptions([]);
    }
  }, [form.regionMajor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const formattedValue = value
        .replace(/\D/g, "")
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

  const handleSelectChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'regionId') {
      const selectedRegion = regionMinorOptions.find(option => option.name === e.target.value);
      if (selectedRegion) {
        setForm({
          ...form,
          regionId: selectedRegion.id, // ID로 설정
        })
      }
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.nickname) errors.nickname = "닉네임은 필수입니다.";
    if (!form.email) errors.email = "이메일은 필수입니다.";
    // if (!form.emailDomain) errors.emailDomain = "도메인은 필수입니다.";
    if (!form.password) errors.password = "비밀번호는 필수입니다.";
    if (form.password.length < 8)
      errors.password = "비밀번호는 최소 8자리입니다.";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!form.weight) errors.weight = "체중은 필수입니다.";
    if (!form.phoneNumber) errors.phoneNumber = "휴대전화번호는 필수입니다.";
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(form.phoneNumber))
      errors.phoneNumber = "휴대전화번호는 올바른 형식이어야 합니다.";
    if (!form.regionMajor) errors.regionMajor = "사는 지역은 필수입니다.";
    if (!form.regionId) errors.regionId = "시/군/구는 필수입니다.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form data:', form); // 데이터 확인
      const userData = {
        nickname: form.nickname,
        email: `${form.email}@${form.emailDomain}`,
        password: form.password,
        phoneNumber: form.phoneNumber,
        weight: parseInt(form.weight, 10),
        regionId: parseInt(form.regionId, 10),
      };

      await registerUser(userData);
    }
  };

  return (
    <div>
      <LogOutHeader />
      <form onSubmit={handleSubmit} className="SignUpForm">
        <h2>회원 가입</h2>
        <div className="inputDiv">
          {/* <label className="SignUpLabel">이메일</label> */}
          <input
            type="text"
            name="email"
            className="SignUpInput"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일"
          />
          {errors.email && <p className="SignUpError">{errors.email}</p>}
        </div>
        {/* <div>
          <label className="SignUpLabel">이메일 도메인</label>
          <input
            type="text"
            name="emailDomain"
            className="SignUpInput"
            value={form.emailDomain}
            onChange={handleChange}
            placeholder="도메인을 입력해 주세요"
          />
          {errors.emailDomain && <p className="SignUpError">{errors.emailDomain}</p>}
        </div> */}
        <div className="inputDiv">
          {/* <label className="SignUpLabel">닉네임</label> */}
          <input
            type="text"
            name="nickname"
            className="SignUpInput"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임"
          />
          {errors.nickname && <p className="SignUpError">{errors.nickname}</p>}
        </div>
        <div className="inputDiv">
          {/* <label className="SignUpLabel">휴대폰 번호</label> */}
          <input
            type="text"
            name="phoneNumber"
            className="SignUpInput"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="휴대전화번호"
          />
          {errors.phoneNumber && <p className="SignUpError">{errors.phoneNumber}</p>}
        </div>
        <div className="inputDiv">
          {/* <label className="SignUpLabel">비밀번호</label> */}
          <input
            type="password"
            name="password"
            className="SignUpInput"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
          />
          {errors.password && <p className="SignUpError">{errors.password}</p>}
        </div>
        <div className="inputDiv">
          {/* <label className="SignUpLabel">비밀번호 확인</label> */}
          <input
            type="password"
            name="confirmPassword"
            className="SignUpInput"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
          />
          {errors.confirmPassword && <p className="SignUpError">{errors.confirmPassword}</p>}
        </div>
        <div className="inputDiv">
          {/* <label className="SignUpLabel">체중</label> */}
          <input
            type="number"
            name="weight"
            className="SignUpInput"
            value={form.weight}
            onChange={handleChange}
            placeholder="체중 (kg)"
          />
          {errors.weight && <p className="SignUpError">{errors.weight}</p>}
        </div>
        <div className="inputDiv">
          <select
            name="regionMajor"
            className="SignUpInput"
            value={form.regionMajor}
            onChange={handleSelectChange}
          >
            <option value="">시/도 선택</option>
            {regionMajorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.regionMajor && <p className="SignUpError">{errors.regionMajor}</p>}
        </div>
        <div className="inputDiv">
          <select
            name="regionId"
            className="SignUpInput"
            value={form.regionId}
            onChange={handleSelectChange}
          >
            <option value="">시/군/구 선택</option>
            {regionMinorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.regionId && <p className="SignUpError">{errors.regionId}</p>}
        </div>
        <div className="inputDiv">
          <Button type="submit" text="회원 가입" className="signupButton" />
        </div>
      </form>
    </div>
  );
};

export default SignUp;

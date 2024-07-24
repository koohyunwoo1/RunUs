import React, { useState } from "react";
import "../../styles/Auth/SignUp.css";
import LogOutHeader from "../../components/Home/LogOutHeader";
import Button from "../../components/common/Button"
import { Link, useNavigate } from "react-router-dom"

const SignUp = () => {

  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    weight: "",
    region: "",
  })

  const nav = useNavigate()

  const [ errors, setErrors ] = useState({})
  
  const handleChange = async (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]:value,
    })
  }

  const validate = () => {
    const errors = {}
    if (!form.nickname) errors.nickname = "닉네임은 필수입니다."
    if (!form.email) errors.email = "이메일은 필수입니다."
    if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "이메일이 유효하지 않습니다"
    if (!form.password) errors.password = "비밀번호는 필수입니다."
    if (!form.password.length < 8) errors.password = "비밀번호는 최소 8자리 입니다."
    if (form.password !== form.confirmPassword) errors.confirmPassword = "비밀번호가 일치하지 않습니다."
    if (!form.weight) errors.weight = "체중은 필수입니다."
    return errors
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted", form)
      // 회원 가입 로직 처리
    }

  const payLoad = {
    // Create payload
    email: email,
    password: password,
    nickname: nickname,
    weight: weight,
    region: region,
  }

  }
  return (
    <div>
      <LogOutHeader />
      <form onSubmit={handleSubmit} className="SignUpForm">
        <h1>회원 가입</h1>
        <div>
          <label className="SignUpLabel">이메일</label>
          <input type="email" name="email" className="SignUpInput" value={form.email} onChange={handleChange} />
          {errors.email && <p className="SignUpError">{errors.email}</p>}
        </div>
        <div>
          <label className="SignUpLabel">닉네임</label>
          <input type="text" name="nickname" className="SignUpInput" value={form.nickname} onChange={handleChange} />
          {errors.nickname && <p className="SignUpError">{errors.nickname}</p>}
        </div>
        <div>
          <label className="SignUpLabel">비밀번호</label>
          <input type="password" name="password" className="SignUpInput" value={form.password} onChange={handleChange} />
          {errors.password && <p className="SignUpError">{errors.password}</p>}
        </div>
        <div>
          <label className="SignUpLabel">비밀번호 확인</label>
          <input type="password" name="confirmPassword" className="SignUpInput" value={form.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="SignUpError">{errors.confirmPassword}</p>}
        </div>
        <div>
          <label className="SignUpLabel">체중</label>
          <input type="number" name="weight" className="SignUpInput" value={form.weight} onChange={handleChange} />
          {errors.weight && <p className="SignUpError">{errors.weight}</p>}
        </div>
        <div>
          <label className="SignUpLabel">사는 지역</label>
          <input type="text" name="region" className="SignUpInput" value={form.region} onChange={handleChange} />
          {errors.region && <p className="SignUpError">{errors.region}</p>}
        </div>
        <Button text={"회원 가입"} />
      </form>
    </div>
  );
};

export default SignUp;
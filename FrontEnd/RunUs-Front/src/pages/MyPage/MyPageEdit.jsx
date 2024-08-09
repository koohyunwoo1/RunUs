import React, { useContext, useEffect, useState } from "react";
import TabBar from "../../components/common/TabBar";
import "../../styles/MyPage/MyPageEdit.css";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyPageEdit = () => {
  const [form, setForm] = useState({
    userId: "",
    nickname: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    weight: "",
    regionId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("AuthToken");

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `/api/v1/search-profile?userId=${userId}`
          );
          if (response.data.success) {
            const userData = response.data.data;
            console.log(userData)
            setForm({
              userId: userData.userId,
              nickname: userData.nickname || "",
              phoneNumber: userData.phoneNumber || "",
              weight: userData.weight || "",
              password: "", // 비밀번호는 보안상의 이유로 초기화
              confirmPassword: "", // 비밀번호 확인 초기화
              regionId: userData.regionId || "",
            });
          } else {
            console.error("사용자 정보를 가져오는 데 실패했습니다.");
          }
        } catch (error) {
          console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      console.error("사용자 ID가 없습니다.");
      setLoading(false); // 로딩 상태를 종료
    }
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3,4})(\d{0,4})/, "$1-$2-$3");
      setForm({
        ...form,
        [name]: formattedValue,
      });
    } else if (name === "weight" || name === "regionId") {
      setForm({
        ...form,
        [name]: value.replace(/[^0-9]/g, ""),
      });
    } else {
      setForm({
        ...form,
        [name]: value || "", // 빈 문자열로 설정
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.nickname) errors.nickname = "닉네임은 필수입니다.";
    if (!form.phoneNumber) errors.phoneNumber = "휴대폰 번호는 필수입니다.";
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(form.phoneNumber))
      errors.phoneNumber =
        "휴대폰 번호는 올바른 형식이어야 합니다. (예: 010-1234-5678)";
    if (form.password && form.password.length < 8)
      errors.password = "비밀번호는 최소 8자리 이상이어야 합니다.";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!form.weight || isNaN(form.weight) || form.weight <= 0)
      errors.weight = "체중은 양의 숫자로 입력해야 합니다.";
    if (!form.regionId || isNaN(form.regionId) || form.regionId <= 0)
      errors.regionId = "사는 지역은 유효한 숫자로 입력해야 합니다.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.patch(`/api/v1/update`, {
          userId: form.userId,
          nickname: form.nickname,
          weight: parseInt(form.weight, 10),
          password: form.password,
          phoneNumber: form.phoneNumber,
          regionId: parseInt(form.regionId, 10),
        });

        if (response.data.success) {
          console.log("회원 정보 수정 성공");
          navigate("/my-page-home");
        } else {
          console.error("회원 정보 수정 실패", response.data.message);
        }
      } catch (error) {
        console.error("정보 수정 중 오류 발생:", error.response || error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="MyPageEdit">
        <h1>회원 정보 수정</h1>
        <form onSubmit={handleSubmit} className="MyPageEditForm">
          <div className="memberEditDiv">
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
          <div className="memberEditDiv">
            <label className="MyPageEditLabel">휴대전화 번호</label>
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
          <div className="memberEditDiv">
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
          <div className="memberEditDiv">
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
          <div className="memberEditDiv">
            <label className="MyPageEditLabel">몸무게 (kg)</label>
            <input
              type="number"
              name="weight"
              className="MyPageEditInput"
              value={form.weight}
              onChange={handleChange}
            />
            {errors.weight && (
              <p className="MyPageEditError">{errors.weight}</p>
            )}
          </div>
          <div className="memberEditDiv">
            <label className="MyPageEditLabel">사는 지역</label>
            <input
              type="number"
              name="regionId"
              className="MyPageEditInput"
              value={form.regionId}
              onChange={handleChange}
            />
            {errors.regionId && (
              <p className="MyPageEditError">{errors.regionId}</p>
            )}
          </div>
          <Button text={"수정 완료"} />
        </form>
      </div>
      <TabBar />
    </div>
  );
};

export default MyPageEdit;

import React, { useContext, useEffect, useState } from "react";
import TabBar from "../../components/common/TabBar";
import "../../styles/MyPage/MyPageEdit.css";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MyPageEdit = () => {
  const [form, setForm] = useState({
    userId: "",
    nickname: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    weight: "",
    regionMajor: "", // 시/도
    regionId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("AuthToken");
  const [regionMajorOptions, setRegionMajorOptions] = useState([]);
  const [regionMinorOptions, setRegionMinorOptions] = useState([]);
  const { setUserData } = useContext(UserContext); // setUserData 가져오기

  // 시/도 목록 가져오기
  useEffect(() => {
    const fetchRegionMajor = async () => {
      try {
        const response = await axios.get("/api/v1/region-major");
        setRegionMajorOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching region major data:", error);
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
        console.error("Error fetching region minor data:", error);
      }
    };

    if (form.regionMajor) {
      fetchRegionMinor(form.regionMajor);
    } else {
      setRegionMinorOptions([]);
    }
  }, [form.regionMajor]);

  const handleSelectChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "regionId") {
      const selectedRegion = regionMinorOptions.find(
        (option) => option.name === e.target.value
      );
      if (selectedRegion) {
        setForm({
          ...form,
          regionId: selectedRegion.id, // ID로 설정
        });
      }
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `/api/v1/search-profile?userId=${userId}`
          );
          if (response.data.success) {
            const userData = response.data.data;
            console.log(userData);
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
    if (!form.regionMajor) errors.regionMajor = "사는 지역은 필수입니다.";
    if (!form.regionId) errors.regionId = "시/군/구는 필수입니다.";
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

          // 수정된 정보를 UserContext에 반영
          setUserData((prevData) => ({
            ...prevData,
            nickname: form.nickname,
            phoneNumber: form.phoneNumber,
            weight: form.weight,
            regionId: form.regionId,
          }));
          nav("/my-page-home");
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
        <div className="MyPageBackButton">
          <a onClick={() => nav("/my-page-home")} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} size="md" />
          </a>
        </div>
        <h1>위치 수정</h1>
        <form onSubmit={handleSubmit} className="MyPageEditForm">
          <div className="memberEditDiv">
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
            {errors.regionMajor && (
              <p className="SignUpError">{errors.regionMajor}</p>
            )}
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
            {errors.regionId && (
              <p className="SignUpError">{errors.regionId}</p>
            )}
          </div>
          <Button className={"MyPageEditButton"} text={"수정 완료"} />
        </form>
      </div>
      <div
        style={{
          textAlign: "right",
        }}
      ></div>
      <TabBar />
    </div>
  );
};

export default MyPageEdit;

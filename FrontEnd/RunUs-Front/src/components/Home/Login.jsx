import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력하세요");
      return;
    }

    try {
      const response = await axios.post("/api/v1/signin", { email, password });

      if (response.data.success) {
        // 로그인 성공 시
        console.log("로그인 성공", response.data)
        localStorage.setItem('AuthToken', response.data.token)
        // 로그인 후 필요한 작업 수행
        navigate("/home"); // 예: 대시보드로 이동
      } else {
        // 로그인 실패 시
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="login_container">
      <h2>로그인</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="SignInDiv1">
          <label htmlFor="email" className="LoginText">
            이메일 주소{" "}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일을 입력해 주세요"
          />
        </div>
        <div className="SignInDiv2">
          <label htmlFor="password" className="LoginText">
            비밀번호{" "}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해 주세요"
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;

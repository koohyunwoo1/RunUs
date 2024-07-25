import { useState, useContext } from "react";
import { UserContext } from "../../hooks/UserContext"; // UserContext 파일 경로에 맞게 수정

const Login = () => {
  const { loginUser, error } = useContext(UserContext);
  // console.log(loginUser);
  // const { userId } = useContext(UserContext);
  // console.log(userId);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    loginUser(email, password);
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

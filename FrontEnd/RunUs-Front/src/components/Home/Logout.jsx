import { useNavigate } from "react-router-dom";
import axios from "axios"
import { logout } from "../../utils/auth";
import "../../styles/Home/Logout.css"

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // 로그아웃 요청을 서버로 보냄
      const response = await axios.post("/api/v1/signout")

      if (response.data.success) {
        // 로그 아웃 성공
        console.log("로그아웃 성공", response.data)
        // 클라이언트 측에서 필요한 로그아웃 후처리
        // ex, 사용자 정보를 로컬 스토리지에서 삭제
        logout()
        // 로그아웃된 홈으로 이동
        navigate("/")
      } else {
        console.error("로그아웃 실패", response.data.message)
      }
    } catch (error) {
      console.error("로그아웃 오류", error)
    }
  }

  return (
    <div
      onClick={handleLogout}
      className="LogoutButton"
    >
      Logout
    </div>
  )
}

export default Logout
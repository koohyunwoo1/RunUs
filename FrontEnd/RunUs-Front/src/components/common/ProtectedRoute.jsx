import { Route, Navigate } from "react-router-dom"
import { isAuthenticated } from "../../utils/auth"

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" />
}

export default ProtectedRoute
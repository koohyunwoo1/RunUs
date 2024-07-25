export const isAuthenticated = () => {
  // 로컬 스토리지에 토큰 저장 여부 확인
  return !!localStorage.getItem('AuthToken');
}

export const logout = () => {
  // 로그아웃 시 로컬 스토리지에서 토큰 제거
  localStorage.removeItem('AuthToken')
}
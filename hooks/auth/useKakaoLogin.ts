export function useKakaoLogin() {
  const handleKakaoLogin = () => {
    window.location.href =
      "https://api.sandoll-sinhan.p-e.kr/oauth2/authorization/kakao";
  };

  return { handleKakaoLogin };
}

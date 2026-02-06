export function useKakaoLogin(redirectUrl: string) {
  const handleKakaoLogin = () => {
    window.location.href = `https://api.olllim.site/oauth2/authorization/kakao?redirect=${redirectUrl}`;
  };

  return { handleKakaoLogin };
}

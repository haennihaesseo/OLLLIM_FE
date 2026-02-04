export function useKakaoLogin(redirectUrl: string) {
  const handleKakaoLogin = () => {
    window.location.href = `https://api.sandoll-sinhan.p-e.kr/oauth2/authorization/kakao?redirect=${redirectUrl}`;
  };

  return { handleKakaoLogin };
}

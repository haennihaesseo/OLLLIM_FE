export function useKakaoLogin(redirectUrl: string) {
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?redirect=${redirectUrl}`;
  };

  return { handleKakaoLogin };
}

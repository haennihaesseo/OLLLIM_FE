import axios from "axios";

//인증이 필요없는 공개 요청 시 사용
export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// //인증이 필요한 요청 시 사용
// export const privateAxios = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

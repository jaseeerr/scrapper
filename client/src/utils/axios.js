import axios from "axios";
import { SERVER_URL } from "../config/url";
import { useNavigate } from "react-router";

const MyAxiosInstance = (opt) => {

//   const goto = useNavigate()

  let token 
  if(opt==1)
  {
    token = localStorage.getItem('adminToken')
  }
  else if(opt==2)
  {
    token = localStorage.getItem('cashierToken')
  }
  else
  {
    token = localStorage.getItem('userToken')
  }
   

   const instance = axios.create({
    baseURL: SERVER_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
  });

   // Response interceptor
//    instance.interceptors.response.use(
//     (response) => {
 
      
//       if(response.data.blocked && localStorage.getItem('userToken'))
//       {
       
//         localStorage.removeItem('userToken')
//         location.href = "/login"
//       }
//       return response;
//     },
//     (error) => {
//       localStorage.removeItem('userToken')
//       console.error("API Error:", error)
//       return Promise.reject(error)
//     }
//   )

  return instance
}

export default MyAxiosInstance;

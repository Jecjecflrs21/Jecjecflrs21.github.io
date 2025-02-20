import axios from "axios";
const URL = process.env.VUE_APP_API_HOST;
const instance = axios.create({
  baseURL: URL,
  withCredentials: false,
});

instance.interceptors.request.use((request) => {
  request.headers.common['Accept'] = 'application/json,text/html';
  request.headers.common["Content-Type"] = "application/json,image/apng";
  request.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  return request;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

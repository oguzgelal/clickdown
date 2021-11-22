import axios from "axios";
import { TOKEN_KEY } from "../common/constants";

const request = (endpoint: string) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;
  return axios({
    url: "/api/request",
    method: "post",
    data: { token, endpoint },
  });
};

export default request;

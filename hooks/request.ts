import axios from "axios";
import { TOKEN_KEY } from "../common/constants";

const request = (endpoint: string) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("token not found");
  }
  return axios({
    url: "/api/request",
    method: "post",
    data: { token, endpoint },
  });
};

export const update = (endpoint: string, data: Record<string, unknown>) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("token not found");
  }
  return axios({
    url: "/api/request",
    method: "post",
    data: { token, data, endpoint, update: true },
  });
};

export default request;

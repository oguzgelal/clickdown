import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosPromise, AxiosResponse } from "axios";

const requestFactory =
  (token: string) =>
  <T>(path: string) => {
    return axios.get<T>(`https://api.clickup.com/api/v2${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, endpoint } = req.body;
  const request = requestFactory(token);

  const response = await request(endpoint);

  res.status(200).json(response.data);
}

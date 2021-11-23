import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosPromise, AxiosResponse } from "axios";

const request = (args: {
  token: string;
  path: string;
  update?: boolean;
  data?: Record<string, unknown>;
}) => {
  return axios(`https://api.clickup.com/api/v2${args.path}`, {
    method: args.update ? "put" : "get",
    data: args.update ? args.data : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: args.token,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, endpoint, data, update } = req.body;

  try {
    const response = await request({ token, path: endpoint, data, update });

    res.status(200).json(response.data);
  } catch (err) {
    console.log("err", err);
    res.status(200).json({ ok: true });
  }
}

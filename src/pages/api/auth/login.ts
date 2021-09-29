import type { NextApiRequest, NextApiResponse } from "next";
import randomString from "crypto-random-string";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const url = new URL("https://github.com/login/oauth/authorize");

  url.searchParams.append("client_id", process.env.GITHUB_CLIENT_ID!);
  url.searchParams.append("redirect_uri", process.env.GITHUB_REDIRECT_URI!);
  url.searchParams.append("state", randomString({ length: 12 }));

  return res.redirect(url.toString());
}

import type { NextApiRequest, NextApiResponse } from "next";
import randomString from "crypto-random-string";
import { getSession } from "lib/auth/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);

  if (session) {
    return res.redirect(`${process.env.NEXT_PUBLIC_PROD_URL}/user/${session.login}`);
  }

  const url = new URL("https://github.com/login/oauth/authorize");

  url.searchParams.append("client_id", process.env.GITHUB_CLIENT_ID!);
  url.searchParams.append("redirect_uri", process.env.GITHUB_REDIRECT_URI!);
  url.searchParams.append("state", randomString({ length: 12 }));

  return res.redirect(url.toString());
}

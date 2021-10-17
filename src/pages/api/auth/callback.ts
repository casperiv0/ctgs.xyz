import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { setCookie, signJWT } from "lib/auth/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;

  if (!code || !state) {
    return res.status(400).send("Invalid Code");
  }

  const url = new URL("https://github.com/login/oauth/access_token");

  url.searchParams.append("client_id", process.env.GITHUB_CLIENT_ID!);
  url.searchParams.append("client_secret", process.env.GITHUB_CLIENT_SECRET!);
  url.searchParams.append("redirect_uri", process.env.GITHUB_REDIRECT_URI!);
  url.searchParams.append("code", code);
  url.searchParams.append("state", state);

  const accessTokenRes = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const accessTokenData = await accessTokenRes.json();

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessTokenData.access_token}`,
    },
  });
  const userData = await userRes.json();

  if (!userData.login) {
    // todo: return to /error?error="error message here"
    return res.status(400).send("Invalid Data Received");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      login: userData.login,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        login: userData.login,
        avatarUrl: userData.avatar_url ?? null,
        name: userData.name ?? null,
      },
    });
  } else {
    dbUser = await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        avatarUrl: userData.avatar_url ?? dbUser.avatarUrl ?? null,
        name: userData.name ?? dbUser.avatarUrl ?? null,
      },
    });
  }

  if (dbUser.banned) {
    return res.status(403).send("User is banned.");
  }

  // cookie expires after 24 hours
  const expires = 60 * 60 * 1000 * 24;
  const token = signJWT(dbUser.id, expires);
  await setCookie({ res, expires, value: token, name: "ctgs.xyz-session" });

  return res.redirect(`${process.env.NEXT_PUBLIC_PROD_URL}?login=true`);
}

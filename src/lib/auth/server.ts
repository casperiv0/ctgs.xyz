import type { NextApiRequest, NextApiResponse } from "next";
import { CookieSerializeOptions, serialize, parse } from "cookie";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const jwtSecret = String(process.env.JWT_SECRET);

interface SetCookieOptions {
  res: NextApiResponse;
  value: string;
  expires: number;
  name: string;
}

export async function setCookie(opts: SetCookieOptions) {
  const stringValue =
    typeof opts.value === "object" ? `j:${JSON.stringify(opts.value)}` : String(opts.value);

  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + opts.expires),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  };

  opts.res.setHeader("Set-Cookie", serialize(opts.name, String(stringValue), options));
}

export function signJWT(userId: string, expires: number) {
  return jwt.sign(
    {
      userId,
    },
    jwtSecret,
    { expiresIn: expires },
  );
}

export async function getSession(req: NextApiRequest | Pick<NextApiRequest, "headers">) {
  const cookie = _parseCookie(req.headers.cookie ?? "");
  const userId = cookie && parseJWT(cookie);

  if (!cookie || !userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

function _parseCookie(cookieHeader: string) {
  return parse(cookieHeader)["ctgs.xyz-session"];
}

function parseJWT(jwtString: string) {
  try {
    const userId = jwt.verify(jwtString, jwtSecret);
    return typeof userId === "string" ? userId : userId.userId;
  } catch {
    return null;
  }
}

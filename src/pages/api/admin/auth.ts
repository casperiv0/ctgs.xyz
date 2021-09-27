import { NextApiRequest, NextApiResponse } from "next";
import { CookieSerializeOptions, serialize } from "cookie";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  if (process.env.ADMIN_KEY !== req.body.authKey) {
    return res.status(403).send("Forbidden");
  }

  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  };

  const token = jwt.sign("ADMIN", process.env.JWT_SECRET!);

  res.setHeader("Set-Cookie", serialize("ctgs.xyz-admin", String(token), options));

  return res.status(200).send("OK");
}

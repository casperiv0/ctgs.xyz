import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize("ctgs.xyz-session", "", {
      maxAge: -1,
      path: "/",
    }),
  );

  return res.status(200).send("OK");
}

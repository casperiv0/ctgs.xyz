import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, isAdmin } from "lib/auth/server";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const method = req.method as keyof typeof handlers;
  const id = req.query.id as string;

  if (!session || !isAdmin(session)) {
    return res.status(403).send("Forbidden");
  }

  const handlers = {
    DELETE: async () => {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user || user.id === session.id) {
        return res.status(400).send("Cannot ban admins.");
      }

      await prisma.url.deleteMany({
        where: {
          userId: id,
        },
      });

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          banned: true,
        },
      });

      return res.status(200).send("OK");
    },
  };

  const handler = handlers[method];
  if (handler) {
    return handler();
  }

  return res.status(405).send("Method not allowed");
}

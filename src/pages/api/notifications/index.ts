import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "lib/auth/server";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const method = req.method as keyof typeof handlers;

  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const handlers = {
    GET: async () => {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: session.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 30,
      });

      // todo: infinite scroll
      return res.json({ notifications });
    },
  };

  const handler = handlers[method];
  if (handler) {
    return handler();
  }

  return res.status(405).send("Method not allowed");
}

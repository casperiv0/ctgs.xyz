import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth/server";
import { validateSchema } from "@casper124578/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const method = req.method as keyof typeof handlers;

  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      login: session.login,
    },
  });

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const handlers = {
    GET: async () => {
      const urls = await prisma.url.findMany({
        where: {
          userId: user.id,
        },
      });

      return res.json({ user, urls });
    },
    PUT: async () => {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const schema = {
        name: yup.string().required().min(2).max(255),
        isPublic: yup.boolean(),
      };

      if (user.login !== session!.login) {
        return res.status(401).send("Unauthorized");
      }

      const [error] = await validateSchema(schema, body);

      if (error) {
        return res.status(400).send(error.message);
      }

      const updated = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: body.name,
          isPublic: body.isPublic,
        },
      });

      return res.json({ user: updated });
    },
  };

  const handler = handlers[method];
  await handler();
}

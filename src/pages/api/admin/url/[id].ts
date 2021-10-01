import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, isAdmin } from "lib/auth/server";
import { prisma } from "lib/prisma";
import { parseBody } from "lib/utils";
import { validateSchema } from "@casper124578/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const method = req.method as keyof typeof handlers;
  const id = req.query.id as string;

  if (!isAdmin(session)) {
    return res.status(403).send("Forbidden");
  }

  const url = await prisma.url.findUnique({
    where: {
      id,
    },
  });

  if (!url) {
    return res.status(404).send("Not Found");
  }

  const handlers = {
    PUT: async () => {
      const schema = {
        userId: yup.string().nullable(),
        slug: yup.string().required().max(255),
        url: yup.string().required().url(),
      };

      const body = parseBody(req);
      const [error] = await validateSchema(schema, body);

      if (error) {
        return res.status(400).send(error.message);
      }

      const updated = await prisma.url.update({
        where: {
          id: url.id,
        },
        data: {
          slug: body.slug,
          url: body.url,
          userId: body.userId,
        },
        include: {
          user: true,
        },
      });

      return res.json({
        updated,
      });
    },
    DELETE: async () => {
      await prisma.url.delete({
        where: {
          id,
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

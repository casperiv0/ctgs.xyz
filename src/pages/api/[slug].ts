import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth/server";
import { validateUrlBody } from "lib/validateUrlBody";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method as keyof typeof handlers;

  const handlers = {
    GET: async () => {
      const slug = req.query.slug as string;

      let data = await prisma.url.findUnique({
        where: {
          slug,
        },
      });

      if (!data) {
        return res.status(400).send("Not Found");
      }

      data = await prisma.url.update({
        where: {
          id: data.id,
        },
        data: {
          clicks: { increment: 1 },
        },
      });

      return res.json(data);
    },
    // slug is the url id for this method.
    DELETE: async () => {
      const session = await getSession(req);
      if (!session) {
        return res.status(401).send("Unauthorized");
      }

      const url = await prisma.url.findUnique({
        where: {
          id: req.query.slug as string,
        },
      });

      if (!url) {
        return res.status(404).send("Not Found");
      }

      if (url.userId !== session.id) {
        return res.status(403).send("Forbidden");
      }

      await prisma.url.delete({
        where: {
          id: url.id,
        },
      });

      return res.send("OK");
    },
    PUT: async () => {
      const session = await getSession(req);
      if (!session) {
        return res.status(401).send("Unauthorized");
      }

      const url = await prisma.url.findUnique({
        where: {
          id: req.query.slug as string,
        },
      });

      if (!url) {
        return res.status(404).send("Not Found");
      }

      if (url.userId !== session.id) {
        return res.status(403).send("Forbidden");
      }

      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { status, error, slugified } = await validateUrlBody(body, url);

      if (error) {
        return res.status(status).send(error);
      }

      const updated = await prisma.url.update({
        where: {
          id: url.id,
        },
        data: {
          slug: slugified,
          url: body.url,
        },
      });

      return res.json({ updated });
    },
  };

  const handler = handlers[method];
  if (handler) {
    return handler();
  }

  return res.status(405).send("Method not allowed");
}

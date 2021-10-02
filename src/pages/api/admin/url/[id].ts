import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, isAdmin } from "lib/auth/server";
import { prisma } from "lib/prisma";
import { parseBody } from "lib/utils";
import { validateSchema } from "@casper124578/utils";
import { Url } from ".prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const method = req.method as keyof typeof handlers;
  const id = req.query.id as string;

  if (!session || !isAdmin(session)) {
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
        reason: yup.string().required(),
        slug: yup.string().required().max(255),
        url: yup.string().required().url(),
      };

      const body = parseBody(req);
      const [error] = await validateSchema(schema, body);

      if (error) {
        return res.status(400).send(error.message);
      }

      if (url.userId) {
        const reason = getUpdateMessage(body, url);

        await prisma.notification.create({
          data: {
            title: "URL Updated.",
            description: reason,
            executorId: session.id,
            userId: url.userId,
          },
        });
      }

      if (url.userId !== body.userId && body.userId) {
        const error =
          body.userId === session.id
            ? `URL (${url.slug}) was moved to this account.`
            : `URL (${url.slug}) was moved to a different account.`;

        await prisma.notification.create({
          data: {
            title: "URL Moved.",
            description: error,
            executorId: session.id,
            userId: body.userId,
          },
        });
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

      if (url.userId) {
        // todo: finalize this
        await prisma.notification.create({
          data: {
            title: "URL Deleted.",
            description: `${url.slug} was deleted for breaking the Terms of Service.`,
            executorId: session.id,
            userId: url.userId,
          },
        });
      }

      return res.status(200).send("OK");
    },
  };

  const handler = handlers[method];
  if (handler) {
    return handler();
  }

  return res.status(405).send("Method not allowed");
}

function getUpdateMessage(body: Url, url: Url) {
  if (body.url !== url.url) {
    return `URL was updated from "${url.url}" to "${body.url}".`;
  }

  if (body.slug !== url.slug) {
    return `Slug was updated from "${url.slug}" to "${body.slug}".`;
  }

  if (body.userId !== url.userId) {
    if (body.userId === null) {
      return `URL (${url.slug}) was removed from your account. It still can be used.`;
    }

    return `URL (${url.slug}) was moved to a different account.`;
  }

  return `An unknown change was made to ${url.slug} (${url.url}).`;
}

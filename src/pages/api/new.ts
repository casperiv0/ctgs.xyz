import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateSchema } from "@casper124578/utils";
import slugify from "slugify";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const schema = {
    slug: yup.string().required().max(255),
    url: yup.string().required().url(),
  };

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const session = await getSession(req);

  const [error] = await validateSchema(schema, body);

  if (error) {
    return res.status(400).send(error.message);
  }

  if (body.url.includes(process.env.NEXT_PUBLIC_PROD_URL)) {
    return res.status(400).send("Cannot use this URL");
  }

  const slugified = slugify(body.slug, {
    replacement: "-",
    lower: true,
    remove: /[*./]/,
  });

  const existing = await prisma.url.findUnique({
    where: {
      slug: slugified,
    },
  });

  if (existing) {
    return res.status(400).send("URL with that slug already exists.");
  }

  const data = await prisma.url.create({
    data: {
      slug: slugified,
      url: body.url,
      userId: session?.id,
    },
  });

  return res.status(201).json(data);
}

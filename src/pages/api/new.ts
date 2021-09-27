import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { validateSchema } from "@casper124578/utils";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const schema = {
    slug: yup.string().required().max(255),
    url: yup.string().required().url(),
  };

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const [error] = await validateSchema(schema, body);

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  const data = await prisma.url.create({
    data: {
      slug: body.slug,
      url: body.url,
    },
  });

  return res.status(201).json(data);
}

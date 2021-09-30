import * as yup from "yup";
import slugify from "slugify";
import type { Url } from ".prisma/client";
import { validateSchema } from "@casper124578/utils";
import { prisma } from "./prisma";

export async function validateUrlBody(body: any, previous?: Url) {
  const schema = {
    slug: yup.string().required().max(255),
    url: yup.string().required().url(),
  };

  const [error] = await validateSchema(schema, body);

  if (error) {
    return { status: 400, error: error.message };
  }

  if (body.url.includes(process.env.NEXT_PUBLIC_PROD_URL)) {
    return { status: 400, error: "Cannot use this URL" };
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

  if (existing && previous?.slug !== slugified) {
    return { status: 400, error: "URL with that slug already exists." };
  }

  return { status: 200, slugified };
}

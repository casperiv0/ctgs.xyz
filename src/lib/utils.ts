import randomString from "crypto-random-string";
import type { NextApiRequest } from "next";

export function handleCopy(
  result: string | null,
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
) {
  if (!result) return;
  const element = e.currentTarget;

  navigator.clipboard.writeText(result);
  element.innerText = "Copied!";

  setTimeout(() => {
    element.innerText = "Copy";
  }, 1_000);
}

export function handleGenerate(inputElement: HTMLInputElement, handleChange: any) {
  const randomSlug = randomString({ length: 8 });

  handleChange({ target: { name: "slug", value: randomSlug } });
  inputElement.value = randomSlug;
}

export function parseBody<T = any>(req: Pick<NextApiRequest, "body">): T {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
}

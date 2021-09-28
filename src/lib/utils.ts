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

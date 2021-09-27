import { THEME_SCRIPT } from "lib/theme";
import type { AppProps } from "next/app";
import Script from "next/script";
import "styles/global.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script strategy="lazyOnload">{THEME_SCRIPT}</Script>
      <Component {...pageProps} />
    </>
  );
}

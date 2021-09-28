import * as React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getThemeFromLocal, updateBodyClass } from "lib/theme";
import { Button } from "components/Button";

interface Props {
  data: string;
}

export default function Slug({ data }: Props) {
  React.useEffect(() => {
    updateBodyClass(getThemeFromLocal());
  }, []);

  return (
    <>
      <Head>
        <title>404 - Not found</title>
        <meta name="description" content="Whoops! The slug was not found" />
      </Head>

      <main className="bg-gray-50 dark:bg-dark-gray text-black dark:text-gray-300 h-screen flex flex-col justify-center items-center">
        <p className="text-4xl">{data}</p>
        <Button className="mt-4">
          <Link href="/">
            <a>Return to home</a>
          </Link>
        </Button>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = encodeURIComponent(ctx.query.slug as string);
  const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/${slug}`;

  const res = await fetch(url).then((r) => {
    return r.ok ? r.json() : r.text();
  });

  // url was found
  if (res.slug && res.id) {
    return {
      redirect: {
        destination: res.url,
        permanent: true,
      },
    };
  }

  return {
    props: {
      data: res.error || res,
    },
  };
};

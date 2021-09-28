import * as React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

interface Props {
  data: string;
}

export default function Slug({ data }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300 h-screen flex flex-col justify-center items-center">
      <Head>
        <title>404 - Not found</title>
        <meta name="description" content="Whoops! The slug was not found" />
      </Head>

      <p className="text-4xl">{data}</p>
      <Link href="/">
        <a className="mt-8 p-2 px-4 bg-gray-600 text-white rounded-md dark:hover:ring-2 dark:hover:ring-white transition-all">
          Return to home
        </a>
      </Link>
    </div>
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

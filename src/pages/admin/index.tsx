import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import type { User } from ".prisma/client";
import { getSession } from "lib/auth/server";
import { Table, UrlWithUser } from "components/admin/Table";

interface Props {
  urls: UrlWithUser[];
  users: User[];
  error: string | null;
}

export default function Admin({ users, urls, error }: Props) {
  const router = useRouter();

  React.useEffect(() => {
    if (error && error === "Forbidden") {
      router.push("/404");
    }
  }, [error, router]);

  if (error) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin area - ctgs.xyz</title>
      </Head>
      <main className="bg-gray-50 dark:bg-dark-gray text-black dark:text-gray-300 h-screen pt-24 px-5">
        <Table users={users} urls={urls} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/admin`;

  const data = await fetch(url, {
    headers: req.headers as HeadersInit,
  }).then((r) => {
    return r.ok ? r.json() : r.text();
  });

  return {
    props: {
      error: typeof data === "string" ? data : null,
      session: await getSession(req),
      urls: data.urls ?? [],
      users: data.users ?? [],
    },
  };
};

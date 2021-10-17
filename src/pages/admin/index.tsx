import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import type { User } from ".prisma/client";
import { getSession } from "lib/auth/server";
import { Table, UrlWithUser } from "components/admin/Table";
import { Layout } from "components/Layout";
import { UserTable } from "components/admin/UserTable";
import { Button } from "components/Button";

interface Props {
  urls: UrlWithUser[];
  users: User[];
  error: string | null;
}

const enum Tab {
  Urls,
  Users,
}

export default function Admin({ users, urls, error }: Props) {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>(Tab.Urls);

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
      <Layout>
        <div className="space-x-2">
          <Button onClick={() => setTab(Tab.Urls)}>Urls</Button>
          <Button onClick={() => setTab(Tab.Users)}>Users</Button>
        </div>
        {tab === Tab.Urls ? <Table users={users} urls={urls} /> : <UserTable users={users} />}
      </Layout>
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

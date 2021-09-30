import * as React from "react";
import type { Url, User } from ".prisma/client";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { getSession } from "lib/auth/server";
import { Table } from "components/Table";
import { UserSettings } from "components/modals/UserSettings";
import { useSession } from "lib/auth/client";
import { Button } from "components/Button";

interface Props {
  user: User | null;
  urls: Url[];
  error: string | null;
}

const errors = {
  "Not Found": "The profile you're looking for was not found",
  "Profile Not Public":
    "This profile is set to private. You cannot view this user's urls. You are able to use them.",
};

export default function UserPage({ user, urls, error }: Props) {
  const [showSettings, setSettings] = React.useState(false);
  const router = useRouter();
  const session = useSession();

  const showActions = user?.id === session.user?.id;
  const pageUser = showActions ? session.user : user;

  React.useEffect(() => {
    if (!error && !user) {
      router.push("/404");
    }
  }, [error, user, router]);

  return (
    <main className="bg-gray-50 dark:bg-dark-gray text-black dark:text-gray-300 h-screen pt-24 px-5">
      {!pageUser ? (
        <>
          <Head>
            <title>ctgs.xyz</title>
          </Head>
          <div className="flex font-bold items-center justify-center">
            <p className="text-center max-w-lg">{error}</p>
          </div>
        </>
      ) : (
        <>
          <Head>
            <title>{pageUser.name || pageUser.login} Profile - ctgs.xyz</title>
          </Head>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {pageUser.avatarUrl ? (
                <a
                  className="mr-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ height: 45 }}
                  href={`https://github.com/${pageUser.login}`}
                >
                  <Image className="rounded-full" src={pageUser.avatarUrl} width={45} height={45} />
                </a>
              ) : null}
              <h1 className="font-bold text-3xl">{pageUser.name || pageUser.login}</h1>
            </div>

            {showActions ? <Button onClick={() => setSettings(true)}>Settings</Button> : null}
          </div>

          {urls.length <= 0 ? (
            <p className="mt-3">
              {showActions ? "You don't have any urls." : "This user doesn't have any urls."}
            </p>
          ) : (
            <Table showActions={showActions} urls={urls} />
          )}
          <UserSettings isOpen={showSettings} onClose={() => setSettings(false)} />
        </>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, query }) => {
  const session = await getSession(req);

  const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/user/${query.user}`;
  const res = await fetch(url, {
    // @ts-expect-error ignore error below
    headers: new Headers(req.headers),
  });
  const data = await (res.ok ? res.json() : res.text());

  return {
    props: {
      session,
      error: errors[data as keyof typeof errors] ?? null,
      user: data.user ?? null,
      urls: data.urls ?? [],
    },
  };
};

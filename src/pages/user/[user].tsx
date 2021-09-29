import * as React from "react";
import type { Url, User } from ".prisma/client";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { getSession } from "lib/auth/server";
import { Table } from "components/Table";

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
  const router = useRouter();

  React.useEffect(() => {
    if (!error && !user) {
      router.push("/404");
    }
  }, [error, user, router]);

  return (
    <main className="bg-gray-50 dark:bg-dark-gray text-black dark:text-gray-300 h-screen pt-20 px-5">
      {!user ? (
        <div className="flex font-bold items-center justify-center">
          <p className="text-center max-w-lg">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            {user.avatarUrl ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: 45 }}
                href={`https://github.com/${user.login}`}
              >
                <Image className="rounded-full" src={user.avatarUrl} width={45} height={45} />
              </a>
            ) : null}
            <h1 className="ml-3 font-bold text-3xl">{user.name || user.login}</h1>
          </div>

          <Table urls={urls} userId={user.id} />
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

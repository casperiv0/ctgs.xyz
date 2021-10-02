import * as React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import Link from "next/link";

import { Loader } from "components/Loader";
import { Button } from "components/Button";

import { handleCopy } from "lib/utils";
import { validate } from "lib/validate";
import { getSession } from "lib/auth/server";
import { UrlFields } from "components/UrlForm";
import { useSession } from "lib/auth/client";
import { Layout } from "components/Layout";

const INITIAL_VALUES = {
  url: "",
  slug: "",
};

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  async function onSubmit(
    data: typeof INITIAL_VALUES,
    helpers: FormikHelpers<typeof INITIAL_VALUES>,
  ) {
    setResult(null);
    setError(null);

    try {
      setLoading(true);
      const res = await fetch("/api/new", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json: Record<string, string> | string = await (res.ok ? res.json() : res.text());

      if (typeof json === "string") {
        console.error(json);
        setError(json);
      } else if (typeof json === "object") {
        const url = `https://ctgs.xyz/${json.slug}`;
        setResult(url);

        helpers.resetForm();
      }

      setLoading(false);
    } catch (e: any) {
      console.error(e);

      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <Layout className="flex items-center justify-center w-screen">
      <Head>
        <title>ctgs.xyz</title>

        <meta name="twitter:title" content="ctgs.xyz" />
        <meta property="og:site_name" content="ctgs.xyz" />
        <meta property="og:title" content="ctgs.xyz" />

        <meta name="description" content="Create a shortened URL." />
        <meta property="og:description" content="Create a shortened URL." />
        <meta name="twitter:description" content="Create a shortened URL." />

        <link rel="canonical" href="https://ctgs.xyz" />
        <meta property="og:url" content="https://ctgs.xyz" />
      </Head>

      <div className="w-screen px-5 max-w-3xl xl:w-3/6 xl:px-0">
        {router.query.fromGa ? (
          <Info>
            <span className="font-semibold">ctgs.ga</span> has moved to{" "}
            <span className="font-semibold">ctgs.xyz</span>!
          </Info>
        ) : null}

        {router.query.login && session.user ? (
          <Info>
            Successfully logged in as{" "}
            <Link href={`/user/${session.user.login}`}>
              <a className="underline">
                <span className="font-semibold">{session.user.login}</span>
              </a>
            </Link>
          </Info>
        ) : null}

        <h1 className="text-xl sm:text-2xl md:text-3xl mb-3 font-semibold">Shorten your URL!</h1>

        <Formik validate={validate} onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isValid }) => (
            <form onSubmit={handleSubmit}>
              {error ? (
                <div className="bg-red-500 text-white p-2 px-3 font-semibold rounded-md my-2">
                  {error}
                </div>
              ) : null}

              <UrlFields
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={values}
                errors={errors}
                touched={touched}
              />

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">Shortened URL: </span>
                  {result ? (
                    <>
                      <a
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={result}
                      >
                        {result}
                      </a>
                      <Button
                        type="button"
                        small
                        className="ml-2 text-sm"
                        onClick={(e) => handleCopy(result, e)}
                      >
                        Copy
                      </Button>
                    </>
                  ) : null}
                </div>

                <Button type="submit" disabled={loading || !isValid}>
                  {loading ? <Loader /> : "Shorten!"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      session: await getSession(req),
    },
  };
};

const Info = ({ children }: { children: React.ReactFragment }) => {
  return (
    <div className="text-lg bg-gray-300 dark:bg-gray-700 my-5 rounded-md p-2 px-3">{children}</div>
  );
};

import * as React from "react";
import type { Url } from ".prisma/client";
import { useSession } from "lib/auth/client";

interface Props {
  userId: string;
  urls: Url[];
}

export const Table = ({ userId, urls }: Props) => {
  const session = useSession();

  const showActions = userId === session.user?.id;

  return (
    <table className="border-collapse w-full mt-5">
      <thead>
        <tr>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Slug
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            URL
          </th>
          {showActions ? (
            <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
              Actions
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {urls.map((url, idx) => {
          const isOdd = idx % 2 !== 0;

          return (
            <tr className="table-row text-left" key={url.id}>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                <a className="underline" href={`https://ctgs.xyz/${url.slug}`}>
                  {url.slug}
                </a>
              </td>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                <a className="underline" href={url.url}>
                  {url.url}
                </a>
              </td>

              {showActions ? (
                <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                  <button className="underline">Edit</button>
                  <button className="underline text-red-600 ml-2">Delete</button>
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

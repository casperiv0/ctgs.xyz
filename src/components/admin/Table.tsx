import * as React from "react";
import Image from "next/image";
import type { Url, User } from ".prisma/client";
import { AlertModal } from "components/modals/Alert";
import { Button } from "components/Button";
import { EditUrlModal } from "components/admin/EditUrlModal";

export type UrlWithUser = Url & { user: User | null };
interface Props {
  urls: UrlWithUser[];
  users: User[];
}

enum Modals {
  DELETE,
  EDIT,
}

export const Table = ({ users, ...rest }: Props) => {
  const [urls, setUrls] = React.useState(rest.urls);
  const [showModal, setModal] = React.useState<Modals | null>(null);
  const [tempUrl, setTempUrl] = React.useState<UrlWithUser | null>(null);

  const [isDeleting, setDeleting] = React.useState(false);

  function handleUpdate(prevUrl: UrlWithUser, newUrl: UrlWithUser) {
    setUrls((prev) => {
      const indexOf = prev.indexOf(prevUrl);
      prev[indexOf] = newUrl;

      return prev;
    });
  }

  async function handleDelete() {
    if (!tempUrl || showModal !== Modals.DELETE) return;

    try {
      setDeleting(true);
      const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/admin/url/${tempUrl.id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });
      const data = await res.text();

      console.log(data);

      if (data === "OK") {
        setUrls((prev) => prev.filter((v) => v.id !== tempUrl.id));
        setTempUrl(null);
        setModal(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setDeleting(false);
    }
  }

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
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Clicks
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            User
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Actions
          </th>
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
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>{url.clicks}</td>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                {url.user ? (
                  <div className="flex items-center">
                    {url.user.avatarUrl ? (
                      <Image
                        className="rounded-full"
                        width={30}
                        height={30}
                        src={url.user.avatarUrl}
                      />
                    ) : null}

                    <p className={`${url.user.avatarUrl && "ml-2"}`}>{url.user.login}</p>
                  </div>
                ) : (
                  <p>None</p>
                )}
              </td>

              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                <button
                  onClick={() => {
                    setTempUrl(url);
                    setModal(Modals.EDIT);
                  }}
                  className="underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setTempUrl(url);
                    setModal(Modals.DELETE);
                  }}
                  className="underline text-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>

      <EditUrlModal
        isOpen={showModal === Modals.EDIT}
        onClose={() => setModal(null)}
        onSuccess={handleUpdate}
        url={tempUrl}
        users={users}
      />

      <AlertModal
        onClose={() => setModal(null)}
        isOpen={showModal === Modals.DELETE}
        title="Delete shortened url"
      >
        <p className="py-3 dark:text-white">
          Are you sure you want to delete this shortened url? This cannot be undone
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Button onClick={() => setModal(null)}>No, do not delete.</Button>
          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-500 dark:bg-red-500"
          >
            Yes, delete shortened url.
          </Button>
        </div>
      </AlertModal>
    </table>
  );
};

import * as React from "react";
import type { Url } from ".prisma/client";
import { AlertModal } from "./modals/Alert";
import { Button } from "./Button";
import { EditUrlModal } from "./modals/EditUrl";

interface Props {
  showActions: boolean;
  urls: Url[];
}

enum Modals {
  DELETE,
  EDIT,
}

export const Table = ({ showActions, ...rest }: Props) => {
  const [urls, setUrls] = React.useState(rest.urls);
  const [showModal, setModal] = React.useState<Modals | null>(null);
  const [tempUrl, setTempUrl] = React.useState<Url | null>(null);

  function handleUpdate(prevUrl: Url, newUrl: Url) {
    setUrls((prev) => {
      const indexOf = prev.indexOf(prevUrl);
      prev[indexOf] = newUrl;

      return prev;
    });
  }

  async function handleDelete() {
    if (!tempUrl || showModal !== Modals.DELETE) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/${tempUrl.id}`;
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
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>{url.clicks}</td>

              {showActions ? (
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
              ) : null}
            </tr>
          );
        })}
      </tbody>

      <EditUrlModal
        isOpen={showModal === Modals.EDIT}
        onClose={() => setModal(null)}
        onSuccess={handleUpdate}
        url={tempUrl}
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
          <Button onClick={handleDelete} className="bg-red-500 dark:bg-red-500">
            Yes, delete shortened url.
          </Button>
        </div>
      </AlertModal>
    </table>
  );
};

import * as React from "react";
import Image from "next/image";
import type { User } from ".prisma/client";
import { AlertModal } from "components/modals/Alert";
import { Button } from "components/Button";

interface Props {
  users: User[];
}

enum Modals {
  DELETE,
  EDIT,
}

export const UserTable = (props: Props) => {
  const [users, setUsers] = React.useState(props.users);
  const [showModal, setModal] = React.useState<Modals | null>(null);
  const [tempUser, setTempUser] = React.useState<User | null>(null);

  const [isBanning, setBanning] = React.useState(false);

  async function handleDelete() {
    if (!tempUser || showModal !== Modals.DELETE) return;

    try {
      setBanning(true);
      const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/admin/user/${tempUser.id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });
      const data = await res.text();

      console.log(data);

      if (data === "OK") {
        setUsers((prev) => prev.filter((v) => v.id !== tempUser.id));
        setTempUser(null);
        setModal(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setBanning(false);
    }
  }

  return (
    <table className="border-collapse w-full mt-5">
      <thead>
        <tr>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Avatar
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Login
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Name
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Created At
          </th>
          <th className="p-2 px-3 font-semibold bg-gray-200 dark:bg-black lg:table-cell text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => {
          const isOdd = idx % 2 !== 0;

          return (
            <tr className="table-row text-left" key={user.id}>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                <Image className="rounded-full" width={30} height={30} src={user.avatarUrl!} />
              </td>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>{user.login}</td>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>{user.name}</td>
              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                {user.createdAt}
              </td>

              <td className={`p-2 px-3 ${isOdd && "bg-gray-100 dark:bg-black"}`}>
                <button
                  onClick={() => {
                    setTempUser(user);
                    setModal(Modals.DELETE);
                  }}
                  className="underline text-red-600 ml-2"
                >
                  Ban User
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>

      {/* <EditUrlModal
        isOpen={showModal === Modals.EDIT}
        onClose={() => setModal(null)}
        onSuccess={handleUpdate}
        url={tempUrl}
        users={users}
      /> */}

      <AlertModal
        onClose={() => setModal(null)}
        isOpen={showModal === Modals.DELETE}
        title="Ban User"
      >
        <p className="py-3 dark:text-white">
          Are you sure you want to ban this user? This cannot be undone.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Button onClick={() => setModal(null)}>No, do not.</Button>
          <Button
            disabled={isBanning}
            onClick={handleDelete}
            className="bg-red-500 dark:bg-red-500"
          >
            Yes, ban this user.
          </Button>
        </div>
      </AlertModal>
    </table>
  );
};

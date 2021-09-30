import * as React from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";

import { Modal, ModalProps } from "components/Modal";
import { FormField } from "components/FormField";
import { Input } from "components/Input";
import { deleteAccount, logout, useSession } from "lib/auth/client";
import { User } from ".prisma/client";
import { Toggle } from "components/Toggle";
import { Button } from "components/Button";
import { AlertModal } from "./Alert";

export const UserSettings = ({ isOpen, onClose }: Pick<ModalProps, "isOpen" | "onClose">) => {
  const [showDeleteAlert, setDeleteAlert] = React.useState(false);

  const { user, setUser } = useSession();
  const router = useRouter();

  if (!user) {
    return null;
  }

  async function handleLogout() {
    const ok = await logout();
    ok && setUser(null);
  }

  async function handleDelete() {
    const ok = await deleteAccount();

    if (ok) {
      setUser(null);
      router.push("/");
    }
  }

  async function onSubmit(data: Pick<User, "isPublic" | "name">) {
    try {
      const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth`;
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const json = res.ok && (await res.json());

      setUser({ ...user, ...json.user });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="p-4">
        <h1 className="text-3xl dark:text-white font-bold">Settings</h1>

        <Formik
          onSubmit={onSubmit}
          initialValues={{
            name: user.name ?? "",
            isPublic: user.isPublic,
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <form onSubmit={handleSubmit} className="mt-5">
              <FormField fieldId="name" label="Name">
                <Input id="name" value={values.name} onChange={handleChange} name="name" />
              </FormField>

              <FormField label="Public Account">
                <Toggle toggled={values.isPublic} name="isPublic" onClick={handleChange} />
              </FormField>

              <Button className="mt-3" type="submit">
                Save Settings
              </Button>
            </form>
          )}
        </Formik>

        <div className="mt-3">
          <h3 className="font-semibold text-xl dark:text-white mb-2">Danger zone</h3>

          <ul className="space-x-2">
            <Button onClick={() => setDeleteAlert(true)} className="bg-red-500 dark:bg-red-500">
              Delete Account
            </Button>
            <Button onClick={handleLogout} className="bg-red-500 dark:bg-red-500">
              Logout
            </Button>
          </ul>
        </div>
      </div>

      <AlertModal
        onClose={() => setDeleteAlert(false)}
        isOpen={showDeleteAlert}
        title="Delete Account"
      >
        <p className="py-3 dark:text-white">
          Are you sure you want to delete your account? This will delete all your data.{" "}
          <strong>This action cannot be undone.</strong>
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Button onClick={() => setDeleteAlert(false)}>No, do not delete.</Button>
          <Button onClick={handleDelete} className="bg-red-500 dark:bg-red-500">
            Yes, delete my account.
          </Button>
        </div>
      </AlertModal>
    </Modal>
  );
};

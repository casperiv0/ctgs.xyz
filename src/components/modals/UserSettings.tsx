import { Formik } from "formik";

import { Modal, ModalProps } from "components/Modal";
import { FormField } from "components/FormField";
import { Input } from "components/Input";
import { useSession } from "lib/auth/client";
import { User } from ".prisma/client";
import { Toggle } from "components/Toggle";
import { Button } from "components/Button";

export const UserSettings = ({ isOpen, onClose }: Pick<ModalProps, "isOpen" | "onClose">) => {
  const { user, setUser } = useSession();

  if (!user) {
    return null;
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
      console.log(e);
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
      </div>
    </Modal>
  );
};

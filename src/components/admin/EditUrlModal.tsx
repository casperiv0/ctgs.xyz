import * as React from "react";
import { Formik } from "formik";
import { InfoCircle } from "react-bootstrap-icons";
import type { Url, User } from ".prisma/client";
import type { UrlWithUser } from "./Table";

import { Modal, ModalProps } from "components/Modal";
import { useSession } from "lib/auth/client";
import { Button } from "components/Button";
import { validate } from "lib/validate";
import { UrlFields } from "components/UrlForm";
import { FormField } from "components/FormField";
import { Select } from "components/Select";

interface Props extends Pick<ModalProps, "isOpen" | "onClose"> {
  url: UrlWithUser | null;
  users: User[];
  onSuccess: (prevUrl: UrlWithUser, newUrl: UrlWithUser) => void;
}

export const EditUrlModal = ({ url, isOpen, users, onSuccess, onClose }: Props) => {
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useSession();

  React.useEffect(() => {
    setError(null);
  }, [isOpen]);

  if (!user || !url) {
    return null;
  }

  async function onSubmit(data: Pick<Url, "slug" | "url">) {
    if (!url) return;
    try {
      const fetchUrl = `${process.env.NEXT_PUBLIC_PROD_URL}/api/admin/url/${url.id}`;
      const res = await fetch(fetchUrl, {
        method: "PUT",
        body: JSON.stringify({ ...data, reason: "test" }),
      });

      const json = (await (res.ok ? res.json() : res.text())) as string | Record<string, any>;

      if (typeof json === "object") {
        console.log(json.updated);
        json.updated && onSuccess(url, json.updated);
      } else {
        setError(json);
      }
    } catch (e: any) {
      setError(e.message || "An error occurred.");
      console.error(e);
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="p-4">
        <h1 className="text-3xl dark:text-white font-bold">Edit URL</h1>

        <p className="mt-3 dark:bg-[#111111] bg-gray-300 dark:text-white flex items-center p-2 px-3 rounded-md">
          <InfoCircle className="mr-2" width={20} height={20} />
          Users will be notified when changes are made to their connected urls.
        </p>

        <Formik
          validate={validate}
          onSubmit={onSubmit}
          initialValues={{
            url: url.url,
            slug: url.slug,
            userId: url.userId,
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            handleReset,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <form className="mt-3" onSubmit={handleSubmit}>
              {error ? (
                <div className="bg-red-500 text-white p-2 px-3 font-semibold rounded-md my-3">
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

              <FormField fieldId="userId" label="User">
                <Select
                  clearable
                  name="userId"
                  onChange={handleChange}
                  value={values.userId!}
                  items={users.map((user) => ({
                    label: `${user.login} (${user.name})`,
                    value: user.id,
                  }))}
                />
              </FormField>

              <Button type="submit" disabled={!isValid}>
                Save URL
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="ml-2 bg-transparent dark:bg-transparent"
              >
                Cancel
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

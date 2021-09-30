import * as React from "react";
import { Formik } from "formik";
import type { Url } from ".prisma/client";

import { Modal, ModalProps } from "components/Modal";
import { useSession } from "lib/auth/client";
import { Button } from "components/Button";
import { validate } from "lib/validate";
import { UrlFields } from "components/UrlForm";

interface Props extends Pick<ModalProps, "isOpen" | "onClose"> {
  url: Url | null;
  onSuccess: (prevUrl: Url, newUrl: Url) => void;
}

export const EditUrlModal = ({ url, isOpen, onSuccess, onClose }: Props) => {
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
      const fetchUrl = `${process.env.NEXT_PUBLIC_PROD_URL}/api/${url.id}`;
      const res = await fetch(fetchUrl, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const json = (await (res.ok ? res.json() : res.text())) as string | Record<string, any>;
      console.log(json);

      if (typeof json === "object") {
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

        <Formik
          validate={validate}
          onSubmit={onSubmit}
          initialValues={{
            url: url.url,
            slug: url.slug,
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
            <form onSubmit={handleSubmit}>
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

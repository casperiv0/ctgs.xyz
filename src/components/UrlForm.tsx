import * as React from "react";
import { FormField } from "components/FormField";
import { Error } from "components/Error";
import { Input } from "components/Input";
import { Button } from "./Button";
import { handleGenerate } from "lib/utils";

export const UrlFields = ({ handleChange, handleBlur, values, errors, touched }: any) => {
  const slugRef = React.useRef<HTMLInputElement>(null);
  const urlRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    urlRef.current?.focus();
  }, []);

  return (
    <>
      <FormField label="Enter URL">
        <Input
          hasError={touched.url && !!errors.url}
          ref={urlRef}
          type="url"
          id="url"
          placeholder="URL"
          name="url"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.url}
        />
        <Error touched={touched.url}>{errors.url}</Error>
      </FormField>

      <FormField label="Enter slug">
        <div className="relative w-full">
          <Input
            ref={slugRef}
            hasError={touched.slug && !!errors.slug}
            type="text"
            id="slug"
            placeholder="Slug"
            name="slug"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.slug}
          />

          <Button
            type="button"
            small
            onClick={() => slugRef.current && handleGenerate(slugRef.current, handleChange)}
            className="absolute top-1/2 right-2 -translate-y-1/2"
          >
            generate
          </Button>
        </div>

        <Error touched={touched.slug}>{errors.slug}</Error>
      </FormField>
    </>
  );
};

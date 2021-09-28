import * as React from "react";

type Props = JSX.IntrinsicElements["input"] & {
  hasError: boolean | undefined;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(({ hasError, ...rest }, ref) => (
  <input
    ref={ref}
    className={`w-full p-2 px-3 bg-white dark:bg-gray-700 rounded-md border-2 border-gray-200 dark:border-gray-600
    outline-none focus:border-2 focus:border-gray-600 dark:focus:border-white
    transition-all ${hasError && "border-red-500 dark:border-red-500"} ${rest.className}`}
    {...rest}
  />
));

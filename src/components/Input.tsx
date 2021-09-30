import * as React from "react";

type Props = JSX.IntrinsicElements["input"] & {
  hasError?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(({ hasError, ...rest }, ref) => (
  <input
    ref={ref}
    className={`w-full p-2 px-3 bg-white dark:bg-black rounded-md border-[1.2px] border-gray-200 dark:border-gray-600
    outline-none focus:border-dark-gray dark:focus:border-white dark:text-white
    hover:border-dark-gray dark:hover:border-white
    transition-all ${hasError && "border-red-500 dark:border-red-500"} ${rest.className}`}
    {...rest}
  />
));

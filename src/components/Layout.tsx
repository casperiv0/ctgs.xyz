import type * as React from "react";

export const Layout = ({ className, ...rest }: JSX.IntrinsicElements["main"]) => {
  return (
    <main
      className={`bg-gray-50 dark:bg-dark-gray text-black dark:text-gray-300 pb-16 pt-24 px-5 min-h-screen ${className}`}
      {...rest}
    />
  );
};

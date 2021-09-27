interface Props {
  touched: boolean | undefined;
  children: string | undefined;
}

export const Error = ({ children, touched }: Props) => {
  if (!touched && !children) return null;

  return <span className="text-red-500 mt-1">{children}</span>;
};

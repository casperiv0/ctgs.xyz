export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 p-3 flex items-center justify-center w-full text-dark-gray dark:text-gray-300 dark:bg-dark-gray bg-gray-50">
      <p className="text-lg">
        Created by{" "}
        <a
          rel="noopener noreferrer"
          className="underline"
          href="https://caspertheghost.me"
          target="_blank"
        >
          CasperTheGhost
        </a>
        . UI inspired by{" "}
        <a
          rel="noopener noreferrer"
          className="underline"
          href="https://vercel.com"
          target="_blank"
        >
          Vercel
        </a>
        .
      </p>
    </footer>
  );
};

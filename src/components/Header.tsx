import * as React from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Moon, Sun } from "react-bootstrap-icons";
import { getThemeFromLocal, Theme, updateBodyClass, updateLocalTheme } from "lib/theme";
import { Button } from "./Button";

export const Header = () => {
  const [theme, setTheme] = React.useState<Theme>("dark");
  const session = useSession();

  console.log(session);

  React.useEffect(() => {
    const t = getThemeFromLocal();

    setTheme(t);
    updateLocalTheme(t);
    updateBodyClass(t);
  }, []);

  function handleThemeChange() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateLocalTheme(newTheme);
  }

  async function handleAuth() {
    await signIn("github", {
      redirect: false,
      callbackUrl: "/",
    });
  }

  return (
    <>
      <div className="absolute top-5 left-5">
        <Button>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/Dev-CasperTheGhost/ctgs.xyz"
          >
            Source code
          </a>
        </Button>
      </div>

      {session.status === "authenticated" ? (
        <Button className="absolute top-5 right-20 h-10">
          <Link href="/account">
            <a>Account</a>
          </Link>
        </Button>
      ) : (
        <Button onClick={handleAuth} className="absolute top-5 right-20 h-10">
          Login
        </Button>
      )}

      <div className="absolute top-5 right-5">
        <Button
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          onClick={handleThemeChange}
          className="h-10 grid place-items-center"
        >
          {theme === "light" ? (
            <Moon className="fill-current text-dark-gray" width="20px" height="20px" />
          ) : (
            <Sun className="fill-current text-white" width="20px" height="20px" />
          )}
        </Button>
      </div>
    </>
  );
};

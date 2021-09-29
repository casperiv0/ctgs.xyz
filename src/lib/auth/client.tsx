import * as React from "react";
import { Url, User } from ".prisma/client";

interface SessionContext {
  user: User | null;
}

interface GetSessionData {
  user: User;
  urls: Url[];
}

interface ProviderProps {
  initialValue?: { session: User };
  children: React.ReactNode;
}

const SessionContext = React.createContext<SessionContext | undefined>(undefined);

export async function getSession(): Promise<GetSessionData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth`;

    const res = await fetch(url, {
      credentials: "same-origin",
    });
    const data = res.ok && (await res.json());

    return data;
  } catch (e) {
    console.log(e);

    return null;
  }
}

export const SessionProvider = ({ initialValue, children }: ProviderProps) => {
  const [user, setUser] = React.useState<User | null>(initialValue?.session ?? null);

  const fetchUser = React.useCallback(async () => {
    const data = await getSession();
    if (!data) return;

    setUser(data.user);
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = { user };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export function useSession() {
  const context = React.useContext(SessionContext);

  if (!context) {
    throw new Error("Must use `SessionProvider`");
  }

  return context;
}

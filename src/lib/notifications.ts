import * as React from "react";

type State = "loading" | "error" | null;

export function useNotifications() {
  const [notifications, setNotifications] = React.useState([]);
  const [state, setState] = React.useState<State>(null);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setState("loading");
      const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/notifications`;
      const res = await fetch(url);

      const data = await (res.ok ? res.json() : res.text());

      setState(null);
      setNotifications(data.notifications);
    } catch (e) {
      setState("error");
      console.log(e);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { state, notifications };
}

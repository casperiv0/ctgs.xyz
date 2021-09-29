import Auth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "lib/prisma";

export default Auth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  useSecureCookies: process.env.NODE_ENV === "production",
  theme: "dark",
  callbacks: {
    signIn: async ({ user, account, profile, email }) => {
      console.log({ user, account, profile, email });

      if (!user.name || !profile.login) {
        //   todo: return to /error?error="error message here"
        return false;
      }

      let dbUser = await prisma.user.findUnique({
        where: {
          login: profile.login as string,
        },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            avatarUrl: user.image ?? null,
            name: user.name ?? null,
            login: profile.login as string,
          },
        });
      }

      //   todo: error ? return to /error?error="error message here"
      return !!dbUser;
    },
  },
});

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const demoUsers = [
  { id: "1", username: "admin", password: "admin123" },
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const user = demoUsers.find(
          (item) => item.username === username && item.password === password,
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as { username?: string }).username ?? user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name =
          typeof token.username === "string"
            ? token.username
            : session.user.name ?? "User";
      }
      return session;
    },
  },
};
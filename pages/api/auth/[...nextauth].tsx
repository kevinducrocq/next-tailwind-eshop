import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import query from "@/utils/dbMysql";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await query({
          query: "SELECT * FROM users WHERE email = ?",
          values: [credentials.email],
        });

        if (
          user.length === 1 &&
          bcryptjs.compareSync(credentials.password, user[0].password)
        ) {
          return {
            id: user[0].id,
            name: user[0].firstName + " " + user[0].lastName,
            email: user[0].email,
            isAdmin: user[0].isAdmin,
          };
        }
        throw new Error("Email ou Mot de passe erronés");
      },
    }),
  ],
};

export default NextAuth(authOptions);

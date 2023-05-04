import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import query from "@/utils/dbMysql";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log(credentials);
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
});

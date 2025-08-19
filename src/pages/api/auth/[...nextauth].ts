import NextAuth, { AuthOptions, Account, Profile, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { db } from "../../../services/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  callbacks: {
    async signIn({ user }): Promise<boolean> {
      try {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        const userSnapshot = await getDocs(userQuery);
   
        if (userSnapshot.empty) {
          await addDoc(
            collection(db, "users"),
            {
              email: user.email,
              createdAt: new Date()
            }
          );
        }
      } catch {
        return false;
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);

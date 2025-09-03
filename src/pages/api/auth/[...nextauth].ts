import NextAuth, { AuthOptions } from "next-auth";
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
    async session({ session }) {
      let userActiveSubscription = null;

      try {
        if (!session.user?.email) return session;

        const userQuery = query(
          collection(db, "users"),
          where("email", "==", session.user.email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userId = userDoc.id;

          const subscriptionsQuery = query(
            collection(db, "subscriptions"),
            where("userId", "==", userId),
            where("status", "==", "active")
          );
          const subscriptionsSnapshot = await getDocs(subscriptionsQuery);

          if (!subscriptionsSnapshot.empty) {
            const subDoc = subscriptionsSnapshot.docs[0];
            userActiveSubscription = {
              id: subDoc.id,
              ...subDoc.data(),
            };
          }
        }
      } catch (err) {
        console.error("Erro ao buscar subscriptions:", err);
      }

      return {
        ...session,
        activeSubscription: userActiveSubscription,
      };
    },

    async signIn({ user }): Promise<boolean> {
      try {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          await addDoc(collection(db, "users"), {
            email: user.email,
            createdAt: new Date(),
          });
        }
      } catch (err) {
        console.error("Erro no signIn:", err);
        return false;
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);

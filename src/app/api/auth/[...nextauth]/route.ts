import axios from "axios";
import NextAuth, { Profile } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

type ProfileExtends = Profile & {
  role?: "master";
};

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: `${process.env.KEYCLOAK_DOMAIN}/realms/cras-realm`,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account && user) {
        return true;
      } else {
        return "/error/unauthorized";
      }
    },
    async jwt({ token, account, profile, user, session }) {

      if (account) {
        const profileJWT = profile as ProfileExtends;
        return {
          ...token,
          idToken: account?.id_token,
          accessToken: `Bearer ${account?.access_token}`,
          userId: profileJWT.sub,
          role: profileJWT.role || "agent",

        };
      }

      return {
        ...token,
      };
    },

    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          id: token.userId,
          role: token.role,
          ...session.user,
        },
      };
    },
  },
  events: {
    signOut: async ({ token }) => {
      try {
        const idToken = token.idToken as string;

        axios.get(
          `${process.env.KEYCLOAK_DOMAIN}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`,
          { params: { id_token_hint: idToken } }
        );
      } catch (error) {
        console.error(
          "next-auth-sign-out-err",
          `error trying to sign out: ${error}`
        );
      }
    },
  },
});



export { handler as GET, handler as POST };

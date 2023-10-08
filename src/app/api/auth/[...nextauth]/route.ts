import axios from "axios";
import NextAuth, { AuthOptions, Profile } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

type ProfileExtends = Profile & {
  role?: "master";
};


if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: `${process.env.KEYCLOAK_DOMAIN}/realms/cras-realm`,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      console.log('signIn callback error:', account); 
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
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
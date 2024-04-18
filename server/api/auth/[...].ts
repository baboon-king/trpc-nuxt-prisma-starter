import { NuxtAuthHandler } from "#auth";
import { DefaultSession } from "next-auth";
import IdentityServer4Provider from "next-auth/providers/identity-server4";

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // Props defined here can be accessed in session callback and will be returned by getToken
    jwt: ({ token, account, user }) => {
      if (account && user) {
        token.accessToken = account.access_token;
        // The `user` is the data defined in `profile` callback
        token.user = user;
      }

      return token;
    },

    // Session retuned by useSession and getSession
    session: ({ token, session }) => {
      session.user = token.user;
      session.accessToken = token.accessToken;

      return session;
    },
  },
  providers: [
    IdentityServer4Provider({
      type: "oauth",
      id: "identity-server4",
      name: "IdentityServer4",
      issuer: process.env.IdentityServer4_Issuer,
      clientId: process.env.IdentityServer4_CLIENT_ID,
      clientSecret: process.env.IdentityServer4_CLIENT_SECRET,
      authorization: {
        params: { scope: "email profile roles openid baboon.api" },
      },
      userinfo: {
        request({ client, tokens }) {
          return client.userinfo(tokens.access_token!);
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.UserName,
          email: profile.Email,
          image: null,
          ...profile,
        };
      },
    }),
  ],
});

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    user: {
      Email?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  /*
   * Usually contains information about the provider being used
   * and also extends TokenSet, which is different tokens returned by OAuth Providers.
   */
  interface Account {
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the jwt callback and getToken, when using JWT sessions */
  interface JWT {
    accessToken: string;
    user: {};
  }
}

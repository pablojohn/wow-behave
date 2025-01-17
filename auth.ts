import NextAuth from "next-auth";
import BattleNet from "next-auth/providers/battlenet";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    expires_at?: number;
  }
}

const issuer = (process.env.BATTLENET_ISSUER || "https://us.battle.net/oauth") as
  | "https://us.battle.net/oauth"
  | "https://oauth.battle.net"
  | "https://oauth.battlenet.com.cn"
  | "https://www.battlenet.com.cn/oauth"
  | "https://eu.battle.net/oauth"
  | "https://kr.battle.net/oauth"
  | "https://tw.battle.net/oauth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // debug: true,
  providers: [
    BattleNet({
      checks: ['pkce', 'nonce'],
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      issuer: issuer,
      authorization: { params: { scope: "openid wow.profile", state: "dungeon-honor" } }
    })
  ],
  basePath: "/auth",
  callbacks: {
    jwt({ token, account, user }) {
      if (account && account.access_token) {
        token.access_token = account.access_token;
        token.expires_at = account.expires_at;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token as string | undefined;
      session.expires_at = token.expires_at as number | undefined;
      session.user.id = token.id as string;
      return session;
    }
  }
});
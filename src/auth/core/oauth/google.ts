import { OAuthClient } from "./base";
import { z } from "zod";

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "google",
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    scopes: ["openid", "email", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
    userInfo: {
      schema: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url().optional(),
      }),
      parser: (user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.picture,
      }),
    },
  });
}

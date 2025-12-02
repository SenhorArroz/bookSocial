import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string | null;
      description?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    description?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  
  debug: true,

  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [Auth] Email ou senha vazios.");
          return null;
        }

        const emailInput = credentials.email as string;
        const passwordInput = credentials.password as string;

        console.log(`🔍 [Auth] Buscando usuário: "${emailInput}"`);

        let user = await db.user.findUnique({
          where: { email: emailInput },
        });

        if (!user) {
          console.log(`⚠️ [Auth] Busca exata falhou. Tentando minúsculas: "${emailInput.toLowerCase()}"`);
          user = await db.user.findUnique({
            where: { email: emailInput.toLowerCase() },
          });
        }

        if (!user) {
          console.log("❌ [Auth] Usuário não existe no banco de dados.");
          return null;
        }
        if (!user.password) {
          console.log("❌ [Auth] Usuário encontrado, mas sem senha (provavelmente conta Google).");
          return null;
        }

        const isValid = await compare(passwordInput, user.password);

        if (!isValid) {
          console.log("❌ [Auth] Senha incorreta.");
          return null;
        }

        console.log(`✅ [Auth] Sucesso! Logando: ${user.email} (ID: ${user.id})`);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          description: user.description,
        };
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
        token.description = user.description;
      }
      if (trigger === "update" && session?.user) {
        if (session.user.image) token.picture = session.user.image;
        if (session.user.name) token.name = session.user.name;
        if (session.user.description) token.description = session.user.description;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          image: token.picture as string,
          description: token.description as string | null,
        },
      };
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
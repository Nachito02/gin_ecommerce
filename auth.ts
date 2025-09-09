import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        const parsed = schema.safeParse(credentials);
        if (!parsed.success) throw new Error("Invalid credentials");
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } }); // OK: email es string

        if (!user || !user.hashedPassword)
          throw new Error("invalid credentials");

        const ok = await bcrypt.compare(password, user.hashedPassword);
        if (!ok) throw new Error("invalid password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    Google,
  ],

  pages: { signIn: "/" },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});

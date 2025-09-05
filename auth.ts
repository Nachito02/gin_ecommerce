import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "./lib/db"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  // Use AUTH_SECRET from your .env for v4 compatibility
  secret: process.env.AUTH_SECRET,
}

export default authOptions

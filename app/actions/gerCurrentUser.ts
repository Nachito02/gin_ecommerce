import "server-only"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import authOptions from "@/auth"

type PlainUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  emailVerified: string | null
}

export async function getCurrentUser(): Promise<PlainUser | null> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) return null

  const client = await clientPromise
  const db = client.db("gin")

  const user = await db.collection("users").findOne(
    { email },
    { projection: { _id: 1, name: 1, email: 1, image: 1, emailVerified: 1 } }
  )

  if (!user) return null

  return {
    id: user._id?.toString?.() ?? "",
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
    emailVerified: user.emailVerified
      ? new Date(user.emailVerified).toISOString()
      : null,
  }
}

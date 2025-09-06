import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const client = new MongoClient(uri)
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV !== "production") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise =  client.connect()
}

export default clientPromise

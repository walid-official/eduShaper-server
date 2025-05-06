// config/db.js
import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxdhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    global.eduServiceCollection = client.db("edu_db").collection("services");
    global.bookServiceCollection = client.db("bookService_db").collection("bookServices");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // process.exit(1);
  }
};

export default connectDB;

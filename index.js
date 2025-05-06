import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

import authRoutes from "./routes/auth.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";

// import { injectDB as injectAuthDB } from "./controllers/auth.controller.js";
import { injectDB as injectServiceDB } from "./controllers/services.controller.js";
import { injectDB as injectBookingDB } from "./controllers/bookings.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://education-service-d2fdb.web.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Base route
app.get("/", (req, res) => {
  res.send("Hello from SoloSphere Server....");
});

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxdhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Inject collections to controller modules
    // injectAuthDB(client);
    injectServiceDB(client);
    injectBookingDB(client);

    // Use routes
    app.use(authRoutes);
    app.use(servicesRoutes);
    app.use(bookingsRoutes);

    // Confirm connection
    console.log("Connected to MongoDB and server is ready.");
  } catch (error) {
    console.error("Error during server startup:", error);
  }
}

run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

















// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// var jwt = require("jsonwebtoken");
// const port = process.env.PORT || 5000;
// const app = express();

// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5174",
// //       // "https://edu-service-sharing-web.vercel.app",
// //       // "https://edu-service-sharing-c50kvndcj-walid-hasans-projects.vercel.app",
// //       "https://education-service-d2fdb.web.app",
// //     ],
// //     credentials: true,
// //   })
// // );

// app.use(cors({
//   origin: [
//       'http://localhost:5173',
//       "https://education-service-d2fdb.web.app",
//   ],
//   credentials: true
// }));



// app.use(express.json());
// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello from SoloSphere Server....");
// });

// const verifyToken = (req, res, next) => {
//   console.log("Inside the Logger", req.cookies);
//   const token = req.cookies?.token;
//   console.log(token);
//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized access" });
//   }
//   jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized access" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxdhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();

//     const eduServiceCollection = client.db("edu_db").collection("services");
//     const bookServiceCollection = client
//       .db("bookService_db")
//       .collection("bookServices");

//     // Auth related ApIs

//     app.post("/jwt", async (req, res) => {
//       const user = req.body;
//       const token = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {
//         expiresIn: "365d",
//       });
//       res
//         .cookie("token", token, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//         })
//         .send({ success: true });
//     });

//     app.post("/logout", async (req, res) => {
//       res
//         .clearCookie("token", {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//         })
//         .send({ success: true });
//     });

//     app.post("/addService", verifyToken, async (req, res) => {
//       const service = req.body;
//       const result = await eduServiceCollection.insertOne(service);
//       res.send(result);
//     });

//     app.get("/services", async (req, res) => {
//       const result = await eduServiceCollection.find().limit(6).toArray();
//       res.send(result);
//     });

//     app.get("/allServices", async (req, res) => {
//       const result = await eduServiceCollection.find().toArray();
//       res.send(result);
//     });

//     app.get("/allServices/search", async (req, res) => {
//       const { searchParams } = req.query;
//       let option = {};
//       if (searchParams) {
//         option = {
//           $or: [
//             { serviceName: { $regex: searchParams, $options: "i" } },
//             { description: { $regex: searchParams, $options: "i" } },
//           ],
//         };
//       }
//       const result = await eduServiceCollection.find(option).toArray();
//       res.send(result);
//     });

//     app.get("/services/:email", verifyToken, async (req, res) => {
//       const email = req.params.email;
//       const query = { "serviceProviderData.email": email };
//       if (req.user.email !== email) {
//         return res.status(403).send({ message: "Forbidden Access" });
//       }
//       const result = await eduServiceCollection.find(query).toArray();
//       res.send(result);
//     });

//     app.delete("/deleteService/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await eduServiceCollection.deleteOne(query);
//       res.send(result);
//     });

//     app.get("/service/:id", verifyToken, async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await eduServiceCollection.findOne(query);
//       res.send(result);
//     });

//     app.patch("/updateService/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const updatedService = req.body;
//       const result = await eduServiceCollection.updateOne(query, {
//         $set: updatedService,
//       });
//       res.send(result);
//     });

//     // New Database For Book Education Service

//     app.post("/bookServices", async (req, res) => {
//       const bookService = req.body;
//       const query = {
//         currentUserEmail: bookService.currentUserEmail,
//         serviceId: bookService.serviceId,
//       };
//       console.log(query);
//       const alreadyExist = await bookServiceCollection.findOne(query);
//       console.log("If already exist-->", alreadyExist);
//       if (alreadyExist)
//         return res.status(400).send("You Already Have Purchased This Service!");

//       const result = await bookServiceCollection.insertOne(bookService);
//       res.send(result);
//     });

//     app.get("/bookServices/:email", verifyToken, async (req, res) => {
//       const email = req.params.email;
//       const query = { currentUserEmail: email };
//       if (req.user.email !== email) {
//         return res.status(403).send({ message: "Forbidden Access" });
//       }

//       const result = await bookServiceCollection.find(query).toArray();
//       res.send(result);
//     });

//     app.get("/bookToDoServices/:email", verifyToken, async (req, res) => {
//       const email = req.params.email;
//       const query = { providerEmail: email };
//       if (req.user.email !== email) {
//         return res.status(403).send({ message: "Forbidden Access" });
//       }
//       const result = await bookServiceCollection.find(query).toArray();
//       res.send(result);
//     });

//     app.patch("/bookToDoServices/:id", async (req, res) => {
//       const id = req.params.id;
//       const bookToDoData = req.body;
//       const query = { _id: new ObjectId(id) };
//       const updatedDoc = {
//         $set: {
//           serviceStatus: bookToDoData.serviceStatus,
//         },
//       };
//       const result = await bookServiceCollection.updateOne(query, updatedDoc);
//       res.send(result);
//     });

//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => console.log(`Server running on port ${port}`));
require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())

// DB_USER=edu_service
// DB_PASSWORD=T2z44UfDSWMI0Fo3

app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxdhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const eduServiceCollection = client.db("edu_db").collection("services");
    

    app.post('/addService', async (req, res) => {
      const service = req.body;
      const result = await eduServiceCollection.insertOne(service);
      res.send(result);
    })

    app.get("/services", async (req, res) => {
      const result = await eduServiceCollection.find().toArray();
      res.send(result)
    });

    app.get("/services/:email", async (req, res) => {
      const email = req.params.email;
      const query = {"serviceProviderData.email" : email };
      const result = await eduServiceCollection.find(query).toArray();
      res.send(result)
    });

    app.delete("/deleteService/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await eduServiceCollection.deleteOne(query);
      res.send(result)
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await eduServiceCollection.findOne(query);
      res.send(result)
    });

    app.patch("/updateService/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const updatedService = req.body;
      const result = await eduServiceCollection.updateOne(query, {$set: updatedService});
      res.send(result)
    });

    // New Database For Book Education Service

    const bookServiceCollection = client.db("bookService_db").collection("bookServices");

    app.post("/bookServices",async(res,req) => {
      const bookService = req.body;
      const result = await bookServiceCollection.insertOne(bookService);
      res.send(result);
    })









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.listen(port, () => console.log(`Server running on port ${port}`))

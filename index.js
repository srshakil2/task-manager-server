const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mp1yd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // work

    const taskUserCalection = client
      .db("job-task-management-ass")
      .collection("users");
    const taskCalection = client
      .db("job-task-management-ass")
      .collection("task");

    // all users name and email post
    app.post("/users", async (req, res) => {
      const data = req.body;
      const email = data.email;
      const query = { email: email };
      const chackUser = await taskUserCalection.findOne(query);
      if (chackUser) return;
      const result = await taskUserCalection.insertOne(data);
      res.send(result);
    });

    // get login user
    app.get("/useremail/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await taskUserCalection.findOne(query);
      //   console.log(result);
      res.send(result);
    });
    // task added
    app.post("/addtask", async (req, res) => {
      const data = req.body;

      const result = await taskCalection.insertOne(data);
      // console.log(result);
      res.send(result);
    });
    app.get("/alltask", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const data = await taskCalection.find(query).toArray();
      res.send(data);
    });
    app.delete("/deleteitem", async (req, res) => {
      const id = req.query.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCalection.deleteOne(query);
      // console.log(result);
      res.send(result);
    });
    app.get("/taskdataupdate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // console.log(id);
      const result = await taskCalection.findOne(query);
      res.send(result);
    });
    app.patch("/taskdataupdate/update/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: data?.taskTitel,
          drescription: data?.description,
          role: data?.selecet,
        },
      };
      const result = await taskCalection.updateOne(query, updateDoc);
      // console.log(result);
      res.send(result);
    });
    // work
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("job-task-server is running for now");
});
app.listen(port, () => {
  console.log(`job-task is at: ${port}`);
});

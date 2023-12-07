const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const multer = require("multer");
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdjlbxg.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected to the database");

    const ImageCollection = client.db("SEOPage1").collection("cardsimage");

    app.post("/uploadImage", async (req, res) => {
      try {
        // Log the received data
        console.log("Received Data:", req.body);

        const result = await ImageCollection.insertOne({
          image: req.body.imageUrl, // Assuming the field is named 'image' in your MongoDB collection
        });

        res.json({ success: true, insertedId: result.insertedId });
      } catch (error) {
        console.error("Error uploading image:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });
  } finally {
    // Close the connection after your app shuts down
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SEO");
});

app.listen(port, () => {
  console.log("SEO is running");
});

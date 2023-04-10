const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8oxf22g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
   
    const productCollection = client.db("furniture").collection("product");

    const categoryCollection = client.db("furniture").collection("category");

    //Home Product

     app.get("/home-products", async (req, res) => {
       const query = {};
       const homeProducts = await productCollection.find(query).limit(8).toArray();
       res.send(homeProducts);
     });


    // product

    app.get("/products", async (req, res) => {
      const query = {};
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });
    
    // Booking

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(product);
    });

    // category

    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });

    app.get('/category-products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const category_products = await productCollection.find({ category_id: { $eq: id } }).toArray();
      console.log(category_products);
      res.send(category_products);
    }) 

  } finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("furniture server is running");
});

app.listen(port, () => console.log(`furniture server running on ${port}`));

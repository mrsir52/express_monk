//this comes right from the getting started section Hello World
//on the expressjs website
const express = require("express");
const app = express();
const port = 4000;

const cors = require("cors");

const bodyParser = require("body-parser");

const monk = require("monk");
// const MongoClient = require("mongodb").MongoClient;
// const ObjectId = require("mongodb").ObjectID;
const url =
  "mongodb://helioadmin:password1234@cluster0-shard-00-00-lbz6b.mongodb.net:27017,cluster0-shard-00-01-lbz6b.mongodb.net:27017,cluster0-shard-00-02-lbz6b.mongodb.net:27017/inventory?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

// const db is how you set your database path. Here we use monk to
// talk to our mongo atlas database and console log that there is a connection
// you can remove the console log once you have everything working
const db = monk(url);

  db.then(() => {
  console.log("connected");
});

const inventory = db.get("items")
const cart = db.get("cart")

app.use(cors());
app.use(bodyParser.json());


app.get("/inventory", async function(req, res) {
  const results = await inventory.find();
  res.status(200).send(results);
});

app.get("/cart", async function(req, res) {
  const results = await cart.find();
  res.status(200).send(results);
});


app.delete("/inventory", async (req, res) => {
  return await inventory.findOneAndDelete((req.body), (err, result) => {
    if(err) {
      throw err;
  }
  res.send('DELETE request to homepage')
  });
  
});

// app.get("/inventory", async function(req, res) {
//   const results = await inventory.findOne({_id: "req.body.id"}, "_id");
//   res.send('DELETE request to homepage')
// });

// app.get("/", async function(req, res) {
//   const 
// })

app.post('/inventory',async function (req, res) {
  const results = await inventory.insert(req.body)
  res.status(200).send(results)
})

app.post('/cart',async function (req, res) {
  const results = await cart.insert(req.body)
  res.status(200).send(results)
})

// app.delete('/:_id', async function (req, res) {
//     res.send('DELETE request to homepage');
//   });

app.listen(port, () => console.log(`App listening on port ${port}!`));

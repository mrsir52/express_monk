//this comes right from the getting started section Hello World
//on the expressjs website
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");

const url = require('./config/keys').mongoURI
const cors = require("cors");
const bodyParser = require('body-parser')


const monk = require("monk");
// const MongoClient = require("mongodb").MongoClient;
// const ObjectId = require("mongodb").ObjectID;



// const db is how you set your database path. Here we use monk to
// talk to our mongo atlas database and console log that there is a connection
// you can remove the console log once you have everything working
const db = monk(url);

  db.then(() => {
  console.log("connected");
});

const users = db.get('users')
const inventory = db.get("items")
const cart = db.get("cart")

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json())
//Inventory
app.get("/inventory", async function(req, res) {
  const results = await inventory.find();
  res.status(200).send(results);
});

app.delete("/inventory", async (req, res) => {
  return await inventory.findOneAndDelete((req.body), (err, result) => {
    if(err) {
      throw err;
  }
  res.send('DELETE request to homepage')// sends back deleted collection
  });
  
});

// app.patch("/inventory", async (req, res) => {
//   return await inventory.findOneAndUpdate((req.body), (err, result) => {
//     if(err) {
//       throw err;
//   }
//   res.send('DELETE request to homepage')
//   });
  
// });


app.post('/inventory',async function (req, res) {
  const results = await inventory.insert(req.body)
  res.status(200).send(results)
})

app.put('/inventory/:id', async (req, res) => {
  const results = await inventory.findOneAndUpdate(req.params.id, req.body)
  
  res.status(200).send(results)
})

//Cart

app.get("/cart", async function(req, res) {
  const results = await cart.find();
  res.status(200).send(results);
});


app.post('/cart',async function (req, res) {
  const results = await cart.insert(req.body)
  res.status(200).send(results)
})

// app.delete('/:_id', async function (req, res) {
//     res.send('DELETE request to homepage');
//   });


app.post('/login', async (req, res) => {
  const email = req.body.email
   //Create JWT Payload
  const results = await users.findOne({email})
  // const token = jwt.sign(payload, keys.secretOrKey)
  // res.cookie('jwt', token)
  const payload ={id: req.body.id, name: req.body.name, email: req.body.email}
  const token = jwt.sign(payload, 
      keys.secretOrKey, 
      (err, token)=> {
          res.json({
          token: token // 'Bearer'
        })
        res.status(200).send({msg: "success" });
      })
})


app.get("/current", async function(req, res) {
  const results = await users.findOne(({email}));
  res.status(200).send(results);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));



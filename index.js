//this comes right from the getting started section Hello World
//on the expressjs website
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const bcrypt = require("bcryptjs");

const url = require("./config/keys").mongoURI;
const cors = require("cors");
const bodyParser = require("body-parser");

const secret = "keep it secret. keep it safe";

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

const users = db.get("users");
const inventory = db.get("items");
const cart = db.get("cart");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json());
//Inventory
app.get("/inventory", async function(req, res) {
  const results = await inventory.find();
  res.status(200).send(results);
});

app.delete("/inventory", async (req, res) => {
  return await inventory.findOneAndDelete(req.body, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("DELETE request to homepage"); // sends back deleted collection
  });
});



app.post("/inventory", async function(req, res) {
  const results = await inventory.insert(req.body);
  res.status(200).send(results);
});

app.put("/inventory/:id", async (req, res) => {
  const results = await inventory.findOneAndUpdate(req.params.id, req.body);

  res.status(200).send(results);
});

//Cart

app.get("/cart", async function(req, res) {
  const results = await cart.find();
  res.status(200).send(results);
});

app.post("/cart", async function(req, res) {
  const results = await cart.insert(req.body);
  res.status(200).send(results);
});

app.get("/current", async function(req, res) {
  const results = await users.findOne({ email });
  res.status(200).send(results);
});

// app.post("/login", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   //find by email
//   users
//   .findOne({ email })
//   .then(user => {
//     //check for user
//     if (!user) {
//       return res.status(400).json({ email: "User not found" });
//     }
//     //check password
//     bcrypt.compare(password, user.password).then(isMatch => {
//         if(isMatch) {
//           //user matched

//           const payload ={id: user.id, name: user.name, avatar: user.avatar} //Create JWT Payload

//           //Sign Token
//             jwt.sign(payload, 
//               keys.secretOrKey, 
//               {expiresIn: 3600}, 
//               (err, token)=> {
//                 res.json({
//                   success: true,
//                   token: token // 
//                 })
//               })
//         } else {
//       return res.status(400).json({msg: "Not a success"})
//      }
//   });
// });
// });

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  users
    .findOne({ email, password })
    .then(({ _id, email }) => {
      const user = { _id, email };
      const token = jwt.sign(user, secret);
      res.cookie("token", token, {
        domain: "localhost",
        path: "/",
        httpOnly: false
      });
      res.status(200).send({
        _id,
        email,
        token
      });
    })
    .catch(() => {
      res.status(401).end();
    });
});



app.listen(port, () => console.log(`App listening on port ${port}!`));

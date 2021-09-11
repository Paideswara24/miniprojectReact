//import the modules
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
// const bosyparser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// to store the token
// *********************************const { default: obj } = require("./token");
dotenv.config();

//create the rest object
const app = express();
//where "app" is the rest object
//where "app" object used to create the serives like GET,POST,PUT

//Communication language between client and server by using MIME type
app.use(express.json());

//enable the cors policy
app.use(cors());

//create the refrernce variable to connect to mongoDB database
const miniproject = mongodb.MongoClient;

//create the post request
//app.post("URL",callback function)
app.post("/login", (req, res) => {
    miniproject.connect("mongodb+srv://admin:admin@testcluster.w9ndz.mongodb.net/rjs-8pm-miniPro?retryWrites=true&w=majority", (err, connection) => {
        if (err) throw err;
        else {
            const db = connection.db("rjs-8pm-miniPro");
            db.collection("user_details").find({ "email": req.body.email, "password": req.body.password }).toArray((err, array) => {
                if (err) throw err;
                else {
                    if (array.length > 0) {
                        const token = jsonwebtoken.sign({ "email": req.body.email, "password": req.body.password }, process.env.SECRETE_KEY, { expiresIn: "30d" })
                        res.status(200).send({ "login": "success", "token": token });
                    } else {
                        res.send({ "login": "fail" });
                    }
                }
            })
        }
    });
});
let port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log("server listing the port number 8080");
})
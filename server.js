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
const obj = require("./token");
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
                        obj.token = jsonwebtoken.sign({ "email": req.body.email, "password": req.body.password }, process.env.SECRETE_KEY, { expiresIn: "30d" })
                        res.status(200).send({ "login": "success", "token": obj.token });
                    } else {
                        res.send({ "login": "fail" });
                    }
                }
            })
        }
    });
});

//middleware code:=
//middleware: token campare code is call middleware
//"checktoken" is compare the "client" token with "server" side 
const checktoken = (req, res, next) => {
    //reactjs sending one token that token is sending throw the "Headers"
    let allHeaders = req.headers;
    //  (Rectjs token === server side token)
    if (allHeaders.token === obj.token) {
        //feach the data for the database so we need to use "Next()" function
        next();
    } else {
        res.send({ "msg": "authentication failed" });
    }
}

//data feaching for the server so we need to create get request
//note: "item" caming for Reactjs item=> washing,camera,ac
//this code is a final we call middleware with RestAPI
app.get("/category/:item", [checktoken], (req, res) => {
    miniproject.connect("mongodb+srv://admin:admin@testcluster.w9ndz.mongodb.net/rjs-8pm-miniPro?retryWrites=true&w=majority", (err, connection) => {
        if (err) throw err;
        else {
            const db = connection.db("rjs-8pm-miniPro");
            db.collection(req.params.item).find().toArray((err, array) => {
                if (err) throw err;
                else {
                    res.send(array);
                }

            })
        }
    });
});


let port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log("server listing the port number 8080");
})
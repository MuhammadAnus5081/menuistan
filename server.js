const cors = require("cors");
const express = require('express');
const app = express();
const routes = require("./src/routes");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const multer= require("multer");
const http = require('http').Server(app);
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const server = require('http').Server(app);
const axios = require('axios');
const nodemailer = require('nodemailer');
const bcrypt= require('bcryptjs'); 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const upload = require('./src/middleware/uploads');
const session = require('express-session');
const emailRoute = require('./src/routes/emailRoute');
const file=require('./src/routes/routes');
const user = require ('./src/routes/user');

app.use(express.json());
app.use(cors()); // Use the cors middleware
const fs = require('fs');
app.set('view engine', 'ejs');
express.urlencoded({ extended: true })
// Middleware setup
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: 'SECRET', // Replace with your own secret key
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session());
app.use('/',emailRoute);
//app.use('/otp' , otp);
app.use('/file', file);
app.use('/user', user);
//app.use('/', data);
global.__basedir = __dirname;



const connectDB = async () => {
  try {
      await mongoose.connect('mongodb+srv://anas:anas123@cluster0.1moqjmp.mongodb.net/?retryWrites=true&w=majority')
  }
  catch (error) {
      console.log("Databse Error : ", error)
  }
}

const db =   mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
  console.log("Connected successfully");

});

// Middleware to parse JSON bodies
app.use(express.json());

//
//app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

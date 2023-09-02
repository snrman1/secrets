require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect('mongodb://0.0.0.0:27017/userDb',{useNewUrlParser: true})
 .then(() => console.log('Connected to database'))
  .catch(error => console.error('Error connecting to database:', error));

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });
  
 
  userSchema.plugin(encrypt,{ secret :process.env.SECRET, encryptedFields:['password']});
  

  const User = mongoose.model('User', userSchema);

app.get("/",(req,res)=>{
    res.render('home');
})

app.get("/login",(req,res)=>{
    res.render('login');
})

app.get("/register",(req,res)=>{
    res.render('register');
})


app.post("/register", (req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
  
    newUser.save()
    .then(() => {
      // Registration successful, render the 'secrets' page
      res.render('secrets');
    })
    .catch((error) => {
      // Handle errors here
      console.error('Error during registration:', error);
      res.status(500).send('An error occurred during registration.');
    });
});
//////////user loggin//////////
app.post("/login", (req, res)=> {

   const username = req.body.username;
   const password = req.body.password;

   //if(username === username && password === password) {
   User.findOne({email:username,password:password})
   .then(() => {
   
    res.render('secrets');})
   
   .catch((error)=>{
    console.log('error',error);
   })}
);




//////////////connecting to server //////////////
app.listen(3000, ()=>{
    console.log('listening on port 3000');
});
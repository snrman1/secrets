require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

  bcrypt.hash( req.body.password, saltRounds, function(err, hash) {
  
    const newUser = new User({
      email: req.body.username,
      password: hash
    })

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
  })
    
  
    
});
//////////user loggin//////////
app.post("/login", (req, res)=> {

   const username = req.body.username;
   const password = req.body.password;

   //if(username === username && password === password) {
   User.findOne({email:username})
   .then((user) => {
    if(!user){
      return res.status(404).send('User not found')}
    
    bcrypt.compare(password,user.password,(err, result)=> {
      if(err){
        console.log(err);
      } else {
        res.render('secrets');
      }
  });
})
   
   .catch((error)=>{
    console.log('error',error);
   });
  });




//////////////connecting to server //////////////
app.listen(3000, ()=>{
    console.log('listening on port 3000');
});
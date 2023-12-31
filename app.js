require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'my little secret',
  resave: false,
  saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://0.0.0.0:27017/userDb',{useNewUrlParser: true})
 .then(() => console.log('Connected to database'))
  .catch(error => console.error('Error connecting to database:', error));
//mongoose.set("useCreateIndex", true);


  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });
  
 
  userSchema.plugin(passportLocalMongoose);

  const User = mongoose.model('User', userSchema);

  passport.use(User.createStrategy());

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render('home');
})

app.get("/login",(req,res)=>{
    res.render('login');
}) 

app.get("/register",(req,res)=>{
    res.render('register');
})

app.get("/secrets",(req,res)=>{
  if(req.isAuthenticated()){
    res.render('secrets');
  }else{
    res.redirect('/login');
}});


app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  }); 
});

app.post("/register", (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect('/secrets');
      });
    }
  });
});



//////////user loggin//////////
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect('/login');
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect('/secrets');
      });
    }
  });
});



//////////////connecting to server //////////////
app.listen(3000, ()=>{
    console.log('listening on port 3000');
});
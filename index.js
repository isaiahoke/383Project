require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy; 
const User = require('./backend/models/user'); 
const routes = require('./backend/routes/routes');
const flash = require('connect-flash');
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(session({
    secret: "this is my little secret",
    resave: false,
    saveUninitialized: false
  }));


app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session()); 

app.use(function(req, res, next){
    res.locals.messages =  req.flash();
    next();
})

app.use(function(req, res, next){
    res.locals.user = req.user || null
    next();
});

mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser: true,
   useUnifiedTopology : true, 
  }).then(() => {
    console.log("Connected to DB Succesfully");
  }).catch(err => {
    console.log('ERROR Connecting to db!: ', err.message);
});


passport.use('local', new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());


routes(app);

let port = process.env.PORT;

if(port == null || port == ""){
    port = 4550;
}


app.listen(port, ()=>{
    console.log('server started sucessfully on ' + port);
});



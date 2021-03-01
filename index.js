const path = require('path');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const express = require('express');
const bodyParser = require('body-parser');
const userModel = require('./Models/users.js')

const errorController = require('./Controller/error');
const mongoose = require('mongoose')
const csrf = require('csurf')

const app = express();
app.listen(3000);

app.set('view engine', 'ejs');
app.set('views', 'Views');

mongoose
  .connect(
    'mongodb://localhost/BookSharing'
  )

const store = new MongoDBStore({
  uri:'mongodb://localhost/BookSharing',
  collection:'sessions'
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(session({secret:"avcgstejdh",resave:false,saveUninitialized:false,store:store}))


//app.use(csrf())
//app.use((req,res,next)=>{
//  res.locals.csrfToken = req.csrfToken()
//  res.locals.isAuthenticated = req.session.isLoggedIn
//  next()
//})

app.use((req,res,next)=>{
  if(!req.session.user){
    return next()
  }
  userModel.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

const startRoute = require("./Routes/start")
const homepageRoute = require("./Routes/homepage")
const profileRoute = require("./Routes/profile")

app.use(startRoute)
app.use('/homepage',homepageRoute)
app.use('/profile',profileRoute)

app.use(errorController.get404);
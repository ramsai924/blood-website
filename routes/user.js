const express = require('express')
const bodyParser = require("body-parser");
const flash = require('connect-flash')
const Donar_donate = require("../models/Donar_donate")
const search_donar_post = require("../models/serach_donar_post")
const User = require('../models/userModel')
const app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//middileware
function auth(req,res,next){
  if(req.session.userid){
    next()
  }else{
    req.flash("message", "you need to login");
    res.redirect("/")
  }
}

//Home page
app.get("/",async (req,res) => {

    try {
      var userData; // this is for donars to notify to update details
      var userset; // checking user is login or not

      const userId = req.session.userid;
      if (userId) {
        userset = true;
        const user = await User.findById({ _id: userId })
        if(user.usertype == "donar"){
          const donar = await Donar_donate.find({ userid: userId });
          // console.log(donar)
          if (donar.length != 0 ) { userData = true } else { userData = false }
        }
      } else {
        userset = false;
      } 
      
      res.render("home", { userset, userData , message : req.flash('message') })
    } catch (error) {
      // res.redirect("/")
      console.log(error)
      res.send("404")
    }
})

//Login route
app.post("/login", urlencodedParser, async (req, res) => {
  try {
    const user = await User.find({ email : req.body.emails });
    req.session.userid = user[0]._id;
    req.flash('message', 'Login success')
    res.redirect("/");
  } catch (error) {
    // res.status(500).json({ success: false, error: error.message });
    res.redirect("/");
  }
});


//register route
app.post('/register',urlencodedParser,async (req,res) => {
  
        const user = User.create(req.body , (err,users) => {
            if(err){
              req.flash('message', 'Registered successfully..!!')
                return res.redirect("/")
            }
             req.session.userid = users._id;
             res.redirect("/");
        }); 
})


app.get("/profile",auth,async (req,res) => {
    try {
      var userset = await User.findById({ _id: req.session.userid })

      var userData;
      var search;

      if (userset.usertype == "donar") {
        const donar = await Donar_donate.find({ userid: req.session.userid })
        userData = donar
      }


      if (userset.usertype == "search") {
        const searched = await search_donar_post.find({ userid: req.session.userid })
        search = searched;
      }
  
      res.render("profile", { userset, userData, search })
    
    } catch (error) {
      // res.status(500).json({ success: false, error: error.message });
      console.log(error)
      // res.redirect("/");
    }
})



//Logout route
app.get("/logout",(req,res) => {
  req.session.destroy((err) => {
    if(err){
      res.redirect("/")
      return
    }

    res.clearCookie("sid")
    res.redirect("/")
  })
})

module.exports = app;
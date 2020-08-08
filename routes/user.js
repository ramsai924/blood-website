const express = require('express')
const bodyParser = require("body-parser");
const flash = require('connect-flash')
const Donar_donate = require("../models/Donar_donate")
const search_donar_post = require("../models/serach_donar_post")
const Plasma_post = require("../models/plasma_post")
const Plasma_search = require("../models/plasma_search_post")
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
      var checkplasmauser;
      const userId = req.session.userid;
      if (userId) {
        userset = true;
        const user = await User.findById({ _id: userId })
        if(user.usertype == "donar"){
          const donar = await Donar_donate.find({ userid: userId });
          const plasmauser = await Plasma_post.find({ userid : userId })
          // console.log()
          if (plasmauser.length != 0) { checkplasmauser = true } else { checkplasmauser = false  }
          if (donar.length != 0 ) { userData = true } else { userData = false }
        }
      } else {
        userset = false;
      } 
      console.log(checkplasmauser)
      res.render("home", { userset, userData, checkplasmauser, message : req.flash('message') })
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

//profile route
app.get("/profile",auth,async (req,res) => {
    try {
      var userset = await User.findById({ _id: req.session.userid }).populate([
        { path: 'activity.saved', model: 'donar_donate', populate: { path: 'userid',model: 'user'} }, 
        { path: 'activity.viewed', model: 'user', populate: { path: 'userid', model: 'user' } },
        { path: 'activity.plasmasaved', model: 'plasma_post', populate: { path: 'userid', model: 'user' } }
      ])
     
      var userData;
      var plasmapost;
      var plasmasearch;
      var search;

      
      const donar = await Donar_donate.find({ userid: req.session.userid })
      userData = donar
      

      const plasma_posts = await Plasma_post.find({ userid: req.session.userid })
      plasmapost = plasma_posts

      const plasma_search = await Plasma_search.find({ userid: req.session.userid })
      plasmasearch = plasma_search

      
      const searched = await search_donar_post.find({ userid: req.session.userid })
      search = searched;
     
      // console.log(userset.activity.plasmasaved)
      res.render("profile", { plasmapost, plasmasearch, userset, userData, search , message : req.flash('message') })
    
    } catch (error) {
      // res.status(500).json({ success: false, error: error.message });
      console.log(error)
      
    }
})

//update profile
app.post("/editprofile/:id", urlencodedParser,async (req,res) => {
  try {
      const user = await User.findByIdAndUpdate({ _id : req.params.id } , req.body , { new : true , runValidators : true })
      req.flash("message", "profile updated");
      res.redirect("/profile");
  } catch (error) {
    console.log(error)
  }
});

//Delete regular search donarpost
app.get("/deletepost/:id",async (req,res) => {
  try {
    const searched = await search_donar_post.findByIdAndDelete({ _id : req.params.id })
    req.flash("message", "Post deleted success");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
  }
});

//edit regular search donarpost
app.post("/editpost/:id",urlencodedParser,async (req,res) => {
  try {
    const searched = await search_donar_post.findByIdAndUpdate({ _id : req.params.id } , req.body , { new : true , runValidators : true })
    req.flash("message", "Post updated success");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
  }
})

//edit present user donar details
app.post("/presentdonaredit/:id", urlencodedParser, async (req, res) => {
  try {
    const searched = await Donar_donate.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
    req.flash("message", "your donar details updated success");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
  }
})

//edit plasma donate post
app.post("/plasmadonateedit/:id", urlencodedParser, async (req, res) => {
  try {
    const searched = await Plasma_post.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
    req.flash("message", "your plasma donar details updated success");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
  }
})

//editing plasma search post
app.post("/plasmasearchedit/:id", urlencodedParser, async (req, res) => {
  try {
    const searched = await Plasma_search.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
    req.flash("message", "your plasma patient details updated success");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
  }
})
//deleting plasma donar post
app.get("/plasmasearchdelete/:id",async (req,res) => {
  try {
    const deleplasmapatient = await Plasma_search.findByIdAndDelete({ _id : req.params.id })
    req.flash("message", "patient deleted success");
    res.redirect("/profile")
  } catch (error) {
    console.log(errors)
  }
})

//delete viewed user from profile
app.get("/profile/viewuserdel/:id", urlencodedParser, async (req, res) => {
  try {
    const userview = await User.findByIdAndUpdate({ _id: req.session.userid }, { $pull: { "activity.viewed": req.params.id } }) //saved user data
    req.flash("message", "viewed user deleted");
    res.redirect("/profile")
   
  } catch (error) {
    console.log(error)
  }
})

//delete saved user from profile
app.get("/profile/saveduserdel/:id",async (req,res) => {
  try {
    const userdata = await User.findByIdAndUpdate({ _id: req.session.userid }, { $pull: { "activity.saved": req.params.id } })
    req.flash("message", "saved user deleted");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
  }
})

//delete plasma saved user from profile
app.get("/profile/savedplasmauserdel/:id", async (req, res) => {
  try {
    const userdata = await User.findByIdAndUpdate({ _id: req.session.userid }, { $pull: { "activity.plasmasaved": req.params.id } })
    req.flash("message", "saved plasma user deleted");
    res.redirect("/profile")
  } catch (error) {
    console.log(error)
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
    req.flash("message", "Logged out successfully");
    res.redirect("/")
  })
})



module.exports = app;
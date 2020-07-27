const express = require("express");
var bodyParser = require("body-parser");
const search_donar_post = require("../models/serach_donar_post");
const User = require("../models/userModel");
const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

async function checkuser(req,res,next){
    const user = await User.findById({ _id: req.session.userid });
    console.log(user);
    if (user.usertype === "search") {
        next()
    }else{
        req.flash('message', 'You need to register as a search')
        res.redirect("/searchdonar");
    }
}

app.post("/",checkuser,urlencodedParser, async (req, res) => {
    try {
          const post = await search_donar_post.create(req.body);
          req.flash("message", "Details posted sucess");
          res.redirect("/searchdonar");
        } catch (error) {
            console.log(error)
        // res.status(500).json({ error })
    }
});


module.exports = app;

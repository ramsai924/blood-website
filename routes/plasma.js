const express = require('express')
const bodyParser = require("body-parser");
const flash = require('connect-flash')
const Plasma_search_post = require("../models/plasma_search_post")
const Plasma_post = require("../models/plasma_post")
const geocoder = require("../utils/geocoder");
const User = require('../models/userModel')
const app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false });

function auth(req,res,next){
    if(req.session.userid){
        next()
    }else{
        req.flash('message','You need to login')
        res.redirect("/plasma")
    }
}

app.get("/",async (req,res) => {
    try {
        var userset; // checking user is login or not
        var userdata;
        var donars ;

        var checkpdonardetails;

        const userId = req.session.userid;
        if (userId) {
            userset = true;
            const user = await User.findById({ _id: userId })

            const checkpdonar = await Plasma_post.find({ userid : userId })

            if(checkpdonar.length > 0){
                checkpdonardetails = true;
            }else{
                checkpdonardetails = false;
            }
            userdata = user;
        } else {
            userset = false;
        }
        
        if (req.query.zipcode && req.query.bloodgroup && req.query.distance){
            const Getlocation = await geocoder.geocode(req.query.zipcode );

            const longitute = Getlocation[0].longitude;
            const latitude = Getlocation[0].latitude;
            
            const radiuss = req.query.distance / 6378;
            const donar_find = await Plasma_post.find({
                bloodGroup: req.query.bloodgroup,
                Donatstatus: "active",
                location: {
                    $geoWithin: { $centerSphere: [[longitute, latitude], radiuss] },
                }
            }).populate("userid");
            // console.log(donar_find)
            donars = donar_find

        }else if (req.query.longitute && req.query.latitude && req.query.bloodgroup && req.query.distance){

            const lat = req.query.latitude;
            const long = req.query.longitute;
            const radius = req.query.distance / 6378;

            const plasma_find = await Plasma_post.find({
                Donatstatus: "active",
                bloodGroup : req.query.bloodgroup,
                location: {
                    $geoWithin: { $centerSphere: [[long, lat], radius] },
                }
            }).populate("userid");

            donars = plasma_find
        } else if (req.query.bloodgroup){
            const plasma_findBlood = await Plasma_post.find({ Donatstatus: "active", bloodGroup: req.query.bloodgroup }).populate("userid");
            donars = plasma_findBlood
        }
        else{
            const plasma_find = await Plasma_post.find({ Donatstatus: "active" }).populate("userid");
            donars = plasma_find
        }
        
        // console.log(donars[0])

        // res.json({ donars })
        res.render("plasma", { userset, userdata, donars, checkpdonardetails, message: req.flash('message') })
    } catch (error) {
        console.log(error)
    }
})

app.post("/plasmasearch",auth,urlencodedParser,async (req,res) => {

    try {
        const user = await User.findById({ _id : req.session.userid })
        // console.log(user)
        if (user.usertype == "search"){
            const plasma_search = await Plasma_search_post.create(req.body)
            req.flash("message", "user data post success");
            res.redirect("/plasma")
        }else{
            req.flash("message", "You are not a search user");
            res.redirect("/plasma")
        }
        
    } catch (error) {
        console.log(error)
    }
})

app.post("/plasmadonate", auth, urlencodedParser, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.session.userid })

        const plasma_exits_user = await Plasma_post.find({ userid : req.session.userid })

        // console.log(plasma_exits_user)

        if(plasma_exits_user.length > 0){
            req.flash("message", "You have already updated details");
            res.redirect("/plasma")
        }else{
            if (user.usertype === "donar") {
                const plasma_post = await Plasma_post.create(req.body)
                req.flash("message", "Donar details Updated");
                res.redirect("/plasma")
            } else {
                req.flash("message", "You are not a Donar user");
                res.redirect("/plasma")
            }
        }
        
    } catch (error) {
        console.log(error)
    }
})


//saving user data
app.post("/save", urlencodedParser, async (req, res) => {
    try {
        console.log(req.body)
      
        const preuserpsave = await User.findById({ _id: req.session.userid })
        const Plasmapost = await Plasma_post.find({ _id: req.body.save })
        const userpview = await User.findById({ _id: Plasmapost[0].userid })

        var arr = preuserpsave.activity.plasmasaved.concat(userpview.activity.viewed)

        var stringarr = []
        arr.forEach((e) => {
            stringarr.push(e.toString())
        });

        if (stringarr.includes(req.body.save, req.body.view) === false){
        const Plasmapost = await Plasma_post.find({ _id: req.body.save })
        const userview = await User.findByIdAndUpdate({ _id: Plasmapost[0].userid }, { $push: { "activity.viewed": req.body.view } }) //saved user data
        const user = await User.findByIdAndUpdate({ _id: req.session.userid }, { $push: { "activity.plasmasaved": req.body.save } })// saved table data
        req.flash("message", "user saved");
        res.redirect("/plasma");
        } else{
            req.flash("message", "user alredy saved");
            res.redirect("/plasma");
        }

    } catch (error) {
        res.status(500).json({ error })
    }
})

//404 page
app.get('*', function (req, res) {
    res.status(404).render('404');
});

module.exports = app;
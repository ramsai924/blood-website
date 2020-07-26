const express = require("express");
var bodyParser = require("body-parser");
const Donar_donate = require("../models/Donar_donate");
const User = require("../models/userModel");
const flash = require('connect-flash')
const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", urlencodedParser, async (req, res) => {
  try {
    var userset;
    var userdata;
    if (req.session.userid){
      userdata = await User.findById({ _id: req.session.userid });
      userset = true;
    }else{
      userset = false;
    }

    const fdonars = [];
    if (req.query.longitute && req.query.distance && req.query.bloodgroup) {
      const long = req.query.longitute;
      const lat = req.query.latitude;

      const radius = req.query.distance / 6378;

      const donar = await Donar_donate.find({
        Donatstatus: "active",
        location: {
          $geoWithin: { $centerSphere: [[long, lat], radius] },
        }
      }).populate("userid");

      donar.forEach((donar) => {
        if (donar.Bloodgroup === req.query.bloodgroup) {
          fdonars.push(donar);
        }
      });
    } else if (req.query.bloodgroup){
      const donar = await Donar_donate.find({ Bloodgroup: req.query.bloodgroup, Donatstatus: "active" }).populate("userid");
      donar.forEach((donar) => {
        if (donar.Bloodgroup === req.query.bloodgroup) {
          fdonars.push(donar);
        }
      });
    } else {
      const donar = await Donar_donate.find({ Donatstatus: "active" }).populate("userid");

      donar.forEach((donar) => {
     
          fdonars.push(donar);
        
      });
    }
    
    res.render("searchdonar", { data: fdonars, userset: userset, userdata , message : req.flash('message') });
  } catch (error) {
    res.status(500).json({ err: error });
    console.log(error)
  }
});

//saving user data
app.post("/save",urlencodedParser,async (req,res) => {
  try {
    // console.log(req.body)
    // console.log(req.session.userid)
    //   const user = await User.findById({ _id : req.session.userid })
    const donardata = await Donar_donate.find({ _id: req.body.save })
    // console.log(donardata)
    const userview = await User.findByIdAndUpdate({ _id: donardata[0].userid }, { $push: { "activity.viewed": req.body.view } }) //saved user data
    const user = await User.findByIdAndUpdate({ _id: req.session.userid }, { $push: { "activity.saved" : req.body.save  }})// saved table data
    req.flash("message", "user saved");
    res.redirect("/searchdonar");
    // res.status(200).json({ user, userview })
  } catch (error) {
      res.status(500).json({ error})
  }
})


//deleting saved data
app.post("/del",urlencodedParser,async(req,res) => {
  try {
    // console.log(req.body)
    // console.log(req.session.userid)
    //   const user = await User.findById({ _id : req.session.userid })
    const donardata = await Donar_donate.find({ _id: req.body.save })
    // console.log(donardata)
    const userview = await User.findByIdAndUpdate({ _id: donardata[0].userid }, { $pull: { "activity.viewed": req.body.view } }) //saved user data
    const user = await User.findByIdAndUpdate({ _id: req.session.userid }, { $pull: { "activity.saved": req.body.save } })// saved table data
    res.status(200).json({ user, userview })
  } catch (error) {
    // res.status(500).json({ error })
    console.log(error)
  }
})


module.exports = app;

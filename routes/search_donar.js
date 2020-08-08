const express = require("express");
var bodyParser = require("body-parser");
const Donar_donate = require("../models/Donar_donate");
const search_donar_post = require("../models/serach_donar_post");
const User = require("../models/userModel");
const geocoder = require("../utils/geocoder");
const flash = require('connect-flash')
const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", urlencodedParser, async (req, res) => {
  try {
    var userset;
    var userdata;
    var donardetails;
    if (req.session.userid){
      userdata = await User.findById({ _id: req.session.userid });
      const checkdonardetails = await Donar_donate.find({ userid: req.session.userid})
      if (checkdonardetails.length > 0){
        donardetails = true;
      }else{
        donardetails = false;
      }
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
    } else if (req.query.zipcode && req.query.bloodgroup && req.query.distance) {
      const Getlocation = await geocoder.geocode(req.query.zipcode);

      const longitute = Getlocation[0].longitude;
      const latitude = Getlocation[0].latitude;

      const radiuss = req.query.distance / 6378;
      const donar = await Donar_donate.find({
        Donatstatus: "active",
        location: {
          $geoWithin: { $centerSphere: [[longitute, latitude], radiuss] },
        }
      }).populate("userid");

      donar.forEach((donar) => {
        if (donar.Bloodgroup === req.query.bloodgroup) {
          fdonars.push(donar);
        }
      });

    }else if (req.query.bloodgroup){
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
    // res.json(fdonars)
    res.render("searchdonar", { data: fdonars, userset: userset, userdata, donardetails, message : req.flash('message') });
  } catch (error) {
    res.status(500).json({ err: error });
    console.log(error)
  }
});



// async function checkuser(req, res, next) {
//   const user = await User.findById({ _id: req.session.userid });
//   console.log(user);
//   if (user.usertype === "search") {
//     next()
//   } else {
//     req.flash('message', 'You need to register as a search')
//     res.redirect("/searchdonar");
//   }
// }

//post patient details
app.post("/searchdonarpost", urlencodedParser, async (req, res) => {
  try {
    console.log("serach donar page patient post")
    const user = await User.findById({ _id: req.session.userid });
    
    if (user.usertype === "search") {
      const post = await search_donar_post.create(req.body);
      req.flash("message", "Details posted sucess");
      res.redirect("/searchdonar");
    } else {
      req.flash('message', 'You need to register as a search')
      res.redirect("/searchdonar");
    }
    
  } catch (error) {
    console.log(error)
    // res.status(500).json({ error })
  }
});

//post donar details

app.post("/donardonate", urlencodedParser, async (req, res) => {
  try {
    console.log("serach donar page donar donate")
    if (req.body.usertype === "donar") {
      const check = await Donar_donate.find({ userid: req.body.userid })

      if (check.length != 0) {
        req.flash('message', 'you already updated donar details')
        res.redirect("/searchdonar")
        return
      } else {
        Donar_donate.create(req.body, (err, data) => {
          if (err) throw err;
          req.flash('message', 'Details updated sucessfully')
          res.redirect("/searchdonar")
          return
        });
      }
    } else {
      req.flash('message', 'you are not registered as a donar')
      res.redirect("/searchdonar")
      return
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//saving user data
app.post("/save",urlencodedParser,async (req,res) => {
  try {
    
    const preusersave = await User.findById({ _id: req.session.userid })
    const donardata = await Donar_donate.find({ _id: req.body.save })
    const userviewed = await User.findById({ _id: donardata[0].userid })

    var arr = preusersave.activity.saved.concat(userviewed.activity.viewed)

    var stringarr = []
    arr.forEach((e) => {
      stringarr.push(e.toString())
    });

    if (stringarr.includes(req.body.save, req.body.view) === false) {
      const donardata = await Donar_donate.find({ _id: req.body.save })
      const userview = await User.findByIdAndUpdate({ _id: donardata[0].userid }, { $push: { "activity.viewed": req.body.view } }) //saved user data
      const user = await User.findByIdAndUpdate({ _id: req.session.userid }, { $push: { "activity.saved": req.body.save } })// saved table data
      req.flash("message", "user saved");
      res.redirect("/searchdonar");
    } else {
      req.flash("message", "user already saved");
      res.redirect("/searchdonar");
    }
    
  } catch (error) {
      res.status(500).json({ error})
  }
})


// //deleting saved data
// app.post("/del",urlencodedParser,async(req,res) => {
//   try {
//     const donardata = await Donar_donate.find({ _id: req.body.save })

//     const userview = await User.findByIdAndUpdate({ _id: donardata[0].userid }, { $pull: { "activity.viewed": req.body.view } }) //saved user data
//     const user = await User.findByIdAndUpdate({ _id: req.session.userid }, { $pull: { "activity.saved": req.body.save } })// saved table data
//     res.status(200).json({ user, userview })
//   } catch (error) {
//     // res.status(500).json({ error })
//     console.log(error)
//   }
// })


// //404 page
app.get('*', function (req, res) {
  res.status(404).render('404');
});

module.exports = app;

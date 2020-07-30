// const express = require("express");
// var bodyParser = require("body-parser");
// const flash = require('connect-flash')
// const Donar_donate = require("../models/Donar_donate");
// const User = require('../models/userModel')
// const app = express();

// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// function auth(req,res,next){
//   if(req.session.userid){
//     next()
//   }else{
//     req.flash("message", "Please Login and Try again..!!");
//     res.redirect("/")
//   }
// }


// app.get("/",auth, async (req, res) => {
//   try {
//     // console.log(req.session.userid);
//     const user = await User.findOne({ _id: req.session.userid });
 
//      res.render("donardonate", { userset : user , message : req.flash('message') });
//   } catch (error) {
//     res.status(500).send();
//   }

// });

// app.post("/",urlencodedParser, async (req, res) => {
//   try { 
//     // console.log(req.body)
//     if (req.body.usertype === "donar"){
//       const check = await Donar_donate.find({ userid : req.body.userid})
      
//       if(check.length != 0){
//         req.flash('message', 'you already updated donar details')
//         res.redirect("/donardonate")
//         return
//       }else{
//         Donar_donate.create(req.body, (err, data) => {
//           if (err) throw err;
//           req.flash('message', 'Details updated sucessfully')
//           res.redirect("/donardonate")
//           return
//         });
//       }
//     }else{
//       req.flash('message' , 'you are not registered as a donar')
//       res.redirect("/donardonate")
//       return
//     }
    
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.post("/searchdonar",async (req,res) => {
//   try {
//     const donars = await Donar_donate.find({}).populate("userid")

//     var foundDonars = [];

//     donars.forEach((donar) => {
//       if (req.body.bloodgroup === donar.Bloodgroup){
//          foundDonars.push(donar)
//       }
//     })

//     if(foundDonars.length !== 0){
//       res.status(200).json({ data: foundDonars })
//     }else{
//       res.status(400).json({ err : "no donar found" , data : foundDonars })
//     }
      
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// })



// module.exports = app;

const express = require("express");
var bodyParser = require("body-parser");
const plasma_search_post = require("../models/plasma_search_post");
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
        if (req.session.userid) {
            userdata = await User.findById({ _id: req.session.userid });
            userset = true;
        } else {
            userset = false;
        }

        var regularpatientpost = await search_donar_post.find({ Donatstatus : 'active' })
        var plasmapatientpost = await plasma_search_post.find({ Donatstatus: 'active' })

        // console.log(plasmapatientpost)

        res.render("needs", { userset, userdata, regularpatientpost, plasmapatientpost });
    } catch (error) {
        res.status(500).json({ err: error });
        console.log(error)
    }
});


module.exports = app;
const express = require("express");
var bodyParser = require("body-parser");
const Donar_donate = require("../models/Donar_donate");
const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = app;

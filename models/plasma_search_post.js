const mongoose = require("mongoose")
const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;

const plasma_donar_schema = Schema({
    patientName : {
        type : String,
        required : true
    },
    bloodGroup : {
        type : String,
        required : true
    },
    usertype: {
        type: String,
        default: "plasma",
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    Donatstatus: {
        type: String,
        default: "active",
    },
    age : {
        type : String,
        required : true
    },
    donationdate : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: String,
        required: true
    },
    hospitalName : {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
        },
        coordinates: {
            type: [Number],
        },
        city: String,
    },
})

plasma_donar_schema.pre('save', async function (next) {
    const address = `${this.city},${this.district},${this.zipcode},${this.state}`;

    const Getlocation = await geocoder.geocode(address);

    this.location = {
        type: "Point",
        coordinates: [Getlocation[0].longitude, Getlocation[1].latitude],
        city: Getlocation[0].city,
    };

    next()
})

const plasma_donar = mongoose.model("plasma_search",plasma_donar_schema)

module.exports = plasma_donar
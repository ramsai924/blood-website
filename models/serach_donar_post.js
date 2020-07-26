const mongoose = require("mongoose")
const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;

const search_donar_schema = Schema({
    patientname : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    Bloodgroup: {
        type: String,
        required: [true, "Blood group required"],
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    Donatstatus: {
        type: String,
        default: "active",
    },
    PhoneNumber : {
        type : String
    },
    hospitalName : {
        type: String,
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
});

//Geo-location
search_donar_schema.pre('save', async function (next) {
    const address = `${this.city},${this.district},${this.zipcode},${this.state}`;

    const Getlocation = await geocoder.geocode(address);

    this.location = {
        type: "Point",
        coordinates: [Getlocation[0].longitude, Getlocation[1].latitude],
        city: Getlocation[0].city,
    };

    next()
})

const search_post = mongoose.model('search_donar_post', search_donar_schema)

module.exports = search_post;
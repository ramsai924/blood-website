const mongoose = require("mongoose")
const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);
const plasma_donar_schema = Schema({
    bloodGroup: {
        type: String,
        required: true
    },
    schematype :{
        type : String,
        default: "plasma",
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    Donatstatus: {
        type: String,
        default: "active",
    },
    recoveryDate: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    village : {
        type : String,
        required : true
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

plasma_donar_schema.index({ "location": 1, "userid": 1, "bloodGroup": 1 }, { unique: true });

plasma_donar_schema.pre('save', async function (next) {
    const address = `${this.village},${this.city},${this.district},${this.zipcode},${this.state}`;

    const Getlocation = await geocoder.geocode(address);

    this.location = {
        type: "Point",
        coordinates: [Getlocation[0].longitude, Getlocation[0].latitude],
        city: Getlocation[0].city,
    };

    next()
})

const plasma_donar = mongoose.model("plasma_post", plasma_donar_schema)

module.exports = plasma_donar
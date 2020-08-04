const mongoose = require("mongoose")
const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;

const hospital_adress_schema = Schema({
    hospitalName : {
        type: String,
        required: true
    },
    userid : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    hno : {
        type : String,
        required : true
    },
    city : {
        type: String,
        required: true
    },
    district : {
        type : String,
        required : true
    },
    zipcode: {
        type: String,
        required: true
    },
    state : {
        type: String,
        required: true
    },
    location : {
        type : {
            type : String
        },
        coordinates : {
            type : [Number]
        },
        city : String
    }
})

hospital_adress_schema.pre('save',async function(next){
    const address = `${this.city},${this.district},${this.zipcode},${this.state}`;

    var loc = await geocoder.geocode(address)

    this.location = {
        type : "Point",
        coordinates : [loc[0].longitude , loc[0].latitude],
        city: loc[0].city,
    }

    next()
})

const hopital_address = mongoose.model('hospital_address', hospital_adress_schema)

module.exports = hopital_address;
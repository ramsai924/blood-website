const mongoose = require("mongoose")
const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;

const hospital_blood_groups_schema  = Schema({
    bloodGroup : {
        type : String,
        required : true
    },
    status : {
        type: String,
        required: true
    },
    avalibleUnits : {
        type: String,
        required: true
    },
    address : {
        type : Schema.Types.ObjectId,
        ref: 'hospital_address'
    }
})

const hospital_blood_groups = mongoose.model("hospital_blood_data", hospital_blood_groups_schema)

module.exports = hospital_blood_groups;
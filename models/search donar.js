const mongoose = require('mongoose')

const search_donar_schema = new mongoose.Schema({
    bloodgroup : {
        type : String,
        required : [true,'Blood group required']
    },
    phoneNumber : {
        type : String,
        required : [true,"phone Number required"]
    },
    patientName : {
        type : String,
        required : [true,"patient name required"]
    },
    Hospital : {
        type : String,
    },
    village : {
        type : String
    },
    district : {
        type : String
    },
    zipcode : {
        type : String,
        required : [true,"zipcode required"]
    },
    state : {
        type : String
    },
    location : {
        type : {
            type : String
        },
        coordinates : {
            type : [Number]
        }
    },
    status : {
        type : String,
        default : 'active'
    }
})
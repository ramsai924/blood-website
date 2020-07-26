const mongoose = require("mongoose")
const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;

const Donar_donate_schema = Schema({
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
  hno: {
    type: String,
  },
  village: {
    type: String,
    required : true
  },
  zipcode: {
    type: String,
    required : true
  },
  mandal: {
    type: String,
    required : true
  },
  district: {
    type: String,
    required : true
  },
  state: {
    type: String,
    required : true
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
Donar_donate_schema.pre('save',async function(next){
    const address = `${this.hno},${this.village},${this.mandal},${this.district},${this.zipcode},${this.state}`;

    const Getlocation = await geocoder.geocode(address);

    this.location = {
      type: "Point",
      coordinates: [Getlocation[0].longitude, Getlocation[1].latitude],
      city: Getlocation[0].city,
    };

    next()
})

const Donar_donate = mongoose.model('Donar_donate', Donar_donate_schema)

module.exports = Donar_donate;
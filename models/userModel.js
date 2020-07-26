const mongoose =  require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const userSchema =Schema({
  name: {
    type: String,
    required: [true, "Name could not be empty"],
  },
  email: {
    type: String,
    required: [true, "Email could not be empty"],
  },
  phoneNumber: {
    type: String,
    required: [true, "phone Number could not be empty"],
    min : 10
  },
  usertype : {
    type : String,
    required : true
  },
  password: {
    type: String,
    required: [true, "Password could not be empty"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  activity : {
        saved : {
          type: [Schema.Types.ObjectId],
          ref: "Donar_donate",
        },
        viewed : {
          type: [Schema.Types.ObjectId],
          ref: "user",
        }
  }
});

//Hash password
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

const User = mongoose.model('user',userSchema)

module.exports = User;


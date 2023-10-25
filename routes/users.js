const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/medical");

const userSchema = mongoose.Schema({
  username: String,
  age: Number,
  password: String,
  medicine: [
    {type: mongoose.Schema.Types.ObjectId, ref: "medicine"}
  ],
  phone:String,
  email: String,
  care:{
    type:String,
    default:null,
  },
  carenumber:{
    type:String,
    default:null
  }
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    medname: {
       type: String,
    },
    day: {
        type: Number,
    },
    hrs:{
        type:Number,
    },
    minutes:{
        type:Number,
    },
    services:{
        type:String,
    },
    phone:[
        {type:String}
    ],
    email:[
        {type:String}
    ],
    message:{
        type:String,
    },
})

module.exports = mongoose.model("medicine", medicineSchema);
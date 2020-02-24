const mongoose = require('mongoose');
mongoose.model("Customer",{

    name:{
        type: String,
        require: true
    },
    age:{
        type: String,
        require: true
    },
    address:{
        type: Number,
        require: false
    } 
})
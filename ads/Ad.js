const mongoose = require('mongoose');

mongoose.model("Ad",{

    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    } 
})
const mongoose = require('mongoose');


const autoritySchema=  new mongoose.Schema({
    uid: {type : String, required : true, unique : true},
    label : {type : String, required : true, unique : true},
});

module.exports = mongoose.model('authority', autoritySchema)
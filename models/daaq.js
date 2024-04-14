const mongoose = require('mongoose');

const daaqSchema=  new mongoose.Schema({
    uid: {type : String, required : true},
    label : {type : String, required : true},
    readDAAQ : { type : String, required : true},
    updateDAAQ : { type : String, required : true}

});

module.exports = mongoose.model('daaq', daaqSchema)
const mongoose = require('mongoose');


const userGroupSchema=  new mongoose.Schema({
    uid: {type : String, required : true, unique : true},
    label : {type : String, required : true, unique : true},
    groupAuthorities : [{ type: mongoose.Schema.Types.ObjectId, ref:'authority'}],
    grouupDAAQs : [{ type: mongoose.Schema.Types.ObjectId, ref:'daaq'}],
});

module.exports = mongoose.model('userGroup', userGroupSchema)
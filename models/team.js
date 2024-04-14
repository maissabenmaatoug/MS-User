const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
    uid: {type : String, required : true},
    description : {type : String, required : true},
    manager : { type: mongoose.Schema.Types.ObjectId, ref:'user' }

});


module.exports = mongoose.model('team', teamSchema)
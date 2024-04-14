const mongoose = require('mongoose');

const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username : {type : String,required: true ,unique: true},
    firstName : {type : String,required: true},
    lastName : {type : String,required: true},
    email : {type : String,required: true ,unique: true},
    accountExpired : {type : Boolean,required: true},
    accountLocked : {type : Boolean,required: true},
    phoneNumber : {type : String,required: true},
    password :{type : String,required: true},
    passwordExpirationDate : {type : Date ,required: true},
    personalDAAQs :  [{ type: mongoose.Schema.Types.ObjectId, ref:'daaq' }],
    personalAuthorities: [{ type: mongoose.Schema.Types.ObjectId, ref:'authority' }],
    userGroups: [{type: mongoose.Schema.Types.ObjectId, ref:'userGroup' }],
    team : {type: mongoose.Schema.Types.ObjectId, ref:'team' },
})
const User = mongoose.model('user', userSchema);

//validate register user

  function validateRegister(obj){
    const schema = Joi.object({
        username : Joi.string().min(2).required(),
        firstName : Joi.string().min(2).required(),
        lastName : Joi.string().min(2).required(),
        email : Joi.string().min(5).required().email(),
        accountExpired : Joi.boolean().required(),
        accountLocked : Joi.boolean().required(),
        phoneNumber : Joi.number().integer().required(),
        password : Joi.string().min(5).required(),
        passwordExpirationDate : Joi.date().required(),
      
    })
    return schema.validate(obj)
 }
 //validate update user
 function validateUpdate(obj){
    const schema = Joi.object({
        username : Joi.string().min(2),
        firstName : Joi.string().min(2),
        lastName : Joi.string().min(2),
        email : Joi.string().min(5).email(),
        accountExpired : Joi.boolean(),
        accountLocked : Joi.boolean(),
        phoneNumber : Joi.number().integer(),
        // password : Joi.string().min(5),
        passwordExpirationDate : Joi.date(),
      
    })
    return schema.validate(obj)
 }

 //validate login user
function validateLogin(obj){
    const schema = Joi.object({
        username : Joi.string().min(2).required(),
        password : Joi.string().min(5).required(),
      
    })
    return schema.validate(obj)
 }
//validate update password
function validateUpdatePassword(obj){
    const schema = Joi.object({
        password : Joi.string().min(5).required(),
      
    })
    return schema.validate(obj)
}
 module.exports = {
     User: User,
     validateRegister: validateRegister,
     validateUpdate: validateUpdate,
     validateLogin: validateLogin,
     validateUpdatePassword: validateUpdatePassword
 };
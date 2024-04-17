const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require('passport');
const User = require('../models/user');

 const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
  algorithm: 'HS256'
 }
passport.use(new JwtStrategy(opts, async(jwt_payload, done)=>{
    try {
        const user = await User.User.findOne({_id: jwt_payload.userId});
        user ? done(null, user) : done(null, false);
    } catch (error) {
       console.log(error); 
    }
    }));
 
module.exports= isAuth=()=> passport.authenticate('jwt', { session: false });






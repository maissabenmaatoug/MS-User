const {User,validateRegister,validateUpdate ,validateLogin,validateUpdatePassword} = require('../models/user');
const Authority = require('../models/autority');
const DAAQ = require('../models/daaq');
const generateRandomUID = require('../utils/utilities')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.CreateUser = async(req,res)=>{
    const {username,firstName,lastName,email,accountExpired,accountLocked,phoneNumber,
        password,passwordExpirationDate, personalDAAQs,
        personalAuthorities,
        userGroups,
        team} = req.body;
    try {
        let errors = [];
      const {error}= validateRegister({username,firstName,lastName,email,accountExpired,accountLocked,phoneNumber,
        password,passwordExpirationDate, });
      if(error){
       errors.push( error.details[0].message );
      }
       
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            errors.push('A User with this email already exists');
        }
        if (personalAuthorities && personalAuthorities.length > 0) {
          const uniqueAuthorities = new Set(personalAuthorities); 
          if (uniqueAuthorities.size !== personalAuthorities.length) {
            errors.push('Duplicate authorities found');
          }}

        if (personalDAAQs && personalDAAQs.length > 0) {
          const uniqueDAAQs = new Set(personalDAAQs); 
          if (uniqueDAAQs.size !== personalDAAQs.length) {
            errors.push('Duplicate DAAQs found');
          }}

        if (userGroups && userGroups.length > 0) {
          const uniqueUserGroups = new Set(userGroups); 
          if (uniqueUserGroups.size !== userGroups.length) {
            errors.push('Duplicate userGroups found');
          }}
          const today = new Date();
        const passwordExpDate = new Date(passwordExpirationDate);
        if (passwordExpDate <= today) {
            errors.push('Password expiration date must be greater than today\'s date');
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors });
          }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            firstName,
            lastName,
            email,
            accountExpired,
            accountLocked,
            phoneNumber,
            password:hashedPassword,
            passwordExpirationDate,
            personalDAAQs,
            personalAuthorities,
            userGroups,
            team
        })
        await newUser.save()
        res.status(201).json({ newUser })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }

};

exports.UpdateUser =async (req, res) => {

  const idUser = req.params.id
  const {username,firstName,lastName,email,accountExpired,accountLocked,phoneNumber,
   passwordExpirationDate, personalDAAQs,
    personalAuthorities,
    userGroups,
    team} = req.body;
  try {
    let errors = [];
    const {error}= validateUpdate({username,firstName,lastName,email,accountExpired,accountLocked,phoneNumber,
     passwordExpirationDate, });
    if(error){
     errors.push(error.details[0].message );
    }
    let user = await User.findOne({ _id: idUser })
    if (!user) {
      errors.push('User not found')
    }
  const existingUserWithEmail = await User.findOne({ email: email });
    if (existingUserWithEmail && (!existingUserWithEmail._id.equals(idUser))) {
      errors.push('Email already exists for another user');
    }
    if (personalAuthorities && personalAuthorities.length > 0) {
      const uniqueAuthorities = new Set(personalAuthorities); 
      if (uniqueAuthorities.size !== personalAuthorities.length) {
        errors.push('Duplicate authorities found');
      }}

    if (personalDAAQs && personalDAAQs.length > 0) {
      const uniqueDAAQs = new Set(personalDAAQs); 
      if (uniqueDAAQs.size !== personalDAAQs.length) {
        errors.push('Duplicate DAAQs found');
      }}

    if (userGroups && userGroups.length > 0) {
      const uniqueUserGroups = new Set(userGroups); 
      if (uniqueUserGroups.size !== userGroups.length) {
        errors.push('Duplicate userGroups found');
      }}
      const today = new Date();
      const passwordExpDate = new Date(passwordExpirationDate);
      if (passwordExpDate <= today) {
          errors.push('Password expiration date must be greater than today\'s date');
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }
    let updatedUser = await User.findOneAndUpdate(
      { _id: idUser },
      { $set: { username,firstName,lastName,email,accountExpired,accountLocked,phoneNumber,
      passwordExpirationDate, personalDAAQs,
        personalAuthorities,
        userGroups,
        team} },
      { new: true },
    )

    res.status(200).json({ updatedUser })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }


};

exports.GetUser = async (req, res) => {
  const idUser = req.params.id
  try {
    let errors = []
    const user = await User.findById({ _id: idUser })
    if (!user) {
      errors.push('User not found')
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }
    res.status(200).json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
};
exports.LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    let errors = [];
    const {error}= validateLogin({username,password });
     if(error){
      errors.push(error.details[0].message );
     }
    let user = await User.findOne({ username});
    if (!user) {
      errors.push('User not found')
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      errors.push('Invalid password')
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }
    const token = jwt.sign(
      { userUid: user.uid, username: user.username},
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).send({
      userId: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }

};

exports.UpdatePassword = async (req, res) => {
  const idUser = req.params.id
  const { password } = req.body;
  try {
    let errors = [];
    const {error}= validateUpdatePassword({password });
     if(error){
      errors.push(error.details[0].message );
     }
    let user = await User.findById({ _id: idUser });
    if (!user) {
      errors.push('User not found')
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let updatedUser = await User.findOneAndUpdate(
      { _id: idUser },
      { $set: { password: hashedPassword } },
      { new: true },
    )
    res.status(200).json({ updatedUser })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }

};
exports.AddAuthorityToUser = async (req, res) => {
  const idUser = req.params.id
  const authorityUid = req.body.uid;
  let errors = [];
  try {
    let dbChecks = [];
    let existingAuthority = await Authority.findOne({ uid:authorityUid });

    if (!existingAuthority) {
        errors.push('Authority does not exist');
    }

    const user = await User.findOne({
      _id: idUser,
    });
    if (!user) errors.push("User not found");
    const authorityExists = user.personalAuthorities.some(authority => authority.equals(existingAuthority._id));
    if (authorityExists) {
      errors.push('Authority already exists for this user');}
    user.personalAuthorities.push(existingAuthority);
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter((result) => result !== null));

    if (errors.length > 0) return res.status(400).json({ errors });

    await Promise.all([existingAuthority.save(), user.save()]);

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


exports.RemoveAuthorityFromUser = async (req, res) => {
  const idUser = req.params.id
  const uidAuthority  = req.body.uid;

  let errors = [];
  try {
    const user = await User.findOne({ _id: idUser});
    if (!user)
      errors.push("User not found." );
    const authority = await Authority.findOne({ uid: uidAuthority });
    if (!authority)
      errors.push("Authority not found.");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    user.personalAuthorities.pull(authority._id);
    await user.save();
    return res.status(200).json({
      message: "Authority removed successfully from user.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }


};
 exports.AddDAAQToUser = async (req, res) => {
  const idUser = req.params.id
  const uidDAAQ = req.body.uid;
  let errors = [];
  try {
   
    const user = await User.findOne({
      _id: idUser,
    });
    if (!user) errors.push("User not found");
    const daaq= await DAAQ.findOne({
      uid: uidDAAQ
    });
    if(!daaq) errors.push("DAAQ not found");
    if (errors.length > 0) return res.status(400).json({ errors });

    user.personalDAAQs.push(daaq);
    user.save();
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }

};


exports.RemoveDAAQFromUser = async (req, res) => {
  const idUser = req.params.id
  const uidDAAQ  = req.body.uid;

  let errors = [];
  try {
    const user = await User.findOne({ _id: idUser});
    if (!user)
      errors.push("User not found." );
    const daaq = await DAAQ.findOne({ uid: uidDAAQ });
    if (!daaq)
      errors.push("DAAQ not found.");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    user.personalDAAQs.pull(daaq._id);
    await user.save();
    return res.status(200).json({
      message: "DAAQ removed successfully from user.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }

};
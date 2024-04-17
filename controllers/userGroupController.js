const UserGroup = require('../models/userGroup')
const generateRandomUID = require('../utils/utilities')
const Authority = require('../models/autority');
const DAAQ = require('../models/daaq');
exports.CreateUserGroup = async (req, res) => {
    const { label, groupAuthorities, grouupDAAQs } = req.body
    const uid = generateRandomUID('P')
    try {
        let errors = [];
        let existingUserGroup= await UserGroup.findOne({ label });

        if (existingUserGroup) {
            errors.push('Label already exists');
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors });
          }
        const newUserGroup = new UserGroup({
            uid,
            label,
            groupAuthorities,
            grouupDAAQs,
        })
        await newUserGroup.save()
        res.status(201).json({ newUserGroup })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
};

exports.UpdateUserGroup = async (req, res) => {
    const uidUserGroup = req.params.uid;
    const { label, groupAuthorities, grouupDAAQs } = req.body;
    try {
        let errors = [];
        let userGroup = await UserGroup.findOne({ uid: uidUserGroup })
        if (!userGroup) {
            errors.push('UserGroup not found')
        }
        const existingUserGroupWithLabel = await UserGroup.findOne({ label: label });
        if (existingUserGroupWithLabel && existingUserGroupWithLabel.uid !== uidUserGroup) {
            errors.push('Label already exists for another userGroup')
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }
        let updatedUserGroup = await UserGroup.findOneAndUpdate(
            { uid: uidUserGroup },
            { $set: { label, groupAuthorities, grouupDAAQs } },
            { new: true },
        )
        res.status(200).json({ updatedUserGroup })
    } catch (error) {
        console.log(error)}
    };

exports.GetUserGroup = async (req, res) => {
    const uidUserGroup = req.params.uid
    try {
        let errors = [];
        const userGroup = await UserGroup.findOne({ uid: uidUserGroup })
        .populate({"path": "groupAuthorities"})
        .populate({"path": "grouupDAAQs"});
        if (!userGroup) {
            errors.push('UserGroup not found')
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }
        res.status(200).json({ userGroup })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
};

exports.AddAuthorityToUserGroup = async (req, res) => {
    const uidUserGroup = req.params.uid;
    const authorityUid = req.body.uid;
    let errors = []
    
    try {
         let dbChecks = []
        let existingAuthority = await Authority.findOne({ uid: authorityUid })

        if (!existingAuthority) {
            dbChecks.push('Authority does not exist');
        }

        const userGroup = await UserGroup.findOne({ uid: uidUserGroup })
        if (!userGroup) dbChecks.push("UserGroup not found")
         if(userGroup && existingAuthority){
        const authorityExists = userGroup.groupAuthorities.some(authority => authority.equals(existingAuthority._id));
        if (authorityExists) {
          errors.push('Authority already exists for this user group');}
          userGroup.groupAuthorities.push(existingAuthority);

        }
        const checkResults = await Promise.all(dbChecks);
        errors = errors.concat(checkResults.filter((result) => result !== null));
    
        if (errors.length > 0) return res.status(400).json({ errors });
    
        await Promise.all([existingAuthority.save(), userGroup.save()]);
    
        res.status(200).json({ userGroup });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
};
 exports.RemoveAuthorityFromUserGroup = async (req, res) => {
    const uidUserGroup = req.params.uid;
    const uidAuthority = req.body.uid;
    let errors = [];
    let dbChecks = [];
    try {
        const userGroup = await UserGroup.findOne({ uid: uidUserGroup })
        if (!userGroup) dbChecks.push("UserGroup not found.")
        const authority = await Authority.findOne({ uid: uidAuthority })
        if (!authority) dbChecks.push("Authority not found.")
        
        if(userGroup && authority){
        const authorityExists = userGroup.groupAuthorities.some(authority => authority.equals(authority._id));
        if (!authorityExists) {
          dbChecks.push('Authority does not exist for this user group');}
        }
        const checkResults = await Promise.all(dbChecks)
        errors = errors.concat(checkResults.filter((result) => result !== null))
        if (errors.length > 0) return res.status(400).json({ errors })
        
    userGroup.groupAuthorities.pull(authority._id);
    await userGroup.save();
    res.status(200).json({ message: "Authority deleted successfully from UserGroup" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
 }; 
 
 exports.AddDAAQToUserGroup = async (req, res) => {
    const uidUserGroup = req.params.uid
    const uidDAAQ = req.body.uid;
    let errors = [];
    let dbChecks = [];
    try {
     
      const userGroup = await UserGroup.findOne({
        uid: uidUserGroup,
      });
      if (!userGroup) dbChecks.push("UserGroup not found");

      const daaq= await DAAQ.findOne({
        uid: uidDAAQ
      });
      if(!daaq) dbChecks.push("DAAQ not found");
      if(userGroup && daaq){
      const daaqExists = userGroup.grouupDAAQs.some(daaqq => daaqq.equals(daaq._id));
      if (daaqExists) {
        errors.push('DAAQ already exists for this user group');
    }
    }
      const checkResults = await Promise.all(dbChecks);
      errors = errors.concat(checkResults.filter((result) => result !== null));
      if (errors.length > 0) return res.status(400).json({ errors });
  
      userGroup.grouupDAAQs.push(daaq);
      userGroup.save();

      
      res.status(200).json({ userGroup });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  
  };


exports.RemoveDAAQFromUserGroup = async (req, res) => {
    const uidUserGroup = req.params.uid;
    const uidDAAQ = req.body.uid;
    let errors = [];
    let dbChecks=[];
    try {
        const userGroup = await UserGroup.findOne({ uid: uidUserGroup })
        if (!userGroup) dbChecks.push("UserGroup not found.")
        const daaq = await DAAQ.findOne({ uid: uidDAAQ })
        if (!daaq) dbChecks.push("DAAQ not found.")
        if(userGroup && daaq){
        const daaqExists = userGroup.grouupDAAQs.some(daaqq => daaqq.equals(daaq._id));
        if (!daaqExists) {
            dbChecks.push('DAAQ does not exist for this user group');}
        }
        const checkResults = await Promise.all(dbChecks)
        errors = errors.concat(checkResults.filter((result) => result !== null))

    if (errors.length > 0) return res.status(400).json({ errors })

    userGroup.grouupDAAQs.pull(daaq._id);
    await userGroup.save();
    res.status(200).json({ message: "DAAQ deleted successfully from UserGroup" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
 };
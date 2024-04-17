const Team = require('../models/team');
const generateRandomUID = require('../utils/utilities')
const User = require('../models/user');
console.log("🚀 ~ User:", User.User)
exports.CreateTeam = async (req, res) => {
    const description = req.body.description;
    const managerId = req.body.manager;
    const uid = generateRandomUID('T');
    try {
        let errors = [];
        let existingUser = await User.User.findOne({_id:managerId});
        if (!existingUser) {
            errors.push( "User not found" );
        }       
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }
        const newTeam = new Team({
            uid,
            description,
            manager: managerId
        })
        await newTeam.save();
        res.status(201).json({ newTeam })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
};

exports.GetTeam = async (req, res) => {
    const uidTeam = req.params.uid
    try {
        let errors = []
        const team = await Team.findOne({ uid: uidTeam }).populate('manager');
        if (!team) {
            errors.push('Team not found')
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }
        res.status(200).json({ team })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
};
exports.UpdateTeam = async (req, res) => {
    const uidTeam = req.params.uid;
    const {  description, managerId } = req.body;
    try {
        let errors = []
        let dbChecks = [];
        let existingUser = await User.User.findOne({_id:managerId});
        if (!existingUser) {
            dbChecks.push( "User not found" );
        } 
        const team = await Team.findOneAndUpdate(
         { uid: uidTeam }, 
        { $set:{description, manager: managerId}}, 
         { new: true });
        if (!team) {
            dbChecks.push('Team not found')
        }
        const checkResults = await Promise.all(dbChecks)
        errors = errors.concat(checkResults.filter((result) => result !== null))
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }
        res.status(200).json({ team })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
};

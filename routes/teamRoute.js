const express = require('express')
const router = express.Router()
const { CreateTeam, GetTeam, UpdateTeam,} = require('../controllers/teamController');
router.post('/createTeam',CreateTeam);
router.get('/getTeam/:uid',GetTeam);
router.put('/updateTeam/:uid',UpdateTeam);












module.exports = router;
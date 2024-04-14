const express = require('express');
const { CreateDAAQ, UpdateDAAQ, GetDAAQ } = require('../controllers/daaqController');
const router = express.Router()

router.post('/createDAAQ',CreateDAAQ);
router.put('/updateDAAQ/:uid',UpdateDAAQ);
router.get('/getDAAQ/:uid',GetDAAQ);




module.exports = router;
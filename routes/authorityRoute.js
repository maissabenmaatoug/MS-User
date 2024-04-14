const express = require('express')
const { CreateAuthority, UpdateAuthority, GetAuthority } = require('../controllers/authorityController')
const router = express.Router()
router.post('/createAuthority',CreateAuthority);
router.put('/updateAuthority/:uid',UpdateAuthority);
router.get('/getAuthority/:uid',GetAuthority);













module.exports = router
const express = require('express')
const { CreateUserGroup,  GetUserGroup, UpdateUserGroup, AddAuthorityToUserGroup, RemoveAuthorityFromUserGroup, AddDAAQToUserGroup, RemoveDAAQFromUserGroup } = require('../controllers/userGroupController');
const router = express.Router()
router.post('/createUserGroup',CreateUserGroup);
router.get('/getUserGroup/:uid',GetUserGroup);
router.put('/updateUserGroup/:uid',UpdateUserGroup);
router.post('/addAuthorityToUserGroup/:uid',AddAuthorityToUserGroup);
router.delete('/removeAuthorityFromUserGroup/:uid', RemoveAuthorityFromUserGroup);
router.post('/addDAAQToUserGroup/:uid',AddDAAQToUserGroup);
router.post('/removeDAAQFromUserGroup/:uid',RemoveDAAQFromUserGroup);










module.exports = router;
const express = require('express')
const router = express.Router()
const { CreateUser, GetUser, UpdateUser, LoginUser, UpdatePassword, AddAuthorityToUser, RemoveAuthorityFromUser, AddDAAQToUser, RemoveDAAQFromUser,  } = require('../controllers/userController');
router.post('/createUser', CreateUser);
router.get('/getUser/:id', GetUser);
router.put('/updateUser/:id', UpdateUser);
router.post('/loginUser', LoginUser);
router.put('/updatePassword/:id', UpdatePassword);
router.post ('/addAuthorityToUser/:id', AddAuthorityToUser);
router.delete('/removeAuthorityFromUser/:id', RemoveAuthorityFromUser);
router.post('/addDAAQToUser/:id',AddDAAQToUser);
router.post ('/removeDAAQFromUser/:id', RemoveDAAQFromUser);












module.exports = router;
const express = require('express')
const router = express.Router()
const isAuth = require('../middlewares/passport');

const { CreateUser, GetUser, UpdateUser, LoginUser, UpdatePassword, AddAuthorityToUser, RemoveAuthorityFromUser, AddDAAQToUser, RemoveDAAQFromUser,  } = require('../controllers/userController');
router.post('/createUser', CreateUser);
router.get('/getUser/:id',isAuth(),GetUser); 
router.put('/updateUser/:id', isAuth(),UpdateUser); 
router.post('/loginUser', LoginUser);
router.put('/updatePassword/:id',isAuth(), UpdatePassword); 
router.post ('/addAuthorityToUser/:id',isAuth(), AddAuthorityToUser); 
router.delete('/removeAuthorityFromUser/:id',isAuth(), RemoveAuthorityFromUser);
router.post('/addDAAQToUser/:id',isAuth(),AddDAAQToUser); 
router.post ('/removeDAAQFromUser/:id',isAuth(), RemoveDAAQFromUser); 












module.exports = router;
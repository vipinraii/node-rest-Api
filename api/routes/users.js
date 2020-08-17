const express =require('express');

const router =express.Router();
const checkAuth= require('../middleware/check-auth');
const usercontroller = require('../controllers/users');
router.post('/signup',usercontroller.users_signup);

router.post('/login',usercontroller.users_login);

router.delete('/:userId',usercontroller.user_delete)


module.exports= router; 
const routerUsers = require('express').Router();
const { getMyInfo, swapProfile } = require('../controllers/user');
const { validationGetUser, validationUpdateUser } = require('../middlewares/validation');

routerUsers.get('/me', validationGetUser, getMyInfo);
routerUsers.patch('/me', validationUpdateUser, swapProfile);

module.exports = routerUsers;

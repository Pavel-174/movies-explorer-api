const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMyInfo, swapProfile } = require('../controllers/user');

routerUsers.get('/me', getMyInfo);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), swapProfile);

module.exports = routerUsers;

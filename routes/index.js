const routerCommon = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFound = require('../errors/NotFound');
const routerUsers = require('./user');
const routerMovies = require('./movie');

routerCommon.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

routerCommon.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routerCommon.use('/users', auth, routerUsers);
routerCommon.use('/movies', auth, routerMovies);

routerCommon.use('*', auth, (req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

module.exports = routerCommon;

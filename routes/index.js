const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFound = require('../errors/NotFound');
const routerUsers = require('./user');
const routerMovies = require('./movie');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

module.exports = router;

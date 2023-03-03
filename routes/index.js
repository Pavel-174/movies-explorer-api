const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFound = require('../errors/NotFound');
const routerUsers = require('./user');
const routerMovies = require('./movie');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);
router.use('/users', routerUsers);
router.use('/movies', routerMovies);

router.use(auth, routerUsers);
router.use(auth, routerMovies);

router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;

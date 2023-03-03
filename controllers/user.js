const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new AuthError('Неправильная почта или пароль');
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильная почта или пароль');
          } const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch(next);
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        return next(new NotFound('Объект не найден'));
      } return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

const swapProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с данным email уже существует');
      } return User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true },
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return next(new NotFound('Объект не найден'));
          } return res.send({
            name: updatedUser.name,
            email: updatedUser.email,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } return next(err);
    });
};

module.exports = {
  getMyInfo,
  swapProfile,
  createUser,
  login,
};

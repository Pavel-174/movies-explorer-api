const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.storeMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newMovie) => {
      if (!newMovie) {
        return next(new NotFound('Объект не найден'));
      } return res.send({ newMovie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } return next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => { res.send(movies); })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie == null) {
        throw new NotFound('Объект не найден');
      } else if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError('Доступ ограничен');
      } return Movie.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => {
          res.send({ removedMovie });
        });
    })
    .catch(next);
};

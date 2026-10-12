import rawMovies from '../../data/movies.json';

export function getAllMovies() {
  return rawMovies;
}

export function filterMovies(movies, {
  search = '',
  genre = 'ALL',
  minRating = 0,
  minYear = 1970,
  maxYear = 2024,
  sortBy = 'rating-desc'
} = {}) {
  return movies
    .filter(movie => {
      if (search && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesDirector = movie.director.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDirector) {
          return false;
        }
      }

      if (genre && genre !== 'ALL' && movie.genre !== genre) {
        return false;
      }

      if (typeof minRating === 'number' && movie.rating < minRating) {
        return false;
      }

      if (typeof minYear === 'number' && movie.year < minYear) {
        return false;
      }

      if (typeof maxYear === 'number' && movie.year >= maxYear) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
}

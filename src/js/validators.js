import isURL from 'validator/lib/isURL';

const isRss = (data) => {
  const parser = new DOMParser();
  const result = parser.parseFromString(data, 'application/xml');
  return result.querySelector('rss');
};

export default {
  isURL,
  isRss,
};

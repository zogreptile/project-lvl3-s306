import isURL from 'validator/lib/isURL';

const isRss = xml => xml.getElementsByTagName('rss');

export default {
  isURL,
  isRss,
};

export default (str) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, 'application/xml');
};

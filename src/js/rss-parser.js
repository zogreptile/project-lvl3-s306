const getXml = (str) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, 'application/xml');
};

export const getChannelInfo = (str) => {
  const xml = getXml(str);
  const title = xml.querySelector('title').textContent;
  const description = xml.querySelector('description').textContent;

  return {
    title,
    description,
  };
};

export const getChannelPosts = (str) => {
  const xml = getXml(str);
  const items = [...xml.getElementsByTagName('item')];

  return items.map((post) => {
    const id = post.querySelector('guid').textContent;
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;

    return {
      id,
      title,
      description,
      link,
    };
  });
};

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
// import WatchJS from 'melanke-watchjs';
import './styles/styles.css';
import parseXml from './xml-parser';

// const { watch } = WatchJS;
const rssForm = document.getElementById('find-rss-form');
const rssInput = document.getElementById('find-rss-input');
const rssFeeds = document.getElementById('feeds');
const rssPosts = document.getElementById('posts');

const requestFeed = url => axios.get(`https://thingproxy.freeboard.io/fetch/${url}`);
const isRss = xml => xml.getElementsByTagName('rss')[0];

const renderFeedChannel = (xml) => {
  const title = xml.querySelector('title').textContent;
  const description = xml.querySelector('description').textContent;
  const item = document.createElement('li');

  item.className = 'list-group-item pl-0';
  item.innerHTML = `
    <div>${title}</div>
    <small>${description}</small>
  `;

  rssFeeds.prepend(item);
};

const renderFeedPosts = (xml) => {
  const postItems = xml.getElementsByTagName('item');

  [].forEach.call(postItems, (xmlPost) => {
    const post = document.createElement('li');
    const title = xmlPost.querySelector('title').textContent;
    const link = xmlPost.querySelector('link').textContent;

    post.className = 'list-group-item pl-0';
    post.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;

    rssPosts.prepend(post);
  });
};

const state = {
  rssInput: 'invalid',
  feeds: new Set(),
};

const inputStates = [
  {
    state: 'valid',
    check: value => isURL(value),
    action: input => input.classList.remove('is-invalid'),
  },
  {
    state: 'invalid',
    check: value => !isURL(value),
    action: input => input.classList.add('is-invalid'),
  },
];

rssInput.addEventListener('input', () => {
  const { state: newState, action } = inputStates.find(({ check }) => check(rssInput.value));
  state.rssInput = newState;
  action(rssInput);
});

rssForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (state.rssInput === 'valid' && !state.feeds.has(rssInput.value)) {
    state.feeds.add(rssInput.value);

    requestFeed(rssInput.value)
      .then((res) => {
        const parsedXml = parseXml(res.data);

        if (isRss(parsedXml)) {
          renderFeedChannel(parsedXml);
          renderFeedPosts(parsedXml);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});


import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import * as rss from './js/rss-parser';
import initState from './js/state';
import validator from './js/validators';
import initWatchers from './js/watchers';

const state = initState();
initWatchers(state);

const requestFeed = url => axios.get(`https://thingproxy.freeboard.io/fetch/${url}`);

const updateFeed = (getChannels) => {
  const channels = getChannels();
  const urls = channels.map(el => el.url);
  const requestedData = urls.map(url => requestFeed(url));
  const isAddedPost = (post, posts) => posts.find(el => el.id === post.id);

  axios.all(requestedData)
    .then((res) => {
      const recievedData = res.reduce((acc, chunk) =>
        [...rss.getChannelPosts(chunk.data), ...acc], []);
      const newPosts = recievedData.filter(post => !isAddedPost(post, state.getPosts()));
      state.addPosts(newPosts);

      setTimeout(updateFeed, 5000, getChannels);
    })
    .catch((err) => {
      console.log(err);
      setTimeout(updateFeed, 5000, getChannels);
    });
};

const app = () => {
  const rssForm = document.getElementById('find-rss-form');
  const rssInput = document.getElementById('find-rss-input');

  rssInput.addEventListener('input', () => {
    const inputValue = rssInput.value.trim();

    if (inputValue === '') {
      state.setFormState({
        isValid: true,
        inputValue,
        notification: '',
        isSubmitDisabled: true,
      });
    } else if (state.hasChannel(inputValue)) {
      state.setFormState({
        isValid: false,
        inputValue,
        notification: 'Feed already added!',
        isSubmitDisabled: true,
      });
    } else if (!validator.isURL(inputValue)) {
      state.setFormState({
        isValid: false,
        inputValue,
        notification: 'Invalid URL!',
        isSubmitDisabled: true,
      });
    } else {
      state.setFormState({
        isValid: true,
        inputValue,
        notification: '',
        isSubmitDisabled: false,
      });
    }
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.setFormState({ notification: 'Fetching data...', isSubmitDisabled: true });

    requestFeed(rssInput.value)
      .then((res) => {
        if (validator.isRss(res.data)) {
          const { title, description } = rss.getChannelInfo(res.data);
          const channelPosts = rss.getChannelPosts(res.data);

          state.setFormState({ notification: '', inputValue: '', isSubmitDisabled: true });
          state.addChannel(rssInput.value, title, description);
          state.addPosts(channelPosts);
        } else {
          state.setFormState({ notification: 'Requested resource is not RSS!', isSubmitDisabled: false });
        }
      })
      .catch((err) => {
        state.setFormState({ notification: err, isSubmitDisabled: false });
      });
  });

  const $modal = $('#preview-modal');
  $modal.on('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const { postId } = button.dataset;
    const post = state.getPosts().find(el => el.id === postId);

    const stripTags = str => str.replace(/<\/?[^>]+(>|$)/g, '');

    $modal.find('.modal-title').text(post.title);
    $modal.find('.modal-body').text(stripTags(post.description));
    $modal.find('.js-visit-site').attr('href', post.link);
  });

  updateFeed(state.getChannels.bind(state));
};

app();

import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './styles/styles.css';
import * as rss from './js/rss-parser';
import * as state from './js/state';
import validate from './js/validators';
import initWatchers from './js/watchers';

const requestFeed = url => axios.get(`https://thingproxy.freeboard.io/fetch/${url}`);

const app = () => {
  initWatchers();

  const rssForm = document.getElementById('find-rss-form');
  const rssInput = document.getElementById('find-rss-input');

  rssInput.addEventListener('input', () => {
    if (rssInput.value === '') {
      state.setFormState({
        isValid: false,
        inputValue: rssInput.value,
      });
    } else if (state.hasChannel(rssInput.value)) {
      state.setFormState({
        isValid: false,
        inputValue: rssInput.value,
        notification: 'Feed already added!',
      });
    } else if (!validate.isURL(rssInput.value)) {
      state.setFormState({
        isValid: false,
        inputValue: rssInput.value,
        notification: 'Invalid URL!',
      });
    } else {
      state.setFormState({
        isValid: true,
        inputValue: rssInput.value,
        notification: '',
      });
    }
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.setFormState({ notification: 'Fetching data...' });

    requestFeed(rssInput.value)
      .then((res) => {
        const xml = rss.getXml(res.data);

        if (validate.isRss(xml)) {
          const { title, description } = rss.getChannelInfo(xml);
          const channelPosts = rss.getChannelPosts(xml);

          state.setFormState({ notification: '', inputValue: '' });
          state.addChannel(rssInput.value, title, description);
          state.addPosts(channelPosts);
        }
      })
      .catch((err) => {
        state.setFormState({ notification: err });
      });
  });

  const $modal = $('#preview-modal');
  $modal.on('show.bs.modal', (event) => {
    const $button = $(event.relatedTarget);
    const postId = $button.data('post-id');
    const post = state.getPosts().find(el => el.id === postId);

    const stripTags = str => str.replace(/<\/?[^>]+(>|$)/g, '');

    $modal.find('.modal-title').text(post.title);
    $modal.find('.modal-body').text(stripTags(post.description));
    $modal.find('.modal-footer .btn-link').attr('href', post.link);
  });
};

app();

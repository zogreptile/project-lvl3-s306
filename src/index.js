import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './styles/styles.css';
import * as rss from './js/rss-parser';
import state from './js/state';
import validate from './js/validators';
import initWatchers from './js/watchers';

const requestFeed = url => axios.get(`https://thingproxy.freeboard.io/fetch/${url}`);

const app = () => {
  initWatchers();

  const rssForm = document.getElementById('find-rss-form');
  const rssInput = document.getElementById('find-rss-input');

  rssInput.addEventListener('input', () => {
    const inputValue = rssInput.value.trim();

    if (inputValue === '') {
      console.log('VAL EMPTY');
      state.setFormState({
        isValid: true,
        inputValue,
        notification: '',
        isSubmitDisabled: true,
      });
    } else if (state.hasChannel(inputValue)) {
      console.log('VAL DUPLICATE');
      state.setFormState({
        isValid: false,
        inputValue,
        notification: 'Feed already added!',
        isSubmitDisabled: true,
      });
    } else if (!validate.isURL(inputValue)) {
      console.log('VAL INVALID');
      state.setFormState({
        isValid: false,
        inputValue,
        notification: 'Invalid URL!',
        isSubmitDisabled: true,
      });
    } else {
      console.log('VAL OK');
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
        if (validate.isRss(res.data)) {
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

    $modal[0].querySelector('.modal-title').textContent = post.title;
    $modal[0].querySelector('.modal-body').textContent = stripTags(post.description);
    $modal[0].querySelector('.js-visit-site').setAttribute('href', post.link);
  });
};

app();

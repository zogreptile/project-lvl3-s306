import WatchJS from 'melanke-watchjs';
import * as render from './renderers';
import * as state from './state';

const { watch } = WatchJS;

export default () => {
  watch(state.getState(), 'formState', () => {
    const { isValid, inputValue, notification } = state.getFormState();
    render.findRssForm('find-rss-form', isValid, notification, inputValue);
  });

  watch(state.getState(), 'channels', () => {
    render.feedChannelInfo('feeds', state.getChannels());
  });

  watch(state.getState(), 'posts', () => {
    render.feedChannelPosts('posts', state.getPosts());
  });
};

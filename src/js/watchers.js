import WatchJS from 'melanke-watchjs';
import * as render from './renderers';
import state from './state';

const { watch } = WatchJS;

export default () => {
  watch(state, 'formState', () => {
    render.findRssForm('find-rss-form', state.getFormState());
  });

  watch(state, 'channels', () => {
    render.feedChannelInfo('feeds', state.getChannels());
  });

  watch(state, 'posts', () => {
    render.feedChannelPosts('posts', state.getPosts());
  });
};

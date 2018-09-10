import WatchJS from 'melanke-watchjs';
import * as render from './renderers';

const { watch } = WatchJS;

export default (state) => {
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

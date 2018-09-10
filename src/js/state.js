const state = {
  formState: {
    isValid: false,
    inputValue: '',
    notification: '',
    isSubmitDisabled: true,
  },
  channels: [],
  posts: [],
  getFormState() {
    return this.formState;
  },
  setFormState(newState) {
    this.formState = { ...this.formState, ...newState };
  },
  getChannels() {
    return this.channels;
  },
  hasChannel(url) {
    return this.channels.find(el => el.url === url);
  },
  addChannel(url, title, description) {
    this.channels.unshift({ url, title, description });
  },
  getPosts() {
    return this.posts;
  },
  addPosts(newPosts) {
    this.posts = [...newPosts, ...this.posts];
  },
};

export default () => Object.create(state);

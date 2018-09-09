export const state = {
  formState: {
    isValid: false,
    inputValue: '',
    notification: '',
  },
  channels: [],
  posts: [],
};

export const getState = () => state;

export const getFormState = () => state.formState;
export const setFormState = (newState) => {
  state.formState = { ...state.formState, ...newState };
};

export const getChannels = () => state.channels;
export const hasChannel = url => state.channels.find(el => el.url === url);
export const addChannel = (url, title, description) => {
  state.channels = [{ url, title, description }, ...state.channels];
};

export const getPosts = () => state.posts;
export const addPosts = (newPosts) => {
  state.posts = [...newPosts, ...state.posts];
};

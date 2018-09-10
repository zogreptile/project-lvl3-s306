export const feedChannelInfo = (rootId, channels) => {
  const items = channels.map(el => `
    <li class="list-group-item pl-0">
      <div>${el.title}</div>
      <small>${el.description}</small>
    </li>`).join('');

  const list = `
    <ul class="list-group list-group-flush">
      ${items}
    </ul>`;

  const root = document.getElementById(rootId);
  root.innerHTML = list;
};

export const feedChannelPosts = (rootId, posts) => {
  const items = posts.map(item => `
    <li class="list-group-item pl-0">
      <div class="mb-2">
        <a href="${item.link}" target="_blank">${item.title}</a>
      </div>
      <button
        class="btn btn-primary btn-sm"
        type="button" data-toggle="modal"
        data-target="#preview-modal"
        data-post-id="${item.id}"
      >
        Preview
      </button>
    </li>`).join('');

  const list = `
    <ul class="list-group list-group-flush">
      ${items}
    </ul>`;

  const root = document.getElementById(rootId);
  root.innerHTML = list;
};

export const findRssForm = (formId, formState) => {
  const form = document.getElementById(formId);
  const input = form.querySelector('#find-rss-input');
  const submitBtn = form.querySelector('#submit-btn');
  const formNotification = form.querySelector('#notification');

  if (formState.isValid) {
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
  }
  input.value = formState.inputValue;
  submitBtn.disabled = formState.isSubmitDisabled;
  formNotification.textContent = formState.notification;
};

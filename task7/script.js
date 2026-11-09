const API_URL = "https://jsonplaceholder.typicode.com/posts";
const PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 200;
const DEBOUNCE_FOR_5=2000;
const DEBOUNCE_DELAY = 300;
const state = {
  posts: [],
  page: 0,
  loading: false,
  hasMore: true,
  searchQuery: "",
};

const postsEl = document.getElementById("posts");
const searchEl = document.getElementById("search");
const loaderEl = document.getElementById("loader");
const endMessageEl = document.getElementById("end-message");
const emptyMessageEl = document.getElementById("empty-message");
const errorBlockEl = document.getElementById("error-block");
const errorMessageEl = document.getElementById("error-message");
const retryEl = document.getElementById("retry");
async function loadNextPage() {
  if (state.loading || !state.hasMore) return;

  state.loading = true;
  hideError();
  updateStatus();

  const start = state.page * PAGE_SIZE;

  try {
    const response = await fetch(`${API_URL}?_start=${start}&_limit=${PAGE_SIZE}`);

    if (!response.ok) {
      throw new Error(`сервер вернул статус ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      state.hasMore = false;
    } else {
      state.posts.push(...data);
      state.page += 1;
      if (data.length < PAGE_SIZE) {
        state.hasMore = false;
      }
    }

    render();
  } catch (error) {
    showError(`Не удалось загрузить посты: ${error.message}`);
  } finally {
    state.loading = false;
    updateStatus();
  }
  if (!errorBlockEl.classList.contains("hidden")) return;
  checkScrollPosition();
}

function render() {
  const filtered = filterPosts(state.posts, state.searchQuery);
  postsEl.innerHTML = filtered.map(createPostCard).join("");
  updateStatus();
}

function createPostCard(post) {
  return `
    <article class="post-card">
      <span class="meta">Автор #${post.userId} · Пост #${post.id}</span>
      <h2>${escapeHtml(post.title)}</h2>
      <p>${escapeHtml(post.body)}</p>
    </article>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function filterPosts(posts, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return posts;
  return posts.filter((post) => post.title.toLowerCase().includes(normalized));
}

function updateStatus() {
  const hasError = !errorBlockEl.classList.contains("hidden");
  const visibleCount = filterPosts(state.posts, state.searchQuery).length;

  loaderEl.classList.toggle("hidden", !state.loading);
  endMessageEl.classList.toggle(
    "hidden",
    state.hasMore || state.loading || hasError || state.posts.length === 0
  );
  emptyMessageEl.classList.toggle(
    "hidden",
    visibleCount > 0 || state.loading || hasError || state.posts.length === 0
  );
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorBlockEl.classList.remove("hidden");
}

function hideError() {
  errorBlockEl.classList.add("hidden");
  errorMessageEl.textContent = "";
}

let searchDebounceId = null;

function onSearchInput(event) {
  const value = event.target.value;
  const delay= value.trim().length<=5? DEBOUNCE_FOR_5 :DEBOUNCE_DELAY
  clearTimeout(searchDebounceId);
  searchDebounceId = setTimeout(() => {
    state.searchQuery = value;
    render();
    checkScrollPosition();
  }, delay);
}

function checkScrollPosition() {
  const scrollBottom = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollBottom >= pageHeight - SCROLL_THRESHOLD) {
    loadNextPage();
  }
}

function init() {
  searchEl.addEventListener("input", onSearchInput);
  window.addEventListener("scroll", checkScrollPosition);
  retryEl.addEventListener("click", loadNextPage);

  loadNextPage();
}

init();
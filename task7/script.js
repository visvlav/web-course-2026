(function () {
  "use strict";

  class PostsModel {
    constructor() {
      this.apiUrl = "https://jsonplaceholder.typicode.com/posts";
      this.pageSize = 10;

      this.posts = [];
      this.page = 0;
      this.searchQuery = "";
      this.loading = false;
      this.hasMore = true;
      this.hasError = false;
      this.errorMessage = "";
    }

    canLoad() {
      return !this.loading && this.hasMore;
    }

    async loadNextPage() {
      this.loading = true;
      this.hasError = false;
      this.errorMessage = "";

      const start = this.page * this.pageSize;

      try {
        const response = await fetch(`${this.apiUrl}?_start=${start}&_limit=${this.pageSize}`);

        if (!response.ok) {
          throw new Error(`сервер вернул статус ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
          this.hasMore = false;
        } else {
          this.posts.push(...data);
          this.page += 1;
          if (data.length < this.pageSize) {
            this.hasMore = false;
          }
        }
      } catch (error) {
        this.hasError = true;
        this.errorMessage = `Не удалось загрузить посты: ${error.message}`;
      } finally {
        this.loading = false;
      }
    }

    setSearchQuery(query) {
      this.searchQuery = query;
    }

    getFilteredPosts() {
      const normalized = this.searchQuery.trim().toLowerCase();
      if (!normalized) return this.posts;
      return this.posts.filter((post) => post.title.toLowerCase().includes(normalized));
    }

    getStatus() {
      return {
        loading: this.loading,
        hasMore: this.hasMore,
        hasError: this.hasError,
        errorMessage: this.errorMessage,
        totalCount: this.posts.length,
        visibleCount: this.getFilteredPosts().length,
      };
    }
  }

  class PostsView {
    constructor() {
      this.postsEl = document.getElementById("posts");
      this.searchEl = document.getElementById("search");
      this.loaderEl = document.getElementById("loader");
      this.endMessageEl = document.getElementById("end-message");
      this.emptyMessageEl = document.getElementById("empty-message");
      this.errorBlockEl = document.getElementById("error-block");
      this.errorMessageEl = document.getElementById("error-message");
      this.retryEl = document.getElementById("retry");

      this.scrollThreshold = 200;
    }

    escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    createPostCard(post) {
      return `
        <article class="post-card">
          <span class="meta">Автор #${post.userId} · Пост #${post.id}</span>
          <h2>${this.escapeHtml(post.title)}</h2>
          <p>${this.escapeHtml(post.body)}</p>
        </article>
      `;
    }

    renderPosts(posts) {
      this.postsEl.innerHTML = posts.map((post) => this.createPostCard(post)).join("");
    }

    updateStatus(status) {
      const { loading, hasMore, hasError, errorMessage, totalCount, visibleCount } = status;

      this.loaderEl.classList.toggle("hidden", !loading);

      this.endMessageEl.classList.toggle(
        "hidden",
        hasMore || loading || hasError || totalCount === 0
      );

      this.emptyMessageEl.classList.toggle(
        "hidden",
        visibleCount > 0 || loading || hasError || totalCount === 0
      );

      this.errorMessageEl.textContent = hasError ? errorMessage : "";
      this.errorBlockEl.classList.toggle("hidden", !hasError);
    }

    isNearBottom() {
      const scrollBottom = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      return scrollBottom >= pageHeight - this.scrollThreshold;
    }

    bindSearch(handler) {
      this.searchEl.addEventListener("input", (event) => handler(event.target.value));
    }

    bindScroll(handler) {
      window.addEventListener("scroll", handler);
    }

    bindRetry(handler) {
      this.retryEl.addEventListener("click", handler);
    }
  }

  class PostsController {
    constructor(model, view) {
      this.model = model;
      this.view = view;

      this.debounceDelay = 300;
      this.debounceDelayShort = 2000;
      this.shortQueryLength = 5;
      this.searchDebounceId = null;

      this.view.bindSearch((value) => this.handleSearch(value));
      this.view.bindScroll(() => this.checkScrollPosition());
      this.view.bindRetry(() => this.loadNextPage());
    }

    init() {
      this.loadNextPage();
    }

    async loadNextPage() {
      if (!this.model.canLoad()) return;

      const loadingPromise = this.model.loadNextPage();
      this.view.updateStatus(this.model.getStatus());

      await loadingPromise;

      this.render();

      if (this.model.hasError) return;
      this.checkScrollPosition();
    }

    render() {
      this.view.renderPosts(this.model.getFilteredPosts());
      this.view.updateStatus(this.model.getStatus());
    }

    handleSearch(value) {
      const delay =
        value.trim().length <= this.shortQueryLength
          ? this.debounceDelayShort
          : this.debounceDelay;

      clearTimeout(this.searchDebounceId);
      this.searchDebounceId = setTimeout(() => {
        this.model.setSearchQuery(value);
        this.render();
        this.checkScrollPosition();
      }, delay);
    }

    checkScrollPosition() {
      if (this.view.isNearBottom()) {
        this.loadNextPage();
      }
    }
  }

  const model = new PostsModel();
  const view = new PostsView();
  const controller = new PostsController(model, view);
  controller.init();
})();
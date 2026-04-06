(function () {
  const html = document.documentElement;
  const basePath = html.dataset.basePath || "../";
  const mainContent = document.getElementById("main-content");

  const PAGE_COPY = {
    ar: {
      title: "مدونة الخرسانة الجاهزة | مصنع الغربية الذهبية للخرسانة الجاهزة",
      metaDescription:
        "مقالات عملية عن الخرسانة الجاهزة في السعودية: اختيار الخلطات، الجودة، الاختبارات، التوريد، وأفضل ممارسات التنفيذ.",
      ogTitle: "مدونة الخرسانة الجاهزة | مصنع الغربية الذهبية",
      ogDescription:
        "محتوى فني مبسط يساعدك على فهم الخرسانة الجاهزة واتخاذ قرارات توريد أدق للمشاريع المختلفة.",
      twitterTitle: "مدونة الخرسانة الجاهزة | مصنع الغربية الذهبية",
      twitterDescription:
        "اطلع على مقالات الخرسانة الجاهزة، الجودة، والاختبارات في صفحة مدونة موحدة.",
      breadcrumbsHome: "الرئيسية",
      breadcrumbsCurrent: "المدونة",
      breadcrumbAria: "مسار التنقل",
      heroKicker: "مقالات فنية",
      heroTitle: "مدونة الخرسانة الجاهزة",
      heroLead:
        "محتوى عملي يساعدك على اختيار الخلطة المناسبة، فهم الاختبارات، ورفع جودة التنفيذ في المشاريع السكنية والتجارية.",
      filterAria: "تصفية المقالات",
      searchPlaceholder: "ابحث في المقالات",
      searchLabel: "ابحث في المقالات",
      allLabel: "الكل",
      resultText: (count) => {
        if (count === 1) return "عرض مقال واحد";
        if (count === 2) return "عرض مقالين";
        if (count >= 3 && count <= 10) return `عرض ${count} مقالات`;
        return `عرض ${count} مقالًا`;
      },
      emptyState: "جرّب تغيير الفئة أو البحث بكلمات مختلفة.",
    },
    en: {
      title: "Ready-Mix Concrete Blog | Golden Western Ready-Mix Concrete",
      metaDescription:
        "Practical articles about ready-mix concrete in Saudi Arabia: selection, quality, testing, supply, and execution best practices.",
      ogTitle: "Ready-Mix Concrete Blog | Golden Western",
      ogDescription:
        "Technical articles that help contractors, engineers, and project owners make better supply and execution decisions.",
      twitterTitle: "Ready-Mix Concrete Blog | Golden Western",
      twitterDescription:
        "Explore ready-mix concrete articles, quality insights, and supply guidance in one blog hub.",
      breadcrumbsHome: "Home",
      breadcrumbsCurrent: "Blog",
      breadcrumbAria: "Breadcrumb",
      heroKicker: "Technical Articles",
      heroTitle: "Ready-Mix Concrete Blog",
      heroLead:
        "Practical content that helps you choose the right mix, understand testing, and improve execution quality across residential and commercial projects.",
      filterAria: "Filter articles",
      searchPlaceholder: "Search articles",
      searchLabel: "Search articles",
      allLabel: "All Articles",
      resultText: (count) =>
        count
          ? `Showing ${count} article${count === 1 ? "" : "s"}`
          : "No articles match your current search.",
      emptyState: "Try a different category or search with different keywords.",
    },
  };

  function setMetaContent(selector, value) {
    const node = document.querySelector(selector);
    if (node && typeof value === "string") {
      node.setAttribute("content", value);
    }
  }

  function sortPosts(posts) {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function setPageMeta(lang) {
    const copy = PAGE_COPY[lang];
    document.title = copy.title;
    setMetaContent('meta[name="description"]', copy.metaDescription);
    setMetaContent('meta[property="og:title"]', copy.ogTitle);
    setMetaContent('meta[property="og:description"]', copy.ogDescription);
    setMetaContent('meta[name="twitter:title"]', copy.twitterTitle);
    setMetaContent('meta[name="twitter:description"]', copy.twitterDescription);
  }

  function renderPageShell(lang) {
    renderSiteShell({
      basePath,
      activePage: "blog",
      quoteTarget: "index.html#contact",
      backToTopTarget: "#page-top",
      lang,
    });
  }

  function renderMainLayout(lang) {
    const copy = PAGE_COPY[lang];

    if (!mainContent) {
      return;
    }

    mainContent.innerHTML = `
        <section class="page-hero">
            <div class="container page-hero-shell">
                <nav class="page-breadcrumbs" aria-label="${copy.breadcrumbAria}">
                    <a href="${basePath}index.html">${copy.breadcrumbsHome}</a>
                    <span>•</span>
                    <span>${copy.breadcrumbsCurrent}</span>
                </nav>
                <div class="page-hero-content">
                    <span class="page-kicker"><i class="fas fa-newspaper"></i>${copy.heroKicker}</span>
                    <h1 class="page-title">${copy.heroTitle}</h1>
                    <p class="page-lead">${copy.heroLead}</p>
                </div>
            </div>
        </section>

        <section class="page-section blog">
            <div class="container">
                <div class="page-panel">
                    <div class="toolbar-row">
                        <div class="filter-group" id="blog-filters" aria-label="${copy.filterAria}"></div>
                        <label class="search-control">
                            <input type="search" id="blog-search" placeholder="${copy.searchPlaceholder}" aria-label="${copy.searchLabel}">
                            <i class="fas fa-search" aria-hidden="true"></i>
                        </label>
                    </div>
                    <p class="page-results" id="blog-results"></p>
                    <div class="projects-grid article-list-grid" id="blog-grid"></div>
                </div>
            </div>
        </section>
    `;
  }

  function initInteractiveContent(lang, posts) {
    const copy = PAGE_COPY[lang];
    const localizedPosts = sortPosts(posts).map((post) =>
      getLocalizedPost(post, lang),
    );
    const blogGrid = document.getElementById("blog-grid");
    const blogFilters = document.getElementById("blog-filters");
    const searchInput = document.getElementById("blog-search");
    const results = document.getElementById("blog-results");
    const allFilterKey = "__all__";
    let currentFilter = allFilterKey;
    let searchQuery = "";

    if (!blogGrid || !blogFilters || !searchInput || !results) {
      return;
    }

    const categories = Array.from(
      new Set(localizedPosts.map((post) => post.category).filter(Boolean)),
    );

    function getVisiblePosts() {
      return localizedPosts.filter((post) => {
        const matchesCategory =
          currentFilter === allFilterKey || post.category === currentFilter;
        const haystack = normalizeText(
          [post.title, post.excerpt, post.category, ...(post.tags || [])].join(
            " ",
          ),
        );
        const matchesSearch =
          !searchQuery || haystack.includes(normalizeText(searchQuery));
        return matchesCategory && matchesSearch;
      });
    }

    function renderFilters() {
      const items = [
        { key: allFilterKey, label: copy.allLabel },
        ...categories.map((category) => ({ key: category, label: category })),
      ];

      blogFilters.innerHTML = items
        .map(
          (item) => `
            <button class="filter-chip ${item.key === currentFilter ? "active" : ""}" type="button" data-category="${item.key}">
                ${item.label}
            </button>
        `,
        )
        .join("");

      blogFilters.querySelectorAll("[data-category]").forEach((button) => {
        button.addEventListener("click", () => {
          currentFilter = button.dataset.category;
          renderFilters();
          renderPosts();
        });
      });
    }

    function renderPosts() {
      const visiblePosts = getVisiblePosts();
      results.textContent = copy.resultText(visiblePosts.length);
      blogGrid.innerHTML = visiblePosts.length
        ? visiblePosts
            .map((post) => createArticleCard(post, basePath, { lang }))
            .join("")
        : `<div class="page-panel content-card-empty">${copy.emptyState}</div>`;
    }

    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderPosts();
    });

    renderFilters();
    renderPosts();
  }

  async function renderPage(lang) {
    const resolvedLang = lang === "en" ? "en" : "ar";
    setPageMeta(resolvedLang);
    renderPageShell(resolvedLang);
    renderMainLayout(resolvedLang);
    const posts = await loadPublicBlogPosts(basePath);
    initInteractiveContent(resolvedLang, posts);
    bindLanguageSwitcher(renderPage);
  }

  renderPage(
    typeof getStoredLanguage === "function" ? getStoredLanguage() : "ar",
  ).catch((error) => {
    console.error("Blog page failed to render.", error);
  });
})();

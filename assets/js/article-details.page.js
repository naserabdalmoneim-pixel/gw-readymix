(function () {
  const html = document.documentElement;
  const basePath = html.dataset.basePath || "../../";
  const slug = html.dataset.articleSlug;
  const articleRoot = document.getElementById("article-root");

  const PAGE_COPY = {
    ar: {
      homeLabel: "الرئيسية",
      blogLabel: "المدونة",
      breadcrumbAria: "مسار التنقل",
      fallbackIntro:
        "سيتم إضافة تفاصيل هذا المقال قريبًا مع تحديثات المحتوى التحريري.",
      fallbackToc: "ملخص المقال",
      ctaTitle: "ابدأ مشروعك بثقة",
      ctaDesc:
        "إذا كنت بحاجة إلى توصية فنية أو عرض سعر سريع لمشروعك في جدة، فإن فريق مصنع الغربية الذهبية جاهز للتنسيق معك.",
      ctaCall: "اتصل الآن",
      ctaWhatsapp: "واتساب للأعمال",
      relatedTitle: "مقالات ذات صلة",
      relatedDesc:
        "تصفح مقالات أخرى من نفس السياق الفني قبل اعتماد التوريد أو تحديد الخلطة المناسبة.",
      tocTitle: "فهرس المقال",
      shareTitle: "شارك هذا المقال",
      shareFacebook: "مشاركة على فيسبوك",
      shareLinkedIn: "مشاركة على لينكدإن",
      shareX: "مشاركة على إكس",
      shareWhatsapp: "مشاركة على واتساب",
      notFound: "المقال المطلوب غير متاح حاليًا.",
      loadErrorPrefix:
        "حدثت مشكلة أثناء تحميل المقال. حاول تحديث الصفحة أو العودة إلى",
      loadErrorLink: "المدونة",
    },
    en: {
      homeLabel: "Home",
      blogLabel: "Blog",
      breadcrumbAria: "Breadcrumb",
      fallbackIntro:
        "This article will be expanded with additional editorial content soon.",
      fallbackToc: "Article Summary",
      ctaTitle: "Start Your Project with Confidence",
      ctaDesc:
        "If you need technical guidance or a fast quote for your project in Jeddah, the Golden Western team is ready to coordinate with you.",
      ctaCall: "Call Now",
      ctaWhatsapp: "WhatsApp Business",
      relatedTitle: "Related Articles",
      relatedDesc:
        "Browse more technical articles from the same context before planning your next pour.",
      tocTitle: "Article Outline",
      shareTitle: "Share This Article",
      shareFacebook: "Share on Facebook",
      shareLinkedIn: "Share on LinkedIn",
      shareX: "Share on X",
      shareWhatsapp: "Share on WhatsApp",
      notFound: "The requested article is not currently available.",
      loadErrorPrefix:
        "There was a problem loading this article. Try refreshing the page or go back to",
      loadErrorLink: "the blog",
    },
  };

  function setMetaContent(selector, value) {
    const node = document.querySelector(selector);
    if (node && typeof value === "string") {
      node.setAttribute("content", value);
    }
  }

  function loadArticleContent() {
    return Array.isArray(window.ARTICLE_CONTENT) ? window.ARTICLE_CONTENT : [];
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setArticleMeta(summary, lang) {
    const localizedSummary = getLocalizedPost(summary, lang);
    const title = localizedSummary.metaTitle || localizedSummary.title;
    const description =
      localizedSummary.metaDescription || localizedSummary.excerpt;

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }

  function renderNotFound(lang) {
    const copy = PAGE_COPY[lang];
    articleRoot.innerHTML = `
        <section class="page-section">
            <div class="container">
                <div class="page-panel content-card-empty">${copy.notFound}</div>
            </div>
        </section>
    `;
  }

  function renderLoadError(lang) {
    const copy = PAGE_COPY[lang];
    articleRoot.innerHTML = `
        <section class="page-section">
            <div class="container">
                <div class="page-panel content-card-empty">
                    ${copy.loadErrorPrefix} <a href="${basePath}blog/">${copy.loadErrorLink}</a>.
                </div>
            </div>
        </section>
    `;
  }

  function formatArticleBody(value) {
    const content = String(value || "").trim();
    if (!content) {
      return "";
    }

    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }

    return content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map(
        (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`,
      )
      .join("");
  }

  function buildArticleContent(summary, detail, lang, copy) {
    const localizedSummary = getLocalizedPost(summary, lang);
    const localizedDetail =
      detail && detail.translations && detail.translations[lang]
        ? detail.translations[lang]
        : {};
    const intro = (
      localizedDetail.intro ||
      (lang === "ar" ? detail.intro : "") ||
      localizedSummary.excerpt ||
      ""
    ).trim();
    const preferredBody = (
      localizedDetail.bodyHtml ||
      (lang === "ar" ? detail.bodyHtml : "") ||
      ""
    ).trim();
    const summaryBody = formatArticleBody(localizedSummary.content || "");
    const bodyMarkup = preferredBody || summaryBody;

    if (!bodyMarkup) {
      return {
        intro,
        bodyHtml: `
                <div class="article-empty-state">
                    <p>${localizedSummary.excerpt}</p>
                    <p>${copy.fallbackIntro}</p>
                </div>
            `,
        tocHtml: `<li><a href="#article-body">${copy.fallbackToc}</a></li>`,
      };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<div class="article-body-temp">${bodyMarkup}</div>`,
      "text/html",
    );
    const wrapper = doc.querySelector(".article-body-temp");
    const headings = [];

    wrapper.querySelectorAll("h2, h3").forEach((heading, index) => {
      const id = heading.id || `article-section-${index + 1}`;
      heading.id = id;
      headings.push({
        id,
        label: heading.textContent.trim(),
      });
    });

    return {
      intro,
      bodyHtml: wrapper.innerHTML,
      tocHtml: headings.length
        ? headings
            .map(
              (heading) =>
                `<li><a href="#${heading.id}">${heading.label}</a></li>`,
            )
            .join("")
        : `<li><a href="#article-body">${copy.fallbackToc}</a></li>`,
    };
  }

  function getRelatedPosts(posts, summary, detail) {
    if (detail.relatedSlugs && detail.relatedSlugs.length) {
      return detail.relatedSlugs
        .map((relatedSlug) => posts.find((post) => post.slug === relatedSlug))
        .filter(Boolean)
        .slice(0, 3);
    }

    const currentCategory = summary.category_ar || summary.category_en || "";
    return posts
      .filter((post) => post.slug !== summary.slug)
      .filter(
        (post) =>
          (post.category_ar || post.category_en || "") === currentCategory,
      )
      .slice(0, 3);
  }

  function renderArticle(posts, summary, detail, lang) {
    const copy = PAGE_COPY[lang];
    const localizedSummary = getLocalizedPost(summary, lang);
    const localizedDate = formatLocalizedDate(localizedSummary.date, lang);
    const relatedPosts = getRelatedPosts(posts, summary, detail);
    const articleContent = buildArticleContent(summary, detail, lang, copy);
    const pageUrl = window.location.href;
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(localizedSummary.title);

    setArticleMeta(summary, lang);

    articleRoot.innerHTML = `
        <section class="page-hero">
            <div class="container page-hero-shell">
                <nav class="page-breadcrumbs" aria-label="${copy.breadcrumbAria}">
                    <a href="${basePath}index.html">${copy.homeLabel}</a>
                    <span>•</span>
                    <a href="${basePath}blog/">${copy.blogLabel}</a>
                    <span>•</span>
                    <span>${localizedSummary.title}</span>
                </nav>

                <div class="article-shell">
                    <div class="article-hero">
                        <div class="article-hero-media">
                            <img src="${basePath}${localizedSummary.image}" alt="${escapeHtml(localizedSummary.imageAlt || localizedSummary.title)}" width="1200" height="800" fetchpriority="high">
                        </div>
                        <div class="article-summary">
                            <div class="article-meta-row">
                                <span class="article-pill"><i class="fas fa-tag"></i>${localizedSummary.category}</span>
                                <span class="article-pill"><i class="far fa-calendar"></i>${localizedDate}</span>
                                <span class="article-pill"><i class="far fa-clock"></i>${localizedSummary.readTime}</span>
                            </div>
                            <div class="page-hero-content">
                                <h1 class="page-title">${localizedSummary.title}</h1>
                                <p class="page-lead">${articleContent.intro || localizedSummary.excerpt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="page-section">
            <div class="container article-layout">
                <div class="article-body-shell">
                    <article class="page-panel article-prose" id="article-body">
                        ${articleContent.bodyHtml}
                    </article>

                    <section class="page-panel article-cta">
                        <h2 class="article-sidebar-title">${copy.ctaTitle}</h2>
                        <p>${copy.ctaDesc}</p>
                        <div class="page-actions">
                            <a href="tel:+966544584458" class="btn btn-primary">
                                <i class="fas fa-phone-alt"></i>
                                <span>${copy.ctaCall}</span>
                            </a>
                            <a href="https://wa.me/966544584458" class="btn btn-outline" target="_blank" rel="noopener">
                                <i class="fab fa-whatsapp"></i>
                                <span>${copy.ctaWhatsapp}</span>
                            </a>
                        </div>
                    </section>

                    <section class="article-related">
                        <div class="section-header">
                            <h2 class="section-title">${copy.relatedTitle}</h2>
                            <p class="section-desc">${copy.relatedDesc}</p>
                        </div>
                        <div class="projects-grid article-list-grid">
                            ${relatedPosts.map((post) => createArticleCard(post, basePath, { lang })).join("")}
                        </div>
                    </section>
                </div>

                <aside class="article-sidebar">
                    <div class="page-panel">
                        <h2 class="article-sidebar-title">${copy.tocTitle}</h2>
                        <ul class="article-toc">${articleContent.tocHtml}</ul>
                    </div>
                    <div class="page-panel article-actions">
                        <h2 class="article-sidebar-title">${copy.shareTitle}</h2>
                        <div class="share-links">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener" aria-label="${copy.shareFacebook}"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener" aria-label="${copy.shareLinkedIn}"><i class="fab fa-linkedin-in"></i></a>
                            <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener" aria-label="${copy.shareX}"><i class="fab fa-x-twitter"></i></a>
                            <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener" aria-label="${copy.shareWhatsapp}"><i class="fab fa-whatsapp"></i></a>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    `;
  }

  async function renderPage(lang) {
    const resolvedLang = lang === "en" ? "en" : "ar";
    renderSiteShell({
      basePath,
      activePage: "blog",
      quoteTarget: "index.html#contact",
      backToTopTarget: "#page-top",
      lang: resolvedLang,
    });

    const posts = await loadPublicBlogPosts(basePath);
    const summary = posts.find((post) => post.slug === slug);
    if (!summary) {
      renderNotFound(resolvedLang);
      bindLanguageSwitcher(renderPage);
      return;
    }

    const articleContent = loadArticleContent();
    const detail = articleContent.find((entry) => entry.slug === slug) || {
      slug,
      intro: "",
      tocHtml: "",
      bodyHtml: "",
      translations: {},
      relatedSlugs: [],
    };

    renderArticle(posts, summary, detail, resolvedLang);
    bindLanguageSwitcher(renderPage);
  }

  renderPage(
    typeof getStoredLanguage === "function" ? getStoredLanguage() : "ar",
  ).catch((error) => {
    console.error("Article page failed to render.", error);
    renderLoadError(
      typeof getStoredLanguage === "function" ? getStoredLanguage() : "ar",
    );
  });
})();

(function () {
  const POST_TRANSLATIONS_EN = {
    "ready-mix-concrete-jeddah-guide": {
      title:
        "Ready-Mix Concrete in Jeddah: Types, Uses, and Selection Criteria",
      metaTitle:
        "Ready-Mix Concrete in Jeddah: Types, Uses, and Selection Criteria",
      metaDescription:
        "A practical guide to selecting the right mix, reviewing supply scope, and verifying quality before approval.",
      excerpt:
        "A practical guide to selecting the right mix, reviewing supply scope, and verifying quality before approval.",
      category: "Ready-Mix Concrete",
      readTime: "7 min read",
      imageAlt: "Ready-mix concrete guide in Jeddah",
    },
    "hot-weather-concreting-saudi-arabia": {
      title: "Hot Weather Concreting in Saudi Arabia: Best Practices",
      metaTitle: "Hot Weather Concreting in Saudi Arabia: Best Practices",
      metaDescription:
        "Site and plant controls that reduce temperature risk, slump loss, and early cracking during hot-weather pours.",
      excerpt:
        "Site and plant controls that reduce temperature risk, slump loss, and early cracking during hot-weather pours.",
      category: "Hot Weather",
      readTime: "6 min read",
      imageAlt: "Concrete pouring in hot weather in Saudi Arabia",
    },
    "concrete-quality-tests-guide": {
      title: "Key Ready-Mix Quality Tests from Plant to Site",
      metaTitle: "Key Ready-Mix Quality Tests from Plant to Site",
      metaDescription:
        "Essential checks that verify mix consistency, fresh concrete performance, and compliance before casting.",
      excerpt:
        "Essential checks that verify mix consistency, fresh concrete performance, and compliance before casting.",
      category: "Quality & Testing",
      readTime: "8 min read",
      imageAlt: "Ready-mix concrete quality tests at project site",
    },
    "how-to-choose-concrete-strength": {
      title: "How to Choose the Right Concrete Strength for Your Project",
      metaTitle: "How to Choose the Right Concrete Strength for Your Project",
      metaDescription:
        "A practical framework for matching compressive strength to structural use, durability, and execution method.",
      excerpt:
        "A practical framework for matching compressive strength to structural use, durability, and execution method.",
      category: "Ready-Mix Concrete",
      readTime: "6 min read",
      imageAlt: "Choosing the right concrete strength",
    },
    "types-of-concrete-differences": {
      title:
        "Differences Between Normal, Resistant, and High-Strength Concrete",
      metaTitle:
        "Differences Between Normal, Resistant, and High-Strength Concrete",
      metaDescription:
        "Understand the practical differences between standard mixes, resistant concrete, and higher-strength structural mixes.",
      excerpt:
        "Understand the practical differences between standard mixes, resistant concrete, and higher-strength structural mixes.",
      category: "Ready-Mix Concrete",
      readTime: "6 min read",
      imageAlt: "Different concrete types and their applications",
    },
    "self-compacting-concrete-scc": {
      title: "Self-Compacting Concrete (SCC): When Should You Use It?",
      metaTitle: "Self-Compacting Concrete (SCC): When Should You Use It?",
      metaDescription:
        "Why SCC improves placement quality in congested reinforcement, architectural finishes, and complex formwork.",
      excerpt:
        "Why SCC improves placement quality in congested reinforcement, architectural finishes, and complex formwork.",
      category: "Ready-Mix Concrete",
      readTime: "6 min read",
      imageAlt: "Self-compacting concrete in complex construction work",
    },
    "early-concrete-cracks-prevention": {
      title:
        "Early Concrete Cracks: Causes and Prevention from Order to Curing",
      metaTitle:
        "Early Concrete Cracks: Causes and Prevention from Order to Curing",
      metaDescription:
        "The most common causes of early cracking and the preventive controls needed across ordering, pouring, and curing.",
      excerpt:
        "The most common causes of early cracking and the preventive controls needed across ordering, pouring, and curing.",
      category: "Quality & Testing",
      readTime: "7 min read",
      imageAlt: "Early concrete crack prevention guide",
    },
    "concrete-pouring-for-residential-commercial-projects": {
      title:
        "Concrete Pouring for Residential and Commercial Projects: Planning and Execution",
      metaTitle:
        "Concrete Pouring for Residential and Commercial Projects: Planning and Execution",
      metaDescription:
        "A step-by-step view of pour planning, manpower readiness, logistics, and quality control on site.",
      excerpt:
        "A step-by-step view of pour planning, manpower readiness, logistics, and quality control on site.",
      category: "Projects & Infrastructure",
      readTime: "7 min read",
      imageAlt: "Concrete pouring for residential and commercial projects",
    },
    "sustainable-concrete-solutions": {
      title: "Sustainable Concrete Solutions for Long-Term Project Efficiency",
      metaTitle:
        "Sustainable Concrete Solutions for Long-Term Project Efficiency",
      metaDescription:
        "How balanced mix design and durability planning support sustainability without sacrificing project performance.",
      excerpt:
        "How balanced mix design and durability planning support sustainability without sacrificing project performance.",
      category: "Sustainability",
      readTime: "6 min read",
      imageAlt: "Sustainable concrete solutions",
    },
    "why-certified-concrete-supplier-matters": {
      title: "Why a Certified Concrete Supplier Matters to Project Success",
      metaTitle: "Why a Certified Concrete Supplier Matters to Project Success",
      metaDescription:
        "The supplier qualification points that reduce execution risk, protect schedules, and improve project confidence.",
      excerpt:
        "The supplier qualification points that reduce execution risk, protect schedules, and improve project confidence.",
      category: "Ready-Mix Concrete",
      readTime: "6 min read",
      imageAlt: "Importance of a certified ready-mix concrete supplier",
    },
  };

  const CARD_TRANSLATIONS = {
    ar: {
      locale: "ar-SA",
      featuredLabel: "مقال مميز",
      readMoreLabel: "اقرأ المزيد",
      arrowIcon: "fa-arrow-left",
    },
    en: {
      locale: "en-US",
      featuredLabel: "Featured Article",
      readMoreLabel: "Read More",
      arrowIcon: "fa-arrow-right",
    },
  };

  const blogStore = {
    posts: null,
    promise: null,
  };

  function sortNormalizedPosts(posts) {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function resolveLanguage(lang) {
    if (lang === "en" || lang === "ar") {
      return lang;
    }

    if (typeof window.getStoredLanguage === "function") {
      return window.getStoredLanguage();
    }

    return "ar";
  }

  function normalizeTags(value) {
    if (typeof value === "string") {
      return value
        .split(/[,،]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  function stripHtml(value) {
    return String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function estimateReadTime(value, locale) {
    const text = stripHtml(value);
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(3, Math.ceil(Math.max(words, 1) / 180));
    return locale === "en" ? `${minutes} min read` : `${minutes} دقائق قراءة`;
  }

  function slugToTitle(slug) {
    return String(slug || "")
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function buildRelativeUrl(basePath, target) {
    const value = String(target || "");
    if (!value || /^(#|https?:|mailto:|tel:|\/)/.test(value)) {
      return value;
    }

    return `${basePath || ""}${value.replace(/^\.?\//, "")}`;
  }

  function normalizeBlogPost(post) {
    const source = post || {};
    const titleAr = String(source.title_ar || source.title || "").trim();
    const titleEn = String(source.title_en || "").trim();
    const excerptAr = String(source.excerpt_ar || source.excerpt || "").trim();
    const excerptEn = String(source.excerpt_en || "").trim();
    const contentAr = String(source.content_ar || source.content || "").trim();
    const contentEn = String(source.content_en || "").trim();
    const categoryAr = String(
      source.category_ar || source.category || "",
    ).trim();
    const categoryEn = String(source.category_en || "").trim();
    const readTimeAr = String(
      source.read_time_ar || source.readTime || "",
    ).trim();
    const readTimeEn = String(source.read_time_en || "").trim();
    const legacyEnglish = POST_TRANSLATIONS_EN[source.slug] || {};

    return {
      id: String(source.id || source.slug || ""),
      slug: String(source.slug || "").trim(),
      date: String(source.date || "").trim(),
      image: String(source.image || "").trim(),
      image_ar: String(source.image_ar || source.image || "").trim(),
      image_en: String(source.image_en || source.image || "").trim(),
      featured: Boolean(source.featured),
      title_ar: titleAr,
      title_en: titleEn,
      excerpt_ar: excerptAr,
      excerpt_en: excerptEn,
      content_ar: contentAr,
      content_en: contentEn,
      category_ar: categoryAr,
      category_en: categoryEn,
      read_time_ar:
        readTimeAr || estimateReadTime(contentAr || excerptAr, "ar"),
      read_time_en:
        readTimeEn ||
        legacyEnglish.readTime ||
        estimateReadTime(contentEn || excerptEn, "en"),
      image_alt_ar: String(
        source.image_alt_ar || source.imageAlt || titleAr,
      ).trim(),
      image_alt_en: String(
        source.image_alt_en || legacyEnglish.imageAlt || titleEn,
      ).trim(),
      meta_title_ar: String(
        source.meta_title_ar || source.metaTitle || titleAr,
      ).trim(),
      meta_title_en: String(
        source.meta_title_en || legacyEnglish.metaTitle || titleEn,
      ).trim(),
      meta_description_ar: String(
        source.meta_description_ar || source.metaDescription || excerptAr,
      ).trim(),
      meta_description_en: String(
        source.meta_description_en ||
          legacyEnglish.metaDescription ||
          excerptEn,
      ).trim(),
      tags_ar: normalizeTags(source.tags_ar || source.tags || []),
      tags_en: normalizeTags(source.tags_en || []),
      legacy_english: legacyEnglish,
    };
  }

  function getLocalizedPost(post, lang) {
    const resolvedLang = resolveLanguage(lang);
    const normalized = normalizeBlogPost(post);
    const legacyEnglish = normalized.legacy_english || {};

    if (resolvedLang === "en") {
      const title =
        normalized.title_en ||
        legacyEnglish.title ||
        slugToTitle(normalized.slug) ||
        normalized.title_ar;
      const excerpt =
        normalized.excerpt_en || legacyEnglish.excerpt || normalized.excerpt_ar;
      const content = normalized.content_en || normalized.content_ar;
      const category =
        normalized.category_en ||
        legacyEnglish.category ||
        normalized.category_ar;
      const tags = normalized.tags_en.length
        ? normalized.tags_en
        : normalized.tags_ar;

      return {
        ...normalized,
        image: normalized.image_en,
        title,
        excerpt,
        content,
        category,
        readTime:
          normalized.read_time_en ||
          legacyEnglish.readTime ||
          estimateReadTime(content || excerpt, "en"),
        imageAlt: normalized.image_alt_en || legacyEnglish.imageAlt || title,
        metaTitle: normalized.meta_title_en || legacyEnglish.metaTitle || title,
        metaDescription:
          normalized.meta_description_en ||
          legacyEnglish.metaDescription ||
          excerpt,
        tags,
      };
    }

    return {
      ...normalized,
      image: normalized.image_ar,
      title: normalized.title_ar || normalized.title_en,
      excerpt: normalized.excerpt_ar || normalized.excerpt_en,
      content: normalized.content_ar || normalized.content_en,
      category: normalized.category_ar || normalized.category_en,
      readTime:
        normalized.read_time_ar ||
        estimateReadTime(normalized.content_ar || normalized.excerpt_ar, "ar"),
      imageAlt:
        normalized.image_alt_ar || normalized.title_ar || normalized.title_en,
      metaTitle:
        normalized.meta_title_ar || normalized.title_ar || normalized.title_en,
      metaDescription:
        normalized.meta_description_ar ||
        normalized.excerpt_ar ||
        normalized.excerpt_en,
      tags: normalized.tags_ar.length ? normalized.tags_ar : normalized.tags_en,
    };
  }

  function formatLocalizedDate(dateString, lang) {
    const resolvedLang = resolveLanguage(lang);
    const locale = CARD_TRANSLATIONS[resolvedLang].locale;
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function buildArticleHref(basePath, slug) {
    return `${basePath || ""}blog/${slug}/index.html`;
  }

  function createArticleCard(post, basePath, options) {
    const config = options || {};
    const lang = resolveLanguage(config.lang);
    const copy = CARD_TRANSLATIONS[lang];
    const localizedPost = getLocalizedPost(post, lang);
    const formattedDate = formatLocalizedDate(localizedPost.date, lang);
    const tags = Array.from(
      new Set([localizedPost.category, ...(localizedPost.tags || [])]),
    )
      .filter(Boolean)
      .slice(0, 3);
    const badge = localizedPost.featured
      ? `<span class="project-tag"><i class="fas fa-star"></i>${copy.featuredLabel}</span>`
      : "";

    return `
        <a class="project-card content-card article-card" href="${buildArticleHref(basePath, localizedPost.slug)}" aria-label="${localizedPost.title}">
            <div class="project-image">
                <img loading="lazy" decoding="async" src="${buildRelativeUrl(basePath, localizedPost.image)}" alt="${localizedPost.imageAlt || localizedPost.title}" width="1200" height="800">
            </div>
            <div class="project-content">
                <div class="project-tags">
                    ${badge}
                    ${tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
                </div>
                <h3 class="project-title">${localizedPost.title}</h3>
                <p class="project-desc">${localizedPost.excerpt}</p>
                <div class="project-meta-grid">
                    <div class="project-meta-item">
                        <div class="project-meta-value"><i class="far fa-calendar"></i></div>
                        <div>${formattedDate}</div>
                    </div>
                    <div class="project-meta-item">
                        <div class="project-meta-value"><i class="far fa-clock"></i></div>
                        <div>${localizedPost.readTime}</div>
                    </div>
                    <div class="project-meta-item">
                        <div class="project-meta-value"><i class="fas ${copy.arrowIcon}"></i></div>
                        <div>${copy.readMoreLabel}</div>
                    </div>
                </div>
            </div>
        </a>
    `;
  }

  function getFallbackBlogPosts() {
    return Array.isArray(window.BLOG_POSTS)
      ? sortNormalizedPosts(window.BLOG_POSTS.map(normalizeBlogPost))
      : [];
  }

  async function loadPublicBlogPosts(basePath) {
    if (blogStore.posts) {
      return blogStore.posts;
    }

    if (blogStore.promise) {
      return blogStore.promise;
    }

    blogStore.promise = (async () => {
      const fallbackPosts = getFallbackBlogPosts();
      if (window.location.protocol === "file:") {
        blogStore.posts = fallbackPosts;
        return blogStore.posts;
      }

      try {
        const response = await fetch(
          buildRelativeUrl(basePath, "api/blog.php"),
          {
            headers: { Accept: "application/json" },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`Blog API returned ${response.status}`);
        }

        const payload = await response.json();
        if (!payload || payload.ok === false || !Array.isArray(payload.data)) {
          throw new Error("Blog API payload is invalid");
        }

        blogStore.posts = sortNormalizedPosts(
          payload.data.map(normalizeBlogPost),
        );
        return blogStore.posts;
      } catch (error) {
        console.warn("Falling back to local blog data.", error);
        blogStore.posts = fallbackPosts;
        return blogStore.posts;
      }
    })();

    return blogStore.promise;
  }

  window.POST_TRANSLATIONS_EN = POST_TRANSLATIONS_EN;
  window.getLocalizedPost = getLocalizedPost;
  window.normalizeBlogPost = normalizeBlogPost;
  window.formatLocalizedDate = formatLocalizedDate;
  window.buildArticleHref = buildArticleHref;
  window.createArticleCard = createArticleCard;
  window.loadPublicBlogPosts = loadPublicBlogPosts;
})();

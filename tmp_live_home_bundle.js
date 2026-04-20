window.GW_SITE_CONFIG = {
  heroVideoUrl:
    "https://www.dropbox.com/scl/fi/jm79cplrcgo1o3bpi8c23/golden_noaudio-1.mp4?rlkey=13oajbmu34nlpgdoqrcwtannr&st=6vgvhlyi&raw=1",
  projectShowcaseVideoUrl:
    "https://www.dropbox.com/scl/fi/jm79cplrcgo1o3bpi8c23/golden_noaudio-1.mp4?rlkey=13oajbmu34nlpgdoqrcwtannr&st=6vgvhlyi&raw=1",
  heroPosterUrl: "assets/images/hero/hero-video-poster.jpg",
  heroUsePosterModal: false,
  leadForms: {
    provider: "google-apps-script",
    relayEndpoint: "https://gw-readymix-form-relay.nasergw.workers.dev",
    endpoint:
      "https://script.google.com/macros/s/AKfycbzghKLDXhaprKSvG3MVyDCSwZmqA1rUwIrvyEnIP5ZvB38qUC4vunK4-RDPV_lRRtb1/exec",
    sharedSecret: "",
    recipientEmail: "naserabdalmoneim@gmail.com",
    fallbackToMailto: true,
  },
};
(function () {
  const POST_TRANSLATIONS_EN = {
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
    return `${basePath || ""}blog/${slug}/`;
  }

  function createArticleCard(post, basePath, options) {
    const config = options || {};
    const lang = resolveLanguage(config.lang);
    const copy = CARD_TRANSLATIONS[lang];
    const localizedPost = getLocalizedPost(post, lang);
    const imageLoading = config.imageLoading === "eager" ? "eager" : "lazy";
    const imageFetchPriority =
      config.imageFetchPriority === "high" ? "high" : "auto";
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
                <img loading="${imageLoading}" decoding="async" fetchpriority="${imageFetchPriority}" src="${buildRelativeUrl(basePath, localizedPost.image)}" alt="${localizedPost.imageAlt || localizedPost.title}" width="1200" height="800">
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

  async function loadPublicBlogPosts() {
    if (blogStore.posts) {
      return blogStore.posts;
    }

    if (!blogStore.promise) {
      blogStore.promise = Promise.resolve(getFallbackBlogPosts()).then(
        (posts) => {
          blogStore.posts = posts;
          return posts;
        },
      );
    }

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
window.BLOG_POSTS = [
  {
    id: "blog-002",
    slug: "hot-weather-concreting-saudi-arabia",
    title_ar:
      "الخرسانة في الأجواء الحارة بالسعودية: أفضل الممارسات للحد من فقدان الجودة",
    title_en: "Hot Weather Concreting in Saudi Arabia: Best Practices",
    excerpt_ar:
      "خطوات تشغيلية وفنية تضبط حرارة الخلطة، زمن النقل، والمعالجة حتى لا تتحول حرارة الجو إلى مخاطرة على المقاومة والمتانة.",
    excerpt_en:
      "Operational and technical controls that keep temperature, haul time, and curing from turning hot weather into a strength and durability risk.",
    content_ar:
      "\n<h2>لماذا تمثل الحرارة العالية تحديًا حقيقيًا للخرسانة؟</h2>\n<p>في الأجواء الحارة ترتفع سرعة فقدان الهبوط، ويزداد معدل التبخر من السطح، كما يتسارع تفاعل الأسمنت بطريقة قد تؤثر على قابلية التشغيل وجودة التشطيب. وإذا اجتمع ذلك مع طول زمن النقل أو ضعف المعالجة، فقد تظهر تشققات مبكرة أو تراجع في جودة السطح والعنصر المنفذ.</p>\n<p>لهذا السبب لا يكفي أن تكون مقاومة الخلطة صحيحة على الورق؛ المهم أن تصل إلى الموقع وتُصب وتُعالج ضمن ظروف تقلل أثر الحرارة على الأداء الفعلي.</p>\n<h2>إجراءات يجب تجهيزها قبل التوريد</h2>\n<p>أفضل معالجة لمشكلة الحرارة تبدأ قبل خروج الشاحنة من المصنع. يجب تنسيق وقت الصب في ساعات أقل حرارة قدر الإمكان، تجهيز الموقع بالكامل، وتقليل أي احتمال لانتظار غير مخطط له عند الوصول. كما يفيد التنسيق المبكر مع المورد في مراجعة الإضافات الملائمة وجدولة عدد الخلاطات حسب حجم الصبة.</p>\n<ul>\n  <li>تجهيز القوالب وحديد التسليح ورش الأسطح الساخنة عند الحاجة.</li>\n  <li>تأمين المضخة والعمالة وأدوات الدمك والتشطيب قبل أول دفعة.</li>\n  <li>تقليل فترات التوقف بين الخلاطات حتى لا تتباين جودة الصب.</li>\n</ul>\n<h2>التحكم أثناء النقل والصب</h2>\n<p>أثناء النقل، يجب متابعة وقت الانطلاق والوصول والتأكد من عدم إجراء تعديلات عشوائية في الموقع. إضافة الماء بدون ضوابط قد تعطي قابلية تشغيل مؤقتة لكنها تضعف خصائص الخلطة وتؤثر على التجانس. إذا احتاجت الخرسانة إلى تعديل، فيجب أن يتم ضمن ضوابط فنية وتحت مسؤولية واضحة.</p>\n<p>وعند الصب، يجب تقليل تعرض الخرسانة للشمس والهواء قدر الإمكان، مع تنفيذ الدمك والتشطيب ضمن توقيت مناسب. التأخير بين التفريغ والتشطيب من أكثر الأخطاء التي تظهر لاحقًا في صورة تشققات أو ضعف سطحي.</p>\n<h2>المعالجة هي خط الدفاع الأخير</h2>\n<p>حتى لو وصلت الخرسانة بحالة جيدة، فإن إهمال المعالجة في الأجواء الحارة قد يهدر جزءًا كبيرًا من الجودة المتحققة. المطلوب هو بدء المعالجة في الوقت الصحيح والحفاظ على رطوبة العنصر أو حمايته بوسائل مناسبة حسب نوع العنصر والموقع.</p>\n<p>النجاح في الصب الحار لا يعتمد على خطوة واحدة، بل على سلسلة متكاملة تبدأ من الخلطة الصحيحة وتنتهي بمعالجة منضبطة. وكلما كان التنسيق بين المصنع والموقع أوضح، انخفضت المخاطر وارتفعت موثوقية النتائج.</p>\n",
    content_en:
      "\n<h2>Why is hot weather a real challenge for concrete?</h2>\n<p>High ambient temperatures accelerate slump loss, increase surface evaporation, and speed up cement hydration in ways that can reduce workability and finishing quality. When that is combined with long transport time or poor curing, the result may be early cracking, weaker surface quality, or inconsistent performance in the completed element.</p>\n<p>That is why it is not enough for the mix to meet the specified strength on paper. It must arrive, be placed, and be cured under controls that limit the actual effect of heat on performance.</p>\n<h2>What should be prepared before dispatch?</h2>\n<p>The best hot-weather control starts before the truck leaves the plant. Pours should be scheduled during lower-temperature hours where possible, the site should be fully ready, and waiting time at arrival should be minimized. Early coordination with the supplier also helps confirm suitable admixtures and the number of trucks required for the pour window.</p>\n<ul>\n  <li>Prepare formwork, reinforcement, and condition hot surfaces where necessary.</li>\n  <li>Secure pumping, labor, compaction tools, and finishing crews before the first load arrives.</li>\n  <li>Minimize long gaps between deliveries so pour quality remains consistent.</li>\n</ul>\n<h2>Controls during transport and placement</h2>\n<p>During transport, dispatch and arrival time should be monitored and uncontrolled site-side adjustments should be avoided. Adding water at site may temporarily improve workability, but it can reduce performance and consistency. If adjustment is needed, it should happen within technical limits and under clear responsibility.</p>\n<p>During placement, concrete should be protected from direct exposure as much as possible, and compaction and finishing should be executed in the proper window. Delays between discharge and finishing are a common source of later cracking and surface weakness.</p>\n<h2>Curing is the final line of defense</h2>\n<p>Even if the concrete arrives in good condition, weak curing in hot weather can waste much of that quality. The goal is to begin curing at the correct time and keep the element protected or moist according to the element type and site conditions.</p>\n<p>Successful hot-weather concreting is never one isolated action. It is a controlled sequence that starts with the right mix and ends with disciplined curing. The better the coordination between plant and site, the lower the risk and the more reliable the result.</p>\n",
    category_ar: "الأجواء الحارة",
    category_en: "Hot Weather",
    read_time_ar: "6 دقائق قراءة",
    read_time_en: "6 min read",
    image: "assets/images/blog/hot-weather-concreting-saudi-arabia.webp",
    image_alt_ar: "أفضل ممارسات صب الخرسانة في الأجواء الحارة",
    image_alt_en: "Hot-weather concreting best practices",
    featured: true,
    date: "2026-03-16",
    meta_title_ar: "الخرسانة في الأجواء الحارة بالسعودية: أفضل الممارسات",
    meta_title_en: "Hot Weather Concreting in Saudi Arabia: Best Practices",
    meta_description_ar:
      "ضبط حرارة الخرسانة وزمن النقل والمعالجة في الأجواء الحارة لتقليل التشققات وحماية مقاومة العنصر المصبوب.",
    meta_description_en:
      "Control temperature, haul time, and curing in hot weather to reduce cracking risk and protect concrete performance.",
    tags_ar: ["الأجواء الحارة", "المعالجة", "صب الخرسانة"],
    tags_en: ["hot weather", "curing", "concrete pouring"],
  },
  {
    id: "blog-004",
    slug: "how-to-choose-concrete-strength",
    title_ar: "كيف تختار مقاومة الخرسانة المناسبة لمشروعك؟",
    title_en: "How to Choose the Right Concrete Strength for Your Project",
    excerpt_ar:
      "دليل مبسط يربط بين مقاومة الضغط ونوع العنصر الإنشائي ومتطلبات المتانة بدل الاعتماد على أرقام عامة غير دقيقة.",
    excerpt_en:
      "A practical guide that connects compressive strength with structural use and durability requirements instead of relying on generic numbers.",
    content_ar:
      "\n<h2>ماذا تعني مقاومة الخرسانة فعليًا؟</h2>\n<p>مقاومة الخرسانة هي مؤشر على قدرة العنصر على تحمل الأحمال بعد فترة زمنية محددة، لكنها ليست المتغير الوحيد في نجاح الخلطة. كثير من القرارات الخاطئة تنتج من التعامل مع قيمة MPa كأنها الحل الكامل، بينما الواقع أن الأداء يتأثر أيضًا بالقابلية للتشغيل، المتانة، ظروف الصب، ونوعية التنفيذ.</p>\n<p>لذلك يجب أن تُحدد المقاومة ضمن منظومة أوسع تربط بين تصميم العنصر، متطلبات الكود، والبيئة التشغيلية للمشروع.</p>\n<h2>كيف تربط المقاومة بنوع العنصر؟</h2>\n<p>الأساسات والقواعد والأرضيات ليست مثل الأعمدة أو الأسقف من حيث متطلبات التحمل وطريقة الصب والتشطيب. كما أن العناصر ذات الكثافة العالية من الحديد قد تحتاج موازنة دقيقة بين المقاومة وقابلية التشغيل حتى لا تتحول الخلطة القوية إلى خلطة صعبة التنفيذ.</p>\n<ul>\n  <li>العناصر غير المعرضة لأحمال كبيرة قد تعتمد مقاومات متوسطة مع ضبط جيد للتنفيذ.</li>\n  <li>العناصر الرئيسية أو المتكررة في المباني متعددة الأدوار تحتاج قراءة أدق للتصميم ومتطلبات الأمان.</li>\n  <li>البيئات العدوانية قد تفرض متطلبات متانة إضافية بجانب المقاومة نفسها.</li>\n</ul>\n<h2>المتانة لا تقل أهمية عن رقم المقاومة</h2>\n<p>في بعض الحالات، يركز الفريق على رفع المقاومة بينما تكون المشكلة الحقيقية مرتبطة بالنفاذية أو التعرض للأملاح أو لظروف الصب الحارة. الخلطة الصحيحة ليست فقط الأقوى، بل الأنسب للبيئة ولطريقة التنفيذ ولعمر الخدمة المتوقع.</p>\n<p>ولهذا يجب مراجعة المواصفة الفنية مع المورد أو المهندس المصمم قبل اعتماد الخلطة، خاصة إذا كان المشروع قريبًا من بيئة بحرية أو صناعية أو معرضًا لرطوبة مستمرة.</p>\n<h2>ما القرار الصحيح قبل الاعتماد النهائي؟</h2>\n<p>قبل إصدار الطلب، تأكد من توافق المقاومة المطلوبة مع التصميم، ومن قدرة المورد على إنتاج الخلطة بشكل مستقر، ومن أن طريقة الصب والدمك والمعالجة في الموقع تدعم الوصول إلى الأداء المطلوب. بدون هذا الترابط، قد تكون المواصفة صحيحة نظريًا لكن النتيجة في الموقع أقل من المتوقع.</p>\n<p>القرار الأفضل هو الذي يوازن بين المتطلبات الإنشائية، سهولة التنفيذ، وسلامة التشغيل، لا القرار الذي يرفع رقم المقاومة فقط.</p>\n",
    content_en:
      "\n<h2>What does concrete strength really mean?</h2>\n<p>Concrete strength indicates how much load an element can carry after a defined curing period, but it is not the only factor behind a successful mix. Many poor decisions come from treating the MPa value as the whole answer, while actual performance also depends on workability, durability, placement conditions, and execution quality.</p>\n<p>That is why strength should be selected within a broader framework that links structural design, code requirements, and project exposure conditions.</p>\n<h2>How should strength be linked to the structural element?</h2>\n<p>Foundations, slabs, and pavements do not behave like columns or suspended slabs in terms of demand or execution method. Elements with dense reinforcement may require a careful balance between strength and workability so that a high-strength mix does not become difficult to place correctly.</p>\n<ul>\n  <li>Elements with modest loading may perform well with moderate strength when execution quality is controlled.</li>\n  <li>Primary structural elements in multi-storey work require closer alignment with design and safety margins.</li>\n  <li>Aggressive exposure may require added durability criteria on top of the nominal strength value.</li>\n</ul>\n<h2>Durability matters as much as the strength number</h2>\n<p>In many cases, teams focus on increasing strength while the real issue is permeability, salt exposure, or hot-weather placement conditions. The right mix is not simply the strongest one. It is the one that fits the environment, the execution method, and the required service life.</p>\n<p>That is why the project specification should be reviewed with the supplier or design engineer before final approval, especially when the project is close to marine, industrial, or continuously wet conditions.</p>\n<h2>What is the right decision before final approval?</h2>\n<p>Before issuing the order, confirm that the requested strength matches the design, that the supplier can produce the mix consistently, and that the site method for placing, compacting, and curing supports the required performance. Without that alignment, the specification may be correct on paper while site results remain below expectation.</p>\n<p>The best decision is the one that balances structural need, execution practicality, and operational reliability, not the one that simply pushes the strength number higher.</p>\n",
    category_ar: "الخرسانة الجاهزة",
    category_en: "Ready-Mix Concrete",
    read_time_ar: "6 دقائق قراءة",
    read_time_en: "6 min read",
    image: "assets/images/blog/how-to-choose-concrete-strength.webp",
    image_ar: "assets/images/blog/how-to-choose-concrete-strength-ar.svg",
    image_en: "assets/images/blog/how-to-choose-concrete-strength.webp",
    image_alt_ar: "اختيار مقاومة الخرسانة المناسبة للمشروع",
    image_alt_en: "Choosing the right concrete strength for a project",
    featured: true,
    date: "2026-03-15",
    meta_title_ar: "كيف تختار مقاومة الخرسانة المناسبة لمشروعك؟",
    meta_title_en: "How to Choose the Right Concrete Strength for Your Project",
    meta_description_ar:
      "تعرف على طريقة اختيار مقاومة الخرسانة وفق نوع العنصر، متطلبات المتانة، وطبيعة التنفيذ الفعلية في الموقع.",
    meta_description_en:
      "Learn how to select concrete strength based on element type, durability requirements, and actual site execution conditions.",
    tags_ar: ["مقاومة الخرسانة", "تصميم الخلطات", "العناصر الإنشائية"],
    tags_en: ["concrete strength", "mix design", "structural elements"],
  },
  {
    id: "blog-005",
    slug: "types-of-concrete-differences",
    title_ar: "الفرق بين الخرسانة العادية والمقاومة وعالية القوة",
    title_en:
      "Differences Between Normal, Resistant, and High-Strength Concrete",
    excerpt_ar:
      "مقارنة عملية بين الأنواع الأكثر استخدامًا في المشاريع، ومتى يكون رفع المواصفة مبررًا ومتى يكون مجرد تكلفة إضافية.",
    excerpt_en:
      "A practical comparison of common concrete types and when a higher specification is justified versus when it only adds unnecessary cost.",
    content_ar:
      "\n<h2>الاختلاف ليس في الاسم فقط</h2>\n<p>الخرسانة العادية والخرسانة المقاومة والخرسانة عالية القوة تختلف في الهدف التصميمي، خصائص الخلطة، ومتطلبات التنفيذ. استخدام مصطلح عام دون تحديد الحاجة الفعلية قد يؤدي إلى اختيار غير اقتصادي أو إلى خلطة لا تخدم المشروع بالشكل الأمثل.</p>\n<p>المقارنة الصحيحة يجب أن تنطلق من الأداء المطلوب، لا من الانطباع بأن النوع الأعلى دائمًا هو الأفضل.</p>\n<h2>متى تستخدم الخرسانة العادية؟</h2>\n<p>الخرسانة العادية مناسبة للأعمال التي لا تتطلب خصائص خاصة تتجاوز المتطلبات الأساسية للمقاومة والتشغيل. وغالبًا ما تكون خيارًا عمليًا واقتصاديًا للعناصر التي لا تتعرض لظروف بيئية قاسية أو أحمال استثنائية.</p>\n<h2>متى ننتقل إلى الخرسانة المقاومة أو عالية القوة؟</h2>\n<p>الخرسانة المقاومة تصبح ضرورية عندما تكون البيئة العدوانية جزءًا من معادلة التصميم، مثل التعرض للأملاح أو الكبريتات أو متطلبات الحد من النفاذية. أما الخرسانة عالية القوة فتُستخدم عندما يكون هناك احتياج إنشائي حقيقي، مثل الأحمال العالية أو العناصر النحيفة أو متطلبات خاصة للتصميم.</p>\n<ul>\n  <li>الخرسانة المقاومة تركز على المتانة بقدر ما تركز على المقاومة.</li>\n  <li>الخرسانة عالية القوة تتطلب ضبطًا أعلى في المواد والإنتاج والتنفيذ.</li>\n  <li>رفع المواصفة دون مبرر قد يزيد التكلفة ويعقد التنفيذ دون عائد فعلي.</li>\n</ul>\n<h2>كيف تتخذ القرار بشكل اقتصادي وفني؟</h2>\n<p>أفضل قرار هو الذي يربط بين بيئة المشروع، طبيعة العنصر، متطلبات الاستدامة، وسهولة التنفيذ. بعض المشاريع تحتاج خلطة متوازنة أكثر من حاجتها إلى خلطة متطرفة في المواصفات.</p>\n<p>عند مراجعة الخيارات مع المورد، اطلب تفسيرًا واضحًا للفروق بين البدائل، وما إذا كان التحسن في الأداء حقيقيًا للمشروع أم مجرد مواصفة أعلى دون قيمة تشغيلية إضافية.</p>\n",
    content_en:
      "\n<h2>The difference is not just in the label</h2>\n<p>Normal concrete, resistant concrete, and high-strength concrete differ in design intent, mix behavior, and execution requirements. Using a broad term without defining the actual project need can lead either to an uneconomical choice or to a mix that does not serve the job properly.</p>\n<p>The correct comparison should start from required performance, not from the assumption that the highest grade is always the best option.</p>\n<h2>When is normal concrete the right choice?</h2>\n<p>Normal concrete is suitable for work that does not demand special performance beyond core strength and workable placement. It is often the most practical and economical option for elements that are not exposed to harsh environmental conditions or exceptional structural demand.</p>\n<h2>When do you move to resistant or high-strength concrete?</h2>\n<p>Resistant concrete becomes necessary when aggressive exposure is part of the design equation, such as salts, sulfates, or permeability limits. High-strength concrete is justified when there is a real structural need, such as higher loading, slender elements, or specific design constraints.</p>\n<ul>\n  <li>Resistant concrete is about durability as much as nominal strength.</li>\n  <li>High-strength concrete requires tighter control in materials, production, and execution.</li>\n  <li>Increasing specification without reason can raise cost and complicate placement with little practical benefit.</li>\n</ul>\n<h2>How do you make the decision technically and commercially?</h2>\n<p>The best choice links project exposure, element type, sustainability needs, and ease of execution. Many projects benefit more from a balanced mix than from an extreme specification.</p>\n<p>When reviewing options with the supplier, ask for a clear explanation of the performance difference between alternatives and whether the upgrade creates real project value or simply a higher label.</p>\n",
    category_ar: "الخرسانة الجاهزة",
    category_en: "Ready-Mix Concrete",
    read_time_ar: "6 دقائق قراءة",
    read_time_en: "6 min read",
    image: "assets/images/blog/types-of-concrete-differences.webp",
    image_alt_ar: "مقارنة أنواع الخرسانة الجاهزة",
    image_alt_en: "Comparison of ready-mix concrete types",
    featured: false,
    date: "2026-03-10",
    meta_title_ar: "الفرق بين الخرسانة العادية والمقاومة وعالية القوة",
    meta_title_en:
      "Differences Between Normal, Resistant, and High-Strength Concrete",
    meta_description_ar:
      "متى تستخدم الخرسانة العادية، ومتى تحتاج إلى خرسانة مقاومة أو عالية القوة وفق بيئة المشروع ومتطلبات الأداء.",
    meta_description_en:
      "Understand when normal, resistant, or high-strength concrete is the right fit based on exposure and performance needs.",
    tags_ar: ["أنواع الخرسانة", "المتانة", "الخرسانة عالية القوة"],
    tags_en: ["concrete types", "durability", "high-strength concrete"],
  },
];
window.BLOG_CATEGORIES = ["الكل", "الخرسانة الجاهزة", "الأجواء الحارة"];
function init3DConcreteBackground() {
  const container = document.getElementById("three-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const vibrantPrimaryColor = 0x003366; // Dark Blue from logo
  const vibrantSecondaryColor = 0xffd700; // Gold from logo
  const transitMixerMaterial = new THREE.MeshPhongMaterial({
    color: vibrantPrimaryColor,
    specular: 0xffffff,
    shininess: 150,
    transparent: true,
    opacity: 0.3,
  });
  const cementMaterial = new THREE.MeshPhongMaterial({
    color: 0x64748b,
    specular: 0x333333,
    shininess: 20,
    transparent: true,
    opacity: 0.3,
  });
  const rebarMaterial = new THREE.MeshPhongMaterial({
    color: 0x4b5563,
    specular: 0x555555,
    shininess: 80,
    transparent: true,
    opacity: 0.3,
  });

  const mixerGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2.5, 32);
  const cabinGeometry = new THREE.BoxGeometry(1, 1, 1.5);
  const meshes = []; // Store meshes for rotation
  for (let i = 0; i < 5; i++) {
    const mixer = new THREE.Mesh(mixerGeometry, transitMixerMaterial);
    const cabin = new THREE.Mesh(cabinGeometry, transitMixerMaterial);
    mixer.add(cabin);
    cabin.position.set(0, 0, -1.5);
    mixer.position.x = (Math.random() - 0.5) * 15;
    mixer.position.y = (Math.random() - 0.5) * 15;
    mixer.position.z = (Math.random() - 0.5) * 5;
    mixer.rotation.x = Math.random() * Math.PI;
    mixer.rotation.y = Math.random() * Math.PI;
    scene.add(mixer);
    meshes.push(mixer);
  }

  const blockGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.7);
  for (let i = 0; i < 15; i++) {
    const block = new THREE.Mesh(blockGeometry, cementMaterial);
    block.position.x = (Math.random() - 0.5) * 12;
    block.position.y = (Math.random() - 0.5) * 12;
    block.position.z = (Math.random() - 0.5) * 5;
    block.rotation.x = Math.random() * Math.PI;
    block.rotation.y = Math.random() * Math.PI;
    scene.add(block);
    meshes.push(block);
  }

  const pumpGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
  for (let i = 0; i < 4; i++) {
    const pump = new THREE.Mesh(pumpGeometry, transitMixerMaterial);
    pump.rotation.z = Math.PI / 2;
    pump.position.x = (Math.random() - 0.5) * 20;
    pump.position.y = (Math.random() - 0.5) * 20;
    pump.position.z = (Math.random() - 0.5) * 5;
    pump.rotation.x = Math.random() * Math.PI;
    pump.rotation.y = Math.random() * Math.PI;
    scene.add(pump);
    meshes.push(pump);
  }

  const rebarGeometry = new THREE.TorusKnotGeometry(0.2, 0.05, 64, 8, 2, 3);
  for (let i = 0; i < 8; i++) {
    const rebar = new THREE.Mesh(rebarGeometry, rebarMaterial);
    rebar.position.x = (Math.random() - 0.5) * 15;
    rebar.position.y = (Math.random() - 0.5) * 15;
    rebar.position.z = (Math.random() - 0.5) * 5;
    rebar.rotation.x = Math.random() * Math.PI;
    rebar.rotation.y = Math.random() * Math.PI;
    scene.add(rebar);
    meshes.push(rebar);
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  const pointLight = new THREE.PointLight(vibrantSecondaryColor, 10, 50); // Changed to gold
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);

  function animate() {
    requestAnimationFrame(animate);
    meshes.forEach((child) => {
      child.rotation.x += 0.0005;
      child.rotation.y += 0.0005;
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animateCounters() {
  const counters = Array.from(document.querySelectorAll(".stat-number"));
  if (!counters.length) return;

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;
    const target = parseInt(counter.dataset.count, 10);
    if (Number.isNaN(target)) return;

    const duration = 2000;
    const start = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      counter.textContent = `${current}+`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = `${target}+`;
        counter.dataset.animated = "true";
      }
    }

    requestAnimationFrame(step);
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }

  counters.forEach((counter) => {
    if (counter.dataset.animated === "true") return;
    if (isVisible(counter)) {
      animateCounter(counter);
    }
  });
}

const projectData = {
  project2: { m3: "35,000", units: "19" }, // Al Sadeem Residential District
  project3: { year: 2026, m3: "60,000", units: "500,000" }, // Buraiman Water Plant
  project4: { year: 2025, m3: "22,000", units: "8" }, // Al Andalus Education Campus
  project5: { year: 2026, m3: "2500", units: "8" }, // Al Rashidiya Residential Complex
};

function populateProjectData() {
  for (const key in projectData) {
    if (projectData.hasOwnProperty(key)) {
      const data = projectData[key];
      const meta1Value = document.getElementById(`${key}-meta1-value`);
      const meta2Value = document.getElementById(`${key}-meta2-value`);
      const meta3Value = document.getElementById(`${key}-meta3-value`);

      if (meta1Value) meta1Value.textContent = data.year;
      if (meta2Value) meta2Value.textContent = `${data.m3} م³`;
      if (meta3Value) meta3Value.textContent = data.units;
    }
  }
}

const projectModal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");
const modalProjectTitle = document.getElementById("modalProjectTitle");
const videoContainer = document.getElementById("videoContainer");
const mockProjectsGrid = document.getElementById("mockProjectsGrid");
const mockProjectsTitle = document.getElementById("mockProjectsTitle");
const projectCards = document.querySelectorAll(".project-card[data-project]");

projectCards.forEach((card) => {
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  const title = card.querySelector(".project-title")?.textContent?.trim();
  if (title) card.setAttribute("aria-label", `عرض تفاصيل ${title}`);
});

let currentProjectId = null;

const projectRelations = {
  2: ["3", "4", "5"],
  3: ["2", "4", "5"],
  4: ["2", "3", "5"],
  5: ["2", "3", "4"],
};

function getCurrentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "ar";
}

function getProjectTitle(projectId, lang) {
  const content = translations[lang] || translations.ar;
  return (
    content[`project${projectId}Title`] || content.project2Title || "مشروع"
  );
}

function getProjectDesc(projectId, lang) {
  const content = translations[lang] || translations.ar;
  return content[`project${projectId}Desc`] || "";
}

function getMockProjectsForProject(projectId, lang) {
  const related = projectRelations[projectId] || [];
  return related.map((id) => ({
    projectId: id,
    title: getProjectTitle(id, lang),
    desc: getProjectDesc(id, lang),
  }));
}

function extractYouTubeId(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url, window.location.origin);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return parsed.pathname.replace(/\//g, "").trim();
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        return (parsed.searchParams.get("v") || "").trim();
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1].split("/")[0].trim();
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1].split("/")[0].trim();
      }
    }
  } catch (error) {
    return "";
  }
  return "";
}

function buildYouTubeEmbedUrl(url, options = {}) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return "";

  const params = new URLSearchParams({
    autoplay: options.autoplay ? "1" : "0",
    mute: options.mute ? "1" : "0",
    controls: options.controls === false ? "0" : "1",
    loop: options.loop ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });

  if (options.loop) {
    params.set("playlist", videoId);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function buildYouTubeThumbnailUrls(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return [];
  return [
    `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
}

function ensureHeroPosterElement(videoBackground) {
  let poster = videoBackground.querySelector(".hero-youtube-poster");
  if (!poster) {
    poster = document.createElement("img");
    poster.className = "hero-youtube-poster";
    poster.alt = "";
    poster.decoding = "async";
    poster.loading = "eager";
    poster.fetchPriority = "high";
    poster.setAttribute("aria-hidden", "true");
    const overlay = videoBackground.querySelector(".video-overlay");
    videoBackground.insertBefore(poster, overlay || videoBackground.firstChild);
  }
  return poster;
}

function preferHeroYouTubeQuality(player) {
  if (!player) return;

  const preferredQualities = ["hd1080", "hd720", "large"];
  for (const quality of preferredQualities) {
    try {
      if (typeof player.setPlaybackQualityRange === "function") {
        player.setPlaybackQualityRange(quality);
      }
      if (typeof player.setPlaybackQuality === "function") {
        player.setPlaybackQuality(quality);
      }
      break;
    } catch (error) {
      continue;
    }
  }
}

let heroYouTubePlayer = null;
let heroYouTubeApiPromise = null;

function ensureYouTubeIframeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (heroYouTubeApiPromise) {
    return heroYouTubeApiPromise;
  }

  heroYouTubeApiPromise = new Promise((resolve, reject) => {
    const settleIfReady = () => {
      if (window.YT?.Player) {
        resolve(window.YT);
        return true;
      }
      return false;
    };

    if (settleIfReady()) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") {
        previousReady();
      }
      settleIfReady();
    };

    window.setTimeout(() => {
      if (!settleIfReady()) {
        reject(new Error("YouTube iframe api timeout"));
      }
    }, 15000);
  });

  return heroYouTubeApiPromise;
}

function ensureHeroYouTubeBackground(videoBackground) {
  let frame = videoBackground.querySelector(".hero-youtube-bg");
  if (!frame) {
    frame = document.createElement("div");
    frame.className = "hero-youtube-bg";
    frame.setAttribute("aria-hidden", "true");
    frame.innerHTML = '<div class="hero-youtube-player"></div>';

    const overlay = videoBackground.querySelector(".video-overlay");
    videoBackground.insertBefore(frame, overlay || videoBackground.firstChild);
  }

  return frame;
}

function mountHeroYouTubeBackground(videoBackground, youtubeUrl) {
  if (
    !videoBackground ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }

  const frame = ensureHeroYouTubeBackground(videoBackground);
  const playerHost = frame.querySelector(".hero-youtube-player");
  const poster = videoBackground.querySelector(".hero-youtube-poster");
  const videoId = extractYouTubeId(youtubeUrl);
  if (!playerHost || !videoId) return false;

  frame.classList.remove("loaded");
  if (poster) {
    poster.classList.remove("is-hidden");
  }

  ensureYouTubeIframeApi()
    .then((YT) => {
      if (!YT?.Player) {
        throw new Error("YouTube player unavailable");
      }

      if (
        heroYouTubePlayer &&
        typeof heroYouTubePlayer.destroy === "function"
      ) {
        heroYouTubePlayer.destroy();
      }

      playerHost.innerHTML = "";
      heroYouTubePlayer = new YT.Player(playerHost, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          mute: 1,
          playlist: videoId,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          vq: "hd1080",
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            preferHeroYouTubeQuality(event.target);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            preferHeroYouTubeQuality(event.target);
            if (event.data === YT.PlayerState.PLAYING) {
              frame.classList.add("loaded");
              if (poster) {
                poster.classList.add("is-hidden");
              }
            }
          },
          onError: () => {
            frame.classList.remove("loaded");
            if (poster) {
              poster.classList.remove("is-hidden");
            }
          },
        },
      });
    })
    .catch(() => {
      frame.classList.remove("loaded");
      if (poster) {
        poster.classList.remove("is-hidden");
      }
    });
  return true;
}

function applyHeroPosterImage(videoBackground, imageUrl) {
  if (!videoBackground || !imageUrl) return;
  const poster = ensureHeroPosterElement(videoBackground);
  poster.onerror = null;
  poster.src = imageUrl;
}

let heroVideoModal = null;

function ensureHeroVideoModal() {
  if (heroVideoModal) return heroVideoModal;

  const modal = document.createElement("div");
  modal.className = "hero-video-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="hero-video-dialog" role="dialog" aria-modal="true" aria-label="فيديو الموقع">
      <button class="hero-video-close" type="button" aria-label="إغلاق الفيديو">
        <i class="fas fa-times"></i>
      </button>
      <iframe
        title="GW Readymix Video"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <video
        playsinline
        controls
        preload="metadata"
      ></video>
    </div>
  `;

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest(".hero-video-close")) {
      closeHeroVideoModal();
    }
  });

  document.body.appendChild(modal);
  heroVideoModal = modal;
  return modal;
}

function openHeroVideoModal(videoUrl) {
  const embedUrl = buildYouTubeEmbedUrl(videoUrl, {
    autoplay: true,
    mute: false,
    controls: true,
    loop: false,
  });

  const modal = ensureHeroVideoModal();
  const iframe = modal.querySelector("iframe");
  const video = modal.querySelector("video");
  if (!iframe || !video) return;

  if (embedUrl) {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.style.display = "none";
    iframe.style.display = "block";
    iframe.src = embedUrl;
  } else {
    iframe.style.display = "none";
    iframe.src = "";
    video.style.display = "block";
    video.src = videoUrl;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeHeroVideoModal() {
  if (!heroVideoModal) return;

  const iframe = heroVideoModal.querySelector("iframe");
  const video = heroVideoModal.querySelector("video");
  if (iframe) iframe.src = "";
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  heroVideoModal.classList.remove("active");
  heroVideoModal.setAttribute("aria-hidden", "true");
  if (!projectModal?.classList.contains("active")) {
    document.body.style.overflow = "auto";
  }
}

function applyYouTubeHeroPoster(videoBackground, youtubeUrl) {
  if (!videoBackground) return;

  const poster = ensureHeroPosterElement(videoBackground);

  const sources = buildYouTubeThumbnailUrls(youtubeUrl);
  if (!sources.length) return;

  let currentIndex = 0;
  poster.onerror = () => {
    currentIndex += 1;
    if (currentIndex < sources.length) {
      poster.src = sources[currentIndex];
    }
  };
  poster.src = sources[currentIndex];
}

function renderProjectFallbackImage(projectTitle, imagePath) {
  videoContainer.className = "video-container video-container--image";
  videoContainer.innerHTML = `
    <img
      class="project-media-image"
      src="${imagePath || "assets/images/hero/hero-1.webp"}"
      alt="${projectTitle}"
      loading="lazy"
      decoding="async"
    >
  `;
}

function renderProjectModalContent(projectId) {
  const lang = getCurrentLanguage();
  const projectTitle = getProjectTitle(projectId, lang);
  const projects = getMockProjectsForProject(projectId, lang);

  const projectSpecificVideos = {
    2: "https://www.youtube.com/watch?v=DxPvE_5fVyU",
    5: "https://www.youtube.com/watch?v=hizI1NxVoOQ",
  };

  const projectImages = {
    2: "assets/images/projects/jeddah-central-stadium.webp",
    3: "assets/images/projects/briman-water-plant.webp",
    4: "assets/images/projects/education-campus.webp",
    5: "assets/images/projects/vida.png",
  };

  const showcaseVideoPath = projectSpecificVideos[projectId] || "";

  modalProjectTitle.textContent = projectTitle;

  videoContainer.className = "video-container video-container--loading";
  videoContainer.innerHTML = `
    <div class="video-loading-state">
      جاري تجهيز العرض...
    </div>
  `;

  const isYouTubeLink =
    showcaseVideoPath.includes("youtube.com") ||
    showcaseVideoPath.includes("youtu.be");

  if (!showcaseVideoPath) {
    renderProjectFallbackImage(projectTitle, projectImages[projectId]);
  } else {
    const youtubeEmbedUrl = buildYouTubeEmbedUrl(showcaseVideoPath, {
      autoplay: true,
      mute: true,
      controls: true,
      loop: false,
    });

    if (youtubeEmbedUrl) {
      videoContainer.className = "video-container video-container--ratio";
      videoContainer.innerHTML = `
        <iframe
          src="${youtubeEmbedUrl}"
          title="${projectTitle}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      `;
    } else {
      renderProjectFallbackImage(projectTitle, projectImages[projectId]);
    }
  }

  mockProjectsGrid.innerHTML = "";
  projects.forEach((project) => {
    const projectLink = document.createElement("a");
    projectLink.className = "mock-project-link";
    projectLink.href = "#";
    projectLink.setAttribute("role", "button");
    projectLink.addEventListener("click", (event) => {
      event.preventDefault();
      closeProjectModal();
      openProjectModal(project.projectId);
    });
    projectLink.innerHTML = `
      <i class="fas fa-external-link-alt"></i>
      <div class="mock-project-info">
        <h4>${project.title}</h4>
        <p>${project.desc}</p>
      </div>
    `;
    mockProjectsGrid.appendChild(projectLink);
  });
}

function openProjectModal(projectId) {
  currentProjectId = projectId;
  renderProjectModalContent(projectId);
  projectModal.classList.add("active");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  projectModal.classList.remove("active");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
  videoContainer.className = "video-container";
  videoContainer.innerHTML = "";
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    const projectId = card.getAttribute("data-project");
    openProjectModal(projectId);
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const projectId = card.getAttribute("data-project");
      openProjectModal(projectId);
    }
  });
});

const projectsGrid = document.querySelector(".projects-grid");
if (projectsGrid) {
  projectsGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card[data-project]");
    if (!card) return;
    const projectId = card.getAttribute("data-project");
    if (projectId) openProjectModal(projectId);
  });

  projectsGrid.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      const card = event.target.closest(".project-card[data-project]");
      if (!card) return;
      event.preventDefault();
      const projectId = card.getAttribute("data-project");
      if (projectId) openProjectModal(projectId);
    }
  });
}

modalClose.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && heroVideoModal?.classList.contains("active")) {
    closeHeroVideoModal();
    return;
  }
  if (e.key === "Escape" && projectModal.classList.contains("active")) {
    closeProjectModal();
  }
});

const galleryControllers = new Map();
const STATIC_CERTIFICATE_TITLES = {
  ar: [
    "شهادة نظام إدارة الجودة ISO 9001",
    "شهادة نظام الإدارة البيئية ISO 14001",
    "شهادة السلامة والصحة المهنية ISO 45001",
    "شهادة معايرة محطة الخلط والتحقق من أجهزة القياس",
    "شهادة برنامج ضبط الجودة للإنتاج",
    "اعتماد مختبر فحوصات المواد",
    "شهادة تأهيل المورد والامتثال التشغيلي",
    "شهادة مطابقة المنتج والمتطلبات الفنية",
    "شهادة سلامة الأسطول والامتثال للنقل",
    "شهادة الاستدامة وكفاءة استخدام الموارد",
    "شهادة الالتزام ببرنامج الصيانة الوقائية",
    "سجل التدقيق الداخلي والتحسين المستمر للجودة",
  ],
  en: [
    "ISO 9001 Quality Management System Certificate",
    "ISO 14001 Environmental Management System Certificate",
    "ISO 45001 Occupational Health and Safety Certificate",
    "Batching Plant Calibration and Measurement Verification Certificate",
    "Production Quality Control Program Certificate",
    "Materials Testing Laboratory Qualification",
    "Supplier Prequalification and Compliance Certificate",
    "Product Conformity and Technical Compliance Certificate",
    "Fleet Safety and Transport Compliance Certificate",
    "Sustainability and Resource Efficiency Certificate",
    "Preventive Maintenance Compliance Certificate",
    "Internal Quality Audit and Continuous Improvement Record",
  ],
};
const STATIC_APPROVAL_TITLES = {
  ar: [
    "ملف تأهيل المورد لمشاريع الجهات الحكومية",
    "اعتماد الاستشاري للمواد والخلطات الخرسانية",
    "نموذج اعتماد الخلطة الخرسانية للمشروع",
    "خطاب اعتماد المورد لمشروع بنية تحتية",
    "موافقة التوريد لمشروع سكني متعدد المراحل",
    "خطاب اعتماد الجهة المالكة لنطاق التوريد",
    "اعتماد مورد الخرسانة لموقع التنفيذ",
    "اعتماد جدول التوريد وخطة التشغيل",
    "اعتماد برنامج الفحوصات المخبرية والعينات",
    "اعتماد التوريد لمشروع تعليمي",
    "اعتماد التوريد لمشروع تجاري",
    "اعتماد الوثائق الفنية وبيانات المنتج",
    "سجل اعتماد المواد الموردة للمشروع",
    "اعتماد المقاول الرئيسي لنطاق التوريد",
    "الاعتماد النهائي لمورد الخرسانة الجاهزة",
  ],
  en: [
    "Government Project Supplier Prequalification File",
    "Consultant Material and Mix Approval",
    "Project Concrete Mix Approval Form",
    "Infrastructure Project Supplier Approval Letter",
    "Residential Multi-Phase Supply Approval",
    "Client Authority Supply Scope Approval",
    "Site Ready-Mix Supplier Approval",
    "Supply Schedule and Dispatch Plan Approval",
    "Laboratory Testing and Sampling Approval",
    "Education Project Supply Approval",
    "Commercial Project Supply Approval",
    "Technical Documentation and Product Data Approval",
    "Project Supplied Materials Approval Record",
    "Main Contractor Supply Scope Approval",
    "Final Ready-Mix Supplier Approval",
  ],
};

function buildStaticGalleryItems(
  totalItems,
  titlePrefix,
  imagePath,
  thumbPath,
  titles = [],
) {
  return Array.from({ length: totalItems }, (_, index) => {
    const itemNumber = index + 1;
    const title = titles[index] || `${titlePrefix} ${itemNumber}`;
    return {
      title,
      alt: title,
      image: `${imagePath}${itemNumber}.webp`,
      thumbnail: `${thumbPath}${itemNumber}.webp`,
    };
  });
}

function createGallerySlider(sliderId, items, options = {}) {
  const previousController = galleryControllers.get(sliderId);
  if (previousController && typeof previousController.destroy === "function") {
    previousController.destroy();
  }
  galleryControllers.delete(sliderId);

  const slider = document.getElementById(sliderId);
  const prevBtn = document.getElementById(
    sliderId.replace("-slider", "-prev-btn"),
  );
  const nextBtn = document.getElementById(
    sliderId.replace("-slider", "-next-btn"),
  );
  const counter = document.getElementById(
    sliderId.replace("-slider", "-counter"),
  );
  const thumbnails = document.getElementById(
    sliderId.replace("-slider", "-thumbnails"),
  );

  if (
    !slider ||
    !prevBtn ||
    !nextBtn ||
    !counter ||
    !thumbnails ||
    !Array.isArray(items) ||
    !items.length
  ) {
    return;
  }

  const section = slider.closest(".gallery-slider-section");
  const fullSize =
    options.fullSize ||
    (sliderId.includes("approvals")
      ? { w: 1273, h: 1650 }
      : { w: 2481, h: 3508 });
  const thumbSize =
    options.thumbSize ||
    (sliderId.includes("approvals")
      ? { w: 1273, h: 1650 }
      : { w: 2481, h: 3508 });
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const autoDelay = 3500;
  const placeholderFull =
    options.placeholderFull || "assets/images/gallery/placeholder-full.jpg";
  const placeholderThumb =
    options.placeholderThumb || "assets/images/gallery/placeholder-thumb.jpg";
  const normalizedItems = items
    .map((item, index) => ({
      title:
        item?.title ||
        `${options.fallbackTitlePrefix || ""} ${index + 1}`.trim(),
      alt:
        item?.alt ||
        item?.title ||
        `${options.fallbackTitlePrefix || ""} ${index + 1}`.trim(),
      image: item?.image || placeholderFull,
      thumbnail: item?.thumbnail || item?.image || placeholderThumb,
    }))
    .filter((item) => item.image);

  if (!normalizedItems.length) {
    slider.innerHTML = "";
    thumbnails.innerHTML = "";
    counter.textContent = "0 / 0";
    return;
  }

  slider.innerHTML = "";
  thumbnails.innerHTML = "";

  let currentSlide = 0;
  let autoTimer = null;
  let touchPauseTimeout = null;

  slider.setAttribute("tabindex", "0");
  const carousel = document.createElement("div");
  carousel.className = "cert-carousel";
  const track = document.createElement("div");
  track.className = "cert-track";
  track.setAttribute("dir", "ltr");
  carousel.appendChild(track);
  slider.appendChild(carousel);

  normalizedItems.forEach((item, index) => {
    const imageLoading = index === 0 ? "eager" : "lazy";
    const imageFetchPriority = index === 0 ? "high" : "auto";
    const slide = document.createElement("div");
    slide.className = "gallery-slide";
    slide.id = `${sliderId}-slide-${index}`;
    slide.innerHTML = `
                    <div class="certificate-stage">
                        <div class="certificate-glow">
                            <div class="certificate-frame">
                                <img loading="${imageLoading}" decoding="async" fetchpriority="${imageFetchPriority}" src="${item.image}" alt="${item.alt}" class="gallery-image certificate-image"
                                     width="${fullSize.w}" height="${fullSize.h}"
                                     onerror="this.src='${placeholderFull}'">
                            </div>
                        </div>
                    </div>
                    <div class="gallery-slide-content">
                        <div class="gallery-number">${index + 1}</div>
                        <div class="gallery-title">${item.title}</div>
                    </div>
                `;
    track.appendChild(slide);
  });

  normalizedItems.forEach((item, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `gallery-thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.dataset.index = index;
    thumbnail.innerHTML = `
                    <img loading="lazy" decoding="async" src="${item.thumbnail}" alt="${item.alt}"
                         width="${thumbSize.w}" height="${thumbSize.h}"
                         onerror="this.src='${placeholderThumb}'">
                `;
    thumbnails.appendChild(thumbnail);
  });

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    thumbnails
      .querySelectorAll(".gallery-thumbnail")
      .forEach((thumb, index) => {
        thumb.classList.toggle("active", index === currentSlide);
      });
    counter.textContent = `${currentSlide + 1} / ${normalizedItems.length}`;
  }

  function goToSlide(index, resetTimer = false) {
    currentSlide = (index + normalizedItems.length) % normalizedItems.length;
    updateSlider();
    if (resetTimer) restartAutoplay();
  }

  function nextSlide(resetTimer = false) {
    goToSlide(currentSlide + 1, resetTimer);
  }

  function prevSlide(resetTimer = false) {
    goToSlide(currentSlide - 1, resetTimer);
  }

  function stopAutoplay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    if (touchPauseTimeout) {
      clearTimeout(touchPauseTimeout);
      touchPauseTimeout = null;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion || normalizedItems.length < 2) return;
    stopAutoplay();
    autoTimer = setInterval(() => nextSlide(), autoDelay);
  }

  function restartAutoplay() {
    if (prefersReducedMotion || normalizedItems.length < 2) return;
    stopAutoplay();
    startAutoplay();
  }

  const onNextClick = () => nextSlide(true);
  const onPrevClick = () => prevSlide(true);
  const onThumbClick = (event) => {
    const thumb = event.target.closest(".gallery-thumbnail");
    if (!thumb) return;
    const index = Number(thumb.dataset.index || 0);
    goToSlide(index, true);
  };
  const onMouseEnter = () => stopAutoplay();
  const onMouseLeave = () => startAutoplay();
  const onTouchStart = () => stopAutoplay();
  const onTouchResume = () => {
    touchPauseTimeout = setTimeout(startAutoplay, 400);
  };
  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      prevSlide(true);
    } else if (event.key === "ArrowRight") {
      nextSlide(true);
    }
  };

  nextBtn.addEventListener("click", onNextClick);
  prevBtn.addEventListener("click", onPrevClick);
  thumbnails.addEventListener("click", onThumbClick);
  carousel.addEventListener("mouseenter", onMouseEnter);
  carousel.addEventListener("mouseleave", onMouseLeave);
  carousel.addEventListener("touchstart", onTouchStart, { passive: true });
  carousel.addEventListener("touchend", onTouchResume, { passive: true });
  carousel.addEventListener("touchcancel", onTouchResume, { passive: true });
  slider.addEventListener("keydown", onKeyDown);

  let observer = null;
  if ("IntersectionObserver" in window && section) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      },
      { threshold: [0, 0.4, 1] },
    );
    observer.observe(section);
  } else {
    startAutoplay();
  }

  updateSlider();

  galleryControllers.set(sliderId, {
    destroy() {
      stopAutoplay();
      if (observer) observer.disconnect();
      nextBtn.removeEventListener("click", onNextClick);
      prevBtn.removeEventListener("click", onPrevClick);
      thumbnails.removeEventListener("click", onThumbClick);
      carousel.removeEventListener("mouseenter", onMouseEnter);
      carousel.removeEventListener("mouseleave", onMouseLeave);
      carousel.removeEventListener("touchstart", onTouchStart);
      carousel.removeEventListener("touchend", onTouchResume);
      carousel.removeEventListener("touchcancel", onTouchResume);
      slider.removeEventListener("keydown", onKeyDown);
    },
  });
}

function setupGalleries(preferredLang) {
  const lang = preferredLang === "en" ? "en" : "ar";
  const certificatePrefix = lang === "en" ? "Certificate" : "شهادة";
  const approvalPrefix = lang === "en" ? "Approval" : "اعتماد";
  const certificatesNote = document.getElementById("certificates-note");
  const approvalsNote = document.getElementById("approvals-note");

  if (certificatesNote) certificatesNote.style.display = "";
  if (approvalsNote) approvalsNote.style.display = "";

  createGallerySlider(
    "certificates-slider",
    buildStaticGalleryItems(
      12,
      certificatePrefix,
      "assets/images/gallery/certs/cert_",
      "assets/images/gallery/certs/cert_",
      STATIC_CERTIFICATE_TITLES[lang],
    ),
    { fallbackTitlePrefix: certificatePrefix },
  );

  createGallerySlider(
    "approvals-slider",
    buildStaticGalleryItems(
      15,
      approvalPrefix,
      "assets/images/gallery/approvals/approval_",
      "assets/images/gallery/approvals/approval_",
      STATIC_APPROVAL_TITLES[lang],
    ),
    {
      fallbackTitlePrefix: approvalPrefix,
      fullSize: { w: 1273, h: 1650 },
      thumbSize: { w: 1273, h: 1650 },
    },
  );
}

function getLocalizedField(item, lang, arKey, enKey, fallback = "") {
  if (!item || typeof item !== "object") return fallback;
  if (lang === "en") {
    return item[enKey] || item[arKey] || fallback;
  }
  return item[arKey] || item[enKey] || fallback;
}

function normalizePartnerPublicItem(item) {
  return {
    id: item?.id || "",
    name_ar: item?.name_ar || "",
    name_en: item?.name_en || "",
    logo: item?.logo || "",
    url: item?.url || "",
  };
}

function normalizeCertificatePublicItem(item) {
  return {
    id: item?.id || "",
    title_ar: item?.title_ar || "",
    title_en: item?.title_en || "",
    image: item?.image || "",
    date: item?.date || "",
  };
}

function normalizeGalleryPublicItem(item) {
  return {
    id: item?.id || "",
    title_ar: item?.title_ar || "",
    title_en: item?.title_en || "",
    image: item?.image || "",
    category: item?.category || "",
  };
}

async function fetchPublicCollection(endpoint) {
  try {
    const response = await fetch(endpoint, { credentials: "same-origin" });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    return [];
  }
}

function renderPartnersMarquee(items, lang) {
  const marquee = document.querySelector("#partners .partners-marquee");
  if (!marquee || !Array.isArray(items) || !items.length) return false;

  const localizedItems = items
    .map(normalizePartnerPublicItem)
    .map((item) => ({
      ...item,
      name: getLocalizedField(item, lang, "name_ar", "name_en").trim(),
    }))
    .filter((item) => item.logo && item.name);

  if (!localizedItems.length) return false;

  marquee.innerHTML = "";
  const loopItems = localizedItems.concat(localizedItems);

  loopItems.forEach((item, index) => {
    const isDuplicate = index >= localizedItems.length;
    const partnerNode = item.url
      ? document.createElement("a")
      : document.createElement("div");
    partnerNode.className = "partner-logo";
    partnerNode.style.textDecoration = "none";
    partnerNode.style.color = "inherit";

    if (item.url) {
      partnerNode.href = item.url;
      partnerNode.target = "_blank";
      partnerNode.rel = "noopener";
    }

    if (isDuplicate) {
      partnerNode.classList.add("is-duplicate");
      partnerNode.setAttribute("aria-hidden", "true");
      partnerNode.setAttribute("tabindex", "-1");
    }

    const logo = document.createElement("img");
    logo.loading = "lazy";
    logo.decoding = "async";
    logo.src = item.logo;
    logo.alt = item.name;
    logo.className = "partner-img";
    logo.width = 200;
    logo.height = 200;

    const text = document.createElement("div");
    text.className = "partner-text";
    text.textContent = item.name;

    partnerNode.appendChild(logo);
    partnerNode.appendChild(text);
    marquee.appendChild(partnerNode);
  });

  const partnersNote = document.getElementById("partners-note");
  if (partnersNote) partnersNote.style.display = "none";
  return true;
}

function refreshPartnersMarquee() {
  const marquee = document.querySelector("#partners .partners-marquee");
  if (!marquee) return;

  marquee.querySelectorAll(".partner-logo.is-duplicate").forEach((node) => {
    node.remove();
  });

  const originals = Array.from(
    marquee.querySelectorAll(".partner-logo:not(.is-duplicate)"),
  );
  if (!originals.length) return;

  originals.forEach((node) => {
    const clone = node.cloneNode(true);
    clone.classList.add("is-duplicate");
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");

    if (clone.tagName.toLowerCase() === "a") {
      clone.tabIndex = -1;
    }

    clone.querySelectorAll("[id]").forEach((element) => {
      element.id = `${element.id}-dup`;
    });

    marquee.appendChild(clone);
  });
}

function renderCertificatesFromApi(items, lang) {
  if (!Array.isArray(items) || !items.length) return false;

  const titlePrefix = lang === "en" ? "Certificate" : "شهادة";
  const galleryItems = items
    .map(normalizeCertificatePublicItem)
    .filter((item) => item.image)
    .map((item, index) => {
      const title = getLocalizedField(
        item,
        lang,
        "title_ar",
        "title_en",
        `${titlePrefix} ${index + 1}`,
      ).trim();
      return {
        title,
        alt: title,
        image: item.image,
        thumbnail: item.image,
      };
    });

  if (!galleryItems.length) return false;

  createGallerySlider("certificates-slider", galleryItems, {
    fallbackTitlePrefix: titlePrefix,
  });
  const certificatesNote = document.getElementById("certificates-note");
  if (certificatesNote) certificatesNote.style.display = "none";
  return true;
}

function renderApprovalsFromApi(items, lang) {
  if (!Array.isArray(items) || !items.length) return false;

  const approvalCategories = new Set([
    "approval",
    "approvals",
    "approval-paper",
    "approval-papers",
    "project-approval",
    "project-approvals",
    "اعتماد",
    "اعتمادات",
  ]);

  const titlePrefix = lang === "en" ? "Approval" : "اعتماد";
  const galleryItems = items
    .map(normalizeGalleryPublicItem)
    .filter((item) => item.image)
    .filter((item) =>
      approvalCategories.has(
        String(item.category || "")
          .trim()
          .toLowerCase(),
      ),
    )
    .map((item, index) => {
      const title = getLocalizedField(
        item,
        lang,
        "title_ar",
        "title_en",
        `${titlePrefix} ${index + 1}`,
      ).trim();
      return {
        title,
        alt: title,
        image: item.image,
        thumbnail: item.image,
      };
    });

  if (!galleryItems.length) return false;

  createGallerySlider("approvals-slider", galleryItems, {
    fallbackTitlePrefix: titlePrefix,
    fullSize: { w: 1273, h: 1650 },
    thumbSize: { w: 1273, h: 1650 },
  });
  const approvalsNote = document.getElementById("approvals-note");
  if (approvalsNote) approvalsNote.style.display = "none";
  return true;
}

function setupConcreteCalculation() {
  const quantityInput = document.getElementById("quantity");
  const quantityDisplay = document.getElementById("quantityDisplay");

  quantityInput.addEventListener("input", function () {
    const quantity = parseFloat(this.value) || 0;
    if (quantity > 0) {
      quantityDisplay.textContent = `${quantity.toFixed(2)} م³`;
      quantityDisplay.classList.add("show");
    } else {
      quantityDisplay.classList.remove("show");
    }
  });

  if (quantityInput.value) {
    const quantity = parseFloat(quantityInput.value) || 0;
    if (quantity > 0) {
      quantityDisplay.textContent = `${quantity.toFixed(2)} م³`;
      quantityDisplay.classList.add("show");
    }
  }
}

function openExternalUrl(url) {
  if (!url) return false;

  const opened = window.open(url, "_blank", "noopener");
  if (opened) return true;

  window.location.href = url;
  return true;
}

const leadFormConfig = Object.freeze({
  provider: window.GW_SITE_CONFIG?.leadForms?.provider || "google-apps-script",
  recipientEmail:
    window.GW_SITE_CONFIG?.leadForms?.recipientEmail ||
    "naserabdalmoneim@gmail.com",
  relayEndpoint: (window.GW_SITE_CONFIG?.leadForms?.relayEndpoint || "").trim(),
  endpoint: (window.GW_SITE_CONFIG?.leadForms?.endpoint || "").trim(),
  sharedSecret: (window.GW_SITE_CONFIG?.leadForms?.sharedSecret || "").trim(),
  accessKey: (window.GW_SITE_CONFIG?.leadForms?.accessKey || "").trim(),
  fallbackToMailto:
    window.GW_SITE_CONFIG?.leadForms?.fallbackToMailto !== false,
  web3formsEndpoint: "https://api.web3forms.com/submit",
});

function getLeadFlowCopy() {
  const isEn = document.documentElement.lang === "en";
  return isEn
    ? {
        newsletterPrepared:
          "Your newsletter request has been sent successfully.",
        newsletterPreparedFallback:
          "Your email app has been opened to complete the newsletter request.",
        newsletterFailed:
          "We could not send your newsletter request. Please try again shortly.",
        requiredFields:
          "Please fill in the required fields: name, email, phone, and message.",
        acceptTerms: "Please accept the policies to continue.",
        sending: '<i class="fas fa-spinner fa-spin"></i> Sending...',
        requestPrepared:
          "Your project request has been sent successfully. Our team will review it shortly.",
        requestPreparedFallback:
          "Your email app has been opened with the request details. Complete sending to finish the request.",
        requestFailed:
          "We could not send your request right now. Please try again shortly.",
        honeypotPrepared:
          "Your request has been received successfully and will be reviewed shortly.",
      }
    : {
        newsletterPrepared: "تم إرسال طلب الاشتراك في النشرة بنجاح.",
        newsletterPreparedFallback:
          "تم فتح تطبيق البريد لإكمال طلب الاشتراك في النشرة.",
        newsletterFailed:
          "تعذر إرسال طلب الاشتراك الآن. حاول مرة أخرى بعد قليل.",
        requiredFields:
          "يرجى تعبئة الحقول المطلوبة: الاسم، البريد، الهاتف، الرسالة",
        choosePayment: "فضلاً اختر طريقة الدفع.",
        acceptTerms: "فضلاً وافق على السياسات للمتابعة.",
        sending: '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...',
        requestPrepared: "تم إرسال طلبك بنجاح وسيتم مراجعته من فريقنا قريبًا.",
        requestPreparedFallback:
          "تم فتح تطبيق البريد مع تفاصيل الطلب. أكمل الإرسال لإتمام الطلب.",
        requestFailed: "تعذر إرسال الطلب الآن. حاول مرة أخرى بعد قليل.",
        honeypotPrepared: "تم استلام الطلب بنجاح وسيتم مراجعته قريبًا.",
      };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getLeadStatusTitle(kind, tone, mode = "direct") {
  const isEn = document.documentElement.lang === "en";

  if (kind === "newsletter") {
    if (tone === "error") {
      return isEn ? "Newsletter not sent" : "تعذر إرسال الاشتراك";
    }

    if (mode === "mailto" || tone === "info") {
      return isEn ? "Complete the email draft" : "أكمل إرسال الرسالة";
    }

    return isEn ? "Subscription confirmed" : "تم تأكيد الاشتراك";
  }

  if (tone === "error") {
    return isEn ? "Unable to send request" : "تعذر إرسال الطلب";
  }

  if (mode === "mailto" || tone === "info") {
    return isEn ? "Complete the email draft" : "أكمل إرسال الرسالة";
  }

  return isEn ? "Request sent successfully" : "تم إرسال الطلب بنجاح";
}

function setLeadStatus(element, kind, message, options = {}) {
  if (!element) return;

  const tone = options.tone || "success";
  const mode = options.mode || "direct";
  const iconClass =
    tone === "error"
      ? "fa-circle-exclamation"
      : tone === "info"
        ? "fa-paper-plane"
        : "fa-circle-check";

  element.classList.remove(
    "lead-status--success",
    "lead-status--error",
    "lead-status--info",
    "is-visible",
  );
  element.classList.add("lead-status", `lead-status--${tone}`, "is-visible");
  element.innerHTML = `
    <span class="lead-status-icon" aria-hidden="true">
      <i class="fas ${iconClass}"></i>
    </span>
    <span class="lead-status-copy">
      <strong class="lead-status-title">${escapeHtml(
        getLeadStatusTitle(kind, tone, mode),
      )}</strong>
      <span class="lead-status-message">${escapeHtml(message)}</span>
    </span>
  `;
}

function clearLeadStatus(element) {
  if (!element) return;
  element.classList.remove(
    "lead-status--success",
    "lead-status--error",
    "lead-status--info",
    "is-visible",
  );
  element.innerHTML = "";
}

function getProjectInquiryLabels(isEn) {
  return isEn
    ? {
        heading: "New project inquiry",
        fullName: "Name",
        email: "Email",
        phone: "Phone",
        productType: "Product Type",
        concreteType: "Concrete Type",
        quantity: "Quantity (m3)",
        projectLocation: "Project Location",
        message: "Project Details",
        page: "Page URL",
        language: "Language",
        submittedAt: "Submitted At",
        utmSource: "UTM Source",
        utmMedium: "UTM Medium",
        utmCampaign: "UTM Campaign",
      }
    : {
        heading: "استفسار مشروع جديد",
        fullName: "الاسم",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        productType: "نوع المنتج",
        concreteType: "نوع الخرسانة",
        quantity: "الكمية (م³)",
        projectLocation: "موقع المشروع",
        message: "تفاصيل المشروع",
        page: "رابط الصفحة",
        language: "اللغة",
        submittedAt: "وقت الإرسال",
        utmSource: "مصدر الزيارة",
        utmMedium: "وسيط الزيارة",
        utmCampaign: "حملة الزيارة",
      };
}

function getConcreteTypeLabels(isEn) {
  return isEn
    ? {
        normal: "Normal Concrete",
        resistant: "Resistant Concrete",
      }
    : {
        normal: "خرسانة عادية",
        resistant: "خرسانة مقاومة",
      };
}

function buildNewsletterLeadFields(formData) {
  const isEn = document.documentElement.lang === "en";
  return {
    secret: leadFormConfig.sharedSecret,
    type: "newsletter",
    email: formData.email || "",
    source: "website",
    lang: isEn ? "en" : "ar",
    page_url: window.location.href,
    created_at: formData.timestamp || new Date().toISOString(),
    timestamp: formData.timestamp || new Date().toISOString(),
    user_agent: navigator.userAgent || "",
    notify_to: leadFormConfig.recipientEmail,
  };
}

function buildProjectInquiryFields(payload) {
  const isEn = document.documentElement.lang === "en";
  const concreteTypeLabels = getConcreteTypeLabels(isEn);
  const concreteType =
    concreteTypeLabels[payload.concreteType] || payload.concreteType;
  const productType = payload.productTypeLabel || payload.productType;

  return {
    secret: leadFormConfig.sharedSecret,
    type: "inquiry",
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    product_type: productType,
    concrete_type: concreteType,
    quantity: payload.quantity,
    project_location: payload.projectLocation,
    lang: isEn ? "en" : "ar",
    message: payload.message,
    page_url: payload.page_url || window.location.href,
    created_at: payload.timestamp || new Date().toISOString(),
    timestamp: payload.timestamp || new Date().toISOString(),
    user_agent: navigator.userAgent || "",
    source: "website",
    notify_to: leadFormConfig.recipientEmail,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
  };
}

function buildLeadMailtoUrl(subject, fields, replyTo = "") {
  const labelMap = {
    secret: "Secret",
    type: "Type",
    full_name: "Full Name",
    email: "Email",
    phone: "Phone",
    product_type: "Product Type",
    concrete_type: "Concrete Type",
    quantity: "Quantity",
    project_location: "Project Location",
    lang: "Language",
    message: "Message",
    page_url: "Page URL",
    created_at: "Created At",
    timestamp: "Timestamp",
    user_agent: "User Agent",
    source: "Source",
    notify_to: "Notify To",
    utm_source: "UTM Source",
    utm_medium: "UTM Medium",
    utm_campaign: "UTM Campaign",
  };
  const lines = Object.entries(fields)
    .filter(
      ([key, value]) =>
        key !== "secret" &&
        value !== undefined &&
        value !== null &&
        `${value}`.trim(),
    )
    .map(([key, value]) => `${labelMap[key] || key}: ${String(value).trim()}`);

  if (replyTo) {
    lines.push(`Reply-To: ${replyTo}`);
  }

  return `mailto:${leadFormConfig.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function buildLeadSubmissionBody(subject, fields, replyTo = "", honey = "") {
  const body = new FormData();
  body.append("access_key", leadFormConfig.accessKey);
  body.append("subject", subject);
  body.append("from_name", "Golden Western Website");
  body.append("botcheck", honey || "");

  if (replyTo) {
    body.append("replyto", replyTo);
  }

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const normalized = String(value).trim();
    if (!normalized) return;
    body.append(key, normalized);
  });

  return body;
}

function buildLeadJsonPayload(subject, fields, replyTo = "", honey = "") {
  const payload = {
    subject,
    recipientEmail: leadFormConfig.recipientEmail,
    replyTo: replyTo || "",
    honeypot: honey || "",
    provider: leadFormConfig.provider,
    ...fields,
  };

  if (
    !payload.secret &&
    leadFormConfig.sharedSecret &&
    !leadFormConfig.relayEndpoint
  ) {
    payload.secret = leadFormConfig.sharedSecret;
  }

  return payload;
}

function resolveLeadEndpoint() {
  return leadFormConfig.relayEndpoint || leadFormConfig.endpoint;
}

function isGoogleAppsScriptUrl(url) {
  return /script\.google(?:usercontent)?\.com/i.test(url || "");
}

async function submitLeadForm(subject, fields, replyTo = "", honey = "") {
  const fallbackUrl = buildLeadMailtoUrl(subject, fields, replyTo);

  if (leadFormConfig.provider === "google-apps-script") {
    const targetEndpoint = resolveLeadEndpoint();

    if (!targetEndpoint) {
      if (leadFormConfig.fallbackToMailto && openExternalUrl(fallbackUrl)) {
        return { ok: true, mode: "mailto" };
      }

      throw new Error("Lead endpoint is not configured");
    }

    try {
      const requestPayload = buildLeadJsonPayload(
        subject,
        fields,
        replyTo,
        honey,
      );
      const isDirectAppsScript =
        !leadFormConfig.relayEndpoint && isGoogleAppsScriptUrl(targetEndpoint);

      if (isDirectAppsScript) {
        await fetch(targetEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(requestPayload),
        });

        return { ok: true, mode: "apps-script" };
      }

      const response = await fetch(targetEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const payload = await response.json().catch(() => ({}));
      if (response.ok && (payload.ok === true || payload.success === true)) {
        return { ok: true, mode: "relay", payload };
      }

      if (leadFormConfig.fallbackToMailto && openExternalUrl(fallbackUrl)) {
        return { ok: true, mode: "mailto", payload };
      }

      throw new Error(
        payload.message || payload.error || "Lead relay rejected the request",
      );
    } catch (error) {
      if (leadFormConfig.fallbackToMailto && openExternalUrl(fallbackUrl)) {
        return { ok: true, mode: "mailto", error };
      }

      throw error;
    }
  }

  if (leadFormConfig.provider === "web3forms" && !leadFormConfig.accessKey) {
    if (leadFormConfig.fallbackToMailto && openExternalUrl(fallbackUrl)) {
      return { ok: true, mode: "mailto" };
    }

    throw new Error("Lead form access key is not configured");
  }

  try {
    const response = await fetch(leadFormConfig.web3formsEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: buildLeadSubmissionBody(subject, fields, replyTo, honey),
    });

    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.success === true) {
      return { ok: true, mode: "web3forms", payload };
    }

    if (leadFormConfig.fallbackToMailto && openExternalUrl(fallbackUrl)) {
      return { ok: true, mode: "mailto", payload };
    }

    throw new Error(
      payload.message || payload.error || "Lead submission failed",
    );
  } catch (error) {
    if (leadFormConfig.fallbackToMailto && openExternalUrl(fallbackUrl)) {
      return { ok: true, mode: "mailto", error };
    }

    throw error;
  }
}

async function submitNewsletterLead(formData) {
  const isEn = document.documentElement.lang === "en";
  const subject = isEn
    ? "Newsletter Subscription Request"
    : "طلب اشتراك في النشرة البريدية";

  return submitLeadForm(
    subject,
    buildNewsletterLeadFields(formData),
    formData.email || "",
  );
}

async function submitProjectInquiryLead(payload) {
  const isEn = document.documentElement.lang === "en";
  const subject = isEn ? "Project Inquiry Request" : "طلب استفسار مشروع";

  return submitLeadForm(
    subject,
    buildProjectInquiryFields(payload),
    payload.email || "",
    payload.company || "",
  );
}

function resetQuantityDisplay() {
  const quantityDisplay = document.getElementById("quantityDisplay");
  if (!quantityDisplay) return;

  quantityDisplay.textContent = "0 م³";
  quantityDisplay.classList.remove("show");
}

function disableTextAssistance(root = document) {
  root
    .querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"], input[type="search"], textarea',
    )
    .forEach((field) => {
      field.spellcheck = false;
      field.autocapitalize = "off";
      field.setAttribute("autocorrect", "off");
    });
}

const translations = {
  en: {
    companyName: "Golden Western",
    companyTagline: "Ready-Mix Concrete & Contracting",

    nav: [
      "Home",
      "About",
      "Why Choose Us",
      "Products",
      "Projects",
      "Partners",
      "Blog",
      "Certificates",
      "Approval ",
      "Contact",
    ],
    quoteBtn: "Get Quote",
    themeLightLabel: "Light mode",
    themeDarkLabel: "Dark mode",
    mobileThemeLight: "Light",
    mobileThemeDark: "Dark",
    "mobile-home": "Home",
    "mobile-about": "About",
    "mobile-why": "Why Choose Us",
    "mobile-products": "Products",
    "mobile-projects": "Projects",
    "mobile-partners": "Partners",
    "mobile-blog": "Blog",
    "mobile-certificates": "Certificates",
    "mobile-approvals": "Approval ",
    "mobile-contact": "Contact",
    heroBadge: "Reliable Ready-Mix Supply in Jeddah Since 2012",
    heroTitle: "Reliable Ready-Mix",
    heroSubtitle: "For Predictable Pour Performance",
    heroDesc:
      "Golden Western supports contractors, developers, and infrastructure teams with controlled batching, disciplined dispatch, and site-ready delivery coordination.",
    exploreBtn: "View Projects",
    contactBtn: "Contact Us",
    heroWhatsapp: "WhatsApp Business",
    heroResponseNote: "Operational response during working hours",
    heroPlayAria: "Play site video",
    trust1: "ISO 9001 / 14001 / 45001 Certified",
    trust2: "Aligned with Saudi code requirements",
    trust3: "Fleet of 100+ mixers",
    trust4: "More than 10 years of experience",
    stat1: "Years Experience",
    stat2: "Batching Plants",
    "stat-stations": "Stations",
    stat3: "Transit Mixers",
    stat4: "Mobile Pumps",

    aboutTitle: "About Golden Western",
    aboutDesc:
      "An operational ready-mix supplier serving residential, infrastructure, and development projects across Jeddah.",
    aboutKicker: "Operating Scope",
    aboutLead:
      "We combine plant capacity, laboratory control, and dispatch discipline to support projects that require dependable supply performance.",
    aboutText:
      "Our focus is not only concrete strength. It is stable batching, clear pour planning, documented quality checks, and communication that keeps site teams aligned.",
    aboutPoint1:
      "In-house laboratory control for slump, temperature, and workability checks.",
    aboutPoint2:
      "Fleet and dispatch readiness for scheduled and time-sensitive pours.",
    aboutPoint3:
      "Pre-pour engineering coordination with consultants and site teams.",
    aboutImageCaption:
      "Disciplined dispatch and coordinated pours for major developments",
    aboutMiniTitle1: "Mix Control Lab",
    aboutMiniDesc1:
      "Documented production checks with continuous result review.",
    aboutMiniTitle2: "Dispatch Control",
    aboutMiniDesc2:
      "Route planning and truck allocation that protect pour timing.",
    aboutMiniTitle3: "Field Readiness",
    aboutMiniDesc3:
      "Operational coordination before supply and during active pours.",
    aboutNote:
      "This overview reflects the plant's current operating scope and supply model.",
    aboutProfileBadge: "Company Profile",
    aboutProfileTitle: "Open the official company profile",
    aboutProfileText:
      "A PDF overview covering plant profile, operating scope, services, projects, and key credentials.",
    aboutProfileViewLabel: "View Profile",
    aboutProfileDownloadLabel: "Download PDF",

    whyTitle: "Why Choose Golden Western",
    whyDesc:
      "Documented quality, operating readiness, and disciplined delivery for time-sensitive projects.",
    "feature-nrmca-title": "NRMCA Certified",
    "feature-nrmca-desc":
      "An internationally recognized credential that reflects disciplined ready-mix production and consistent quality practices.",
    "feature-code-title": "Saudi Code Compliant",
    "feature-code-desc":
      "Concrete production aligned with applicable Saudi code requirements and approved project specifications.",
    feature1Title: "Integrated QHSE Standards",
    feature1Desc:
      "Documented management systems for quality, environmental practices, and occupational safety.",
    feature2Title: "Automated Production Control",
    feature2Desc:
      "Batching systems and monitored inputs that help keep mix performance consistent.",
    feature3Title: "Temperature Management",
    feature3Desc:
      "Temperature-controlled mixes supported by ice plants and hot-weather concreting procedures.",
    feature4Title: "Delivery Fleet Readiness",
    feature4Desc:
      "Mixers and pumps coordinated through dispatch planning to protect schedule reliability.",
    feature5Title: "Testing & Verification",
    feature5Desc:
      "Routine testing and documented checks that support traceability and confidence.",
    feature6Title: "Technical Support Team",
    feature6Desc:
      "Engineers and operations staff who coordinate mix selection, scheduling, and site requirements.",
    productsTitle: "Ready-Mix Solutions",
    productsDesc:
      "Core concrete solutions for residential buildings, infrastructure packages, and project-specific structural requirements.",
    product1Title: "Standard Structural Mixes",
    product1Desc:
      "Routine structural grades for slabs, footings, walls, and general reinforced concrete works.",
    product2Title: "High-Strength Mixes",
    product2Desc:
      "Designed for heavily loaded elements, towers, transfer zones, and demanding structural spans.",
    product3Title: "Specialty Concrete",
    product3Desc:
      "Purpose-built mixes for congested reinforcement, durability exposure, and project-specific performance criteria.",
    product4Title: "Temperature-Controlled Mixes",
    product4Desc:
      "Hot-weather concrete with temperature management to protect workability and early-age performance.",
    projectsTitle: "Featured Projects",
    projectsDesc:
      "Selected ready-mix supply references across sports, housing, utilities, and education developments.",
    projectsNote:
      "Selected reference projects supplied across sports, residential, infrastructure, and education sectors.",
    project2Tag1: "Residential",
    project2Tag2: "Phased Supply",
    project2Tag3: "Housing",
    project3Tag1: "Specialized Mix",
    project3Tag2: "Infrastructure",
    project3Tag3: "Moisture Resistance",
    project4Tag1: "Education",
    project4Tag2: "Mixed Use",
    project5Tag1: "Residential",
    project5Tag2: "Temperature Control",
    project2Title: "Tower of Diamond Offers",
    project2Desc:
      "Carried out continuously for over 15 hours, with precise coordination of concrete pouring operations using multiple pumps to ensure high quality and efficient execution.",
    project2Meta2Label: "Cubic Meters",
    project2Meta3Label: "Floor",
    project3Title: "Buraiman Water Plant",
    project3Desc:
      "Concrete works for a critical water infrastructure facility requiring specialized mixes and strong durability under moisture exposure.",
    project3Meta1Label: "Completion Year",
    project3Meta2Label: "Cubic Meters",
    project3Meta3Label: "Capacity (m³/day)",
    project4Title: "Al Andalus Education Campus",
    project4Desc:
      "Controlled concrete supply for multiple education buildings with strict schedule demands and reliable structural performance.",
    project4Meta1Label: "Completion Year",
    project4Meta2Label: "Cubic Meters",
    project4Meta3Label: "Buildings Constructed",
    project5Title: "Al Rashidiya Residential Complex",
    project5Desc:
      "High-performance ready-mix supply for a residential complex with durable thermal control to meet finishing and operational requirements.",
    project5Meta1Label: "Completion Year",
    project5Meta2Label: "Cubic Meters",
    project5Meta3Label: "Residential Building",
    mockProjectsTitle: "Similar Projects",

    partnersTitle: "Featured Development Partners",
    partnersDesc:
      "A clearer view of developers and contractors that relied on Golden Western across residential, education, and infrastructure work.",
    partnersNote:
      "Selected partner references presented as a trust section, not a moving banner, so logos and names stay easier to scan.",
    partner1: "Iqnaa Real Estate",
    partner2: "Afaq Real Estate Development",
    partner3: "Darco Development",
    partner4: "Al Moayyed Group",
    partner5: "RAZ Real Estate",
    partner6: "Rawabet Development",
    partner7: "Etmam Arabia",

    blogTitle: "Ready-Mix Concrete Insights",
    blogDesc:
      "Technical articles that help project teams choose the right mix, plan pours, and reduce execution risk.",
    blogNote: "",
    blog1Date: "Mar 28, 2026",
    blog1Category: "Ready-Mix",
    blog1Read: "7 min read",
    blog1Badge: "Featured Article",
    blog1Title:
      "Ready-Mix Concrete in Jeddah: Types, Uses, and Selection Criteria",
    blog1Excerpt:
      "A practical guide to mix selection, pricing factors, and quality checks before approval.",
    readMore1: "Read More",
    blog2Date: "Mar 16, 2026",
    blog2Category: "Hot Weather",
    blog2Read: "6 min read",
    blog2Badge: "Field Operations",
    blog2Title: "Hot Weather Concreting in Saudi Arabia: Best Practices",
    blog2Excerpt:
      "Steps to control temperature, transport time, and curing to protect strength.",
    readMore2: "Read More",
    blog3Date: "Mar 5, 2026",
    blog3Category: "Quality & Tests",
    blog3Read: "8 min read",
    blog3Badge: "Quality Lab",
    blog3Title: "Key Ready-Mix Quality Tests from Plant to Site",
    blog3Excerpt:
      "Essential tests to verify concrete quality and compliance at each stage.",
    readMore3: "Read More",
    blogViewAll: "View All Articles",

    certificatesTitle: "Certifications",
    certificatesDesc:
      "Our accreditations that reflect our commitment to quality, safety, and sustainability",
    certificatesNote:
      "A reference set of quality, safety, calibration, and compliance certificates supporting plant and supply operations.",

    approvalsTitle: "Project Approvals",
    approvalsDesc:
      "Reference approval files that demonstrate technical readiness, supplier qualification, and documented supply acceptance for major projects",
    approvalsNote:
      "Reference approval files covering supplier prequalification, technical approvals, and project-side supply acceptance.",

    newsletterTitle: "Stay Updated",
    newsletterDesc:
      "Subscribe to our newsletter for the latest updates, industry insights, and project highlights.",
    newsletterPlaceholder: "Enter your email address",
    newsletterLabel: "Email address",
    subscribeBtn: "Subscribe",
    contactTitle: "Get In Touch",
    contactDesc:
      "Talk to our team to review mix requirements, pour scheduling, and a commercial quotation for your project.",
    locationTitle: "Our Location",
    locationText:
      "Building 9054, Abu Wajahah Al-Murshidi, Al-Murrah District, Jeddah, Saudi Arabia",
    phoneTitle: "Phone Numbers",
    phoneText: "0 5 44 58 44 58<br>05 04 100 55 4",
    emailTitle: "Email Address",
    emailText: "info@golden-western.sa",
    submitBtn: "Send Inquiry",
    formName: "Full Name",
    formEmail: "Email Address",
    formPhone: "Phone Number",
    formMessage: "Project Details",
    formNameLabel: "Full name",
    formEmailLabel: "Email address",
    formPhoneLabel: "Phone number",
    productSelectLabel: "Product type",
    quantityLabel: "Required quantity (m³)",
    projectLocationLabel: "Project location",
    formMessageLabel: "Project details",
    concreteTypeLabel: "Concrete type",

    productSelectPlaceholder: "Select Product Type (Optional)",
    productOptions: {
      "15mpa": "15 MPA (5 bags)",
      "20mpa": "20 MPA (6 bags)",
      "25mpa": "25 MPA (7 bags)",
      "30mpa": "30 MPA (8 bags)",
      "35mpa": "35 MPA (9 bags)",
      "40mpa": "40 MPA (10 bags)",
      "fast-setting": "Fast-setting Concrete (3-5-7 days)",
      colored: "Colored Concrete",
      foam: "Foam Concrete",
      special: "Special Specifications Concrete",
    },
    concreteNormal: "Normal Concrete",
    concreteResistant: "Resistant Concrete",
    quantityPlaceholder: "Required Quantity (m³) (Optional)",
    projectLocationPlaceholder: "Project Location (Optional)",
    consentPrefix: "I confirm the accuracy of the data and agree to the",
    consentPrivacy: "Privacy Policy",
    consentTerms: "Terms & Conditions",
    consentRefund: "Refund & Cancellation Policy",
    consentAnd: "and",
    consentError: "Please agree to the policies to continue.",

    quickLinks: "Quick Links",
    servicesLinks: "Services",
    contactFooter: "Contact Info",
    footerDesc:
      "Leading the construction industry with quality, innovation, and sustainability since 2012.",
    "footer-link-home": "Home",
    "footer-link-about": "About Us",
    "footer-link-why": "Why Choose Us",
    "footer-link-products": "Products",
    "footer-link-projects": "Projects",
    "footer-link-partners": "Partners",
    "footer-link-blog": "Blog",
    "footer-link-certificates": "Certificates",
    "footer-link-approvals": "Approval ",
    "footer-link-contact": "Contact Us",
    "footer-link-quote": "Get Quote",
    "privacy-policy-link": "Privacy Policy",
    "terms-link": "Terms & Conditions",
    "refund-link": "Refund & Cancellation Policy",
    footerPoliciesTitle: "Site Policies",
    footerPolicyMainPrivacy: "Privacy Policy",
    footerPolicyMainTerms: "Terms & Conditions",
    footerPolicyMainRefund: "Refund & Cancellation Policy",
    footerCopyrightCompany: "Golden Western Ready-Mix Concrete",
    footerCopyrightRights: "All rights reserved.",
    skipLink: "Skip to content",
    stickyCall: "Call",
    stickyWhatsapp: "WhatsApp",
    stickyQuote: "Quote",
    stickyCallAria: "Call us",
    stickyWhatsappAria: "WhatsApp",
    stickyQuoteAria: "Get Quote",
    backToTopAria: "Back to top",
    topBarLocation: "Jeddah, Saudi Arabia",
    topBarHours: "Sat - Thu: 7:00 AM - 5:00 PM",
    topBarPhone: "+966 5 44 58 44 58",
    topBarEmail: "info@golden-western.sa",
  },
  ar: {
    companyName: "مصنع الغربية الذهبية",
    companyTagline: "للخرسانة الجاهزة",

    nav: [
      "الرئيسية",
      "من نحن",
      "لماذا نحن",
      "المنتجات",
      "المعرض",
      "الشركاء",
      "المدونة",
      "الشهادات",
      "الاعتمادات",
      "اتصل بنا",
    ],
    quoteBtn: "اطلب عرض سعر",
    themeLightLabel: "الوضع الفاتح",
    themeDarkLabel: "الوضع الداكن",
    mobileThemeLight: "فاتح",
    mobileThemeDark: "داكن",
    "mobile-home": "الرئيسية",
    "mobile-about": "من نحن",
    "mobile-why": "لماذا نحن",
    "mobile-products": "المنتجات",
    "mobile-projects": "المعرض",
    "mobile-partners": "الشركاء",
    "mobile-blog": "المدونة",
    "mobile-certificates": "الشهادات",
    "mobile-approvals": "الاعتمادات",
    "mobile-contact": "اتصل بنا",
    heroBadge: "توريد خرسانة جاهزة موثوق في جدة منذ 2012",
    heroTitle: "خرسانة جاهزة موثوقة",
    heroSubtitle: "نبني الأساس لمشاريع المستقبل",
    heroDesc:
      "تدعم الغربية الذهبية المقاولين والمطورين وفرق البنية التحتية في جدة عبر خلطات منضبطة، وجدولة تشغيل دقيقة، وتنسيق توريد جاهز للموقع.",
    exploreBtn: "عرض المشاريع",
    contactBtn: "اتصل بنا",
    heroWhatsapp: "واتساب",
    heroResponseNote: "استجابة تشغيلية خلال ساعات العمل",
    heroPlayAria: "تشغيل فيديو الموقع",
    trust1: "شهادات ISO 9001 / 14001 / 45001",
    trust2: "متوافق مع متطلبات الكود السعودي",
    trust3: "أسطول يتجاوز 100 خلاطة",
    trust4: "أكثر من 10 سنوات خبرة",
    stat1: "سنوات خبرة",
    stat2: "محطات خلط",
    "stat-stations": "محطات",
    stat3: "شاحنات خلاطة",
    stat4: "مضخات متحركة",

    aboutTitle: "عن مصنع الغربية الذهبية",
    aboutDesc:
      "منشأة تشغيلية متخصصة في إنتاج وتوريد الخرسانة الجاهزة لمشاريع السكن والبنية التحتية والتطوير في جدة.",
    aboutKicker: "نطاق التشغيل",
    aboutLead:
      "نجمع بين الطاقة الإنتاجية، وضبط المختبر، وانضباط الترحيل لدعم المشاريع التي تحتاج إلى موثوقية عالية في التوريد.",
    aboutText:
      "تركيزنا لا يقتصر على مقاومة الخرسانة فقط، بل يشمل ثبات الخلط، ووضوح خطة الصب، وتوثيق فحوص الجودة، والتواصل الذي يبقي فرق الموقع على تنسيق واحد.",
    aboutPoint1:
      "مختبر داخلي لمتابعة الهبوط، ودرجة الحرارة، وقابلية التشغيل قبل التوريد.",
    aboutPoint2:
      "مختبرات متنقلة لإجراء الفحوصات الميدانية وتعزيز ضبط الجودة أثناء عمليات الصب.",
    aboutPoint3:
      "تنسيق فني مسبق مع الاستشاريين وفرق الموقع قبل الصب وأثناء التنفيذ.",
    aboutPoint4:
      "جاهزية أسطول وترحيل لدعم الصبات المجدولة والحالات الحرجة زمنياً.",
    aboutImageCaption: "تنسيق وتنفيذ صب الخرسانة للمشاريع الكبرى",
    aboutMiniTitle1: "مختبر وضبط خلطة",
    aboutMiniDesc1: "فحوص تشغيلية موثقة ومراجعة مستمرة لنتائج الإنتاج.",
    aboutMiniTitle2: "إدارة الترحيل",
    aboutMiniDesc2: "تخطيط المسارات وتوزيع الخلاطات لحماية توقيت الصب.",
    aboutMiniTitle3: "جاهزية ميدانية",
    aboutMiniDesc3: "تنسيق تشغيلي قبل التوريد وأثناء الصبات النشطة.",
    aboutNote:
      "تعكس هذه الواجهة نطاق التشغيل الحالي ونموذج التوريد المعتمد للمصنع.",
    aboutProfileBadge: "بروفايل الشركة",
    aboutProfileTitle: "استعرض الملف التعريفي الرسمي",
    aboutProfileText:
      "ملف PDF يتضمن نبذة المصنع، نطاق الخدمات، الجاهزية التشغيلية، وأبرز المشاريع والاعتمادات.",
    aboutProfileViewLabel: "عرض البروفايل",
    aboutProfileDownloadLabel: "تحميل PDF",

    whyTitle: "لماذا تختار مصنع الغربية الذهبية",
    whyDesc:
      "جودة موثقة، وجاهزية تشغيلية، وتسليم منضبط للمشاريع الحساسة زمنياً.",
    "feature-nrmca-title": "اعتماد NRMCA",
    "feature-nrmca-desc":
      "اعتماد دولي يعكس انضباط إنتاج الخرسانة الجاهزة واستقرار ممارسات الجودة التشغيلية.",
    "feature-code-title": "متوافق مع الكود السعودي",
    "feature-code-desc":
      "إنتاج خرسانة يراعي متطلبات الكود السعودي المعمول بها ومواصفات المشاريع المعتمدة.",
    feature1Title: "منظومة جودة وسلامة موثقة",
    feature1Desc:
      "أنظمة إدارة موثقة للجودة والممارسات البيئية والسلامة المهنية ضمن تشغيل المصنع.",
    feature2Title: "تحكم إنتاج آلي",
    feature2Desc:
      "أنظمة خلط ومتابعة مدخلات تساعد على الحفاظ على ثبات أداء الخلطة.",
    feature3Title: "إدارة درجة الحرارة",
    feature3Desc:
      "خلطات متحكم في حرارتها مدعومة بمصانع ثلج وإجراءات صب للطقس الحار.",
    feature4Title: "جاهزية الأسطول",
    feature4Desc:
      "خلاطات ومضخات تُدار عبر تخطيط ترحيل يحمي موثوقية الجدول الزمني.",
    feature5Title: "اختبارات وتحقق",
    feature5Desc:
      "فحوص دورية وسجلات تحقق تدعم التتبع وتمنح فرق المشروع ثقة أكبر.",
    feature6Title: "فريق دعم فني",
    feature6Desc:
      "مهندسون وفرق تشغيل ينسقون اختيار الخلطة، والجدولة، ومتطلبات الموقع.",
    productsTitle: "حلول الخرسانة الجاهزة",
    productsDesc:
      "حلول أساسية لمشاريع السكن والبنية التحتية والمتطلبات الإنشائية الخاصة.",
    product1Title: "خلطات إنشائية قياسية",
    product1Desc:
      "درجات تشغيلية معتادة للبلاطات والقواعد والجدران ومعظم الأعمال الخرسانية المسلحة.",
    product2Title: "خلطات عالية المقاومة",
    product2Desc:
      "مصممة للعناصر ذات الأحمال المرتفعة، والأبراج، ومناطق التحويل، والبحور الإنشائية الصعبة.",
    product3Title: "خرسانة خاصة",
    product3Desc:
      "خلطات مصممة للتسليح الكثيف، ومتطلبات المتانة، ومعايير الأداء الخاصة بكل مشروع.",
    product4Title: "خلطات متحكم في حرارتها",
    product4Desc:
      "خرسانة للطقس الحار مع إدارة للحرارة تحافظ على التشغيلية والأداء المبكر بعد الصب.",
    projectsTitle: "مشاريع مميزة",
    projectsDesc:
      "مراجع توريد مختارة عبر قطاعات الرياضة والسكن والمرافق والتعليم.",
    projectsNote:
      "نماذج من مشاريع تم توريدها عبر قطاعات رياضية وسكنية وبنية تحتية وتعليمية.",
    project2Tag1: "سكني",
    project2Tag2: "توريد مرحلي",
    project2Tag3: "إسكان",
    project3Tag1: "خلطات خاصة",
    project3Tag2: "بنية تحتية",
    project3Tag3: "مقاومة للرطوبة",
    project4Tag1: "تعليمي",
    project4Tag2: "متعدد الاستخدام",
    project5Tag1: "تعليمي",
    project5Tag2: "تحكم حراري",
    project2Title: "مشروع برج موتيارا فيلا ",
    project2Desc:
      " بتنفيذ متواصل لأكثر من 15 ساعة مع تنسيق دقيق لعمليات الصب باستخدام عدة مضخات لضمان الجودة والكفاءة في التنفيذ.",
    project2Meta2Label: "متر مكعب",
    project2Meta3Label: "طابق",
    project3Title: "محطة بريمان للمياه",
    project3Desc:
      "أعمال خرسانية لمرفق مائي حيوي تتطلب خلطات متخصصة ومقاومة تشغيلية عالية في بيئات الرطوبة.",
    project3Meta1Label: "سنة الانتهاء",
    project3Meta2Label: "متر مكعب",
    project3Meta3Label: "الطاقة (م³/يوم)",
    project4Title: "حرم مدارس الأندلس التعليمية",
    project4Desc:
      "توريد خرسانة منضبط لمبانٍ تعليمية متعددة مع مراعاة الجداول الزمنية الصارمة ومتطلبات التشطيب والسلامة.",
    project4Meta1Label: "سنة الانتهاء",
    project4Meta2Label: "متر مكعب",
    project4Meta3Label: "مبنى مشيد",
    project5Title: "مشروع فيدا",
    project5Desc:
      "استخدام وتنسيق لعمليات الصب باستخدام عدة مضخات لضمان الدقة والجودة.",
    project5Meta1Label: "سنة الانتهاء",
    project5Meta2Label: "متر مكعب",
    project5Meta3Label: "مبنى سكني",
    mockProjectsTitle: "مشاريع مماثلة",

    partnersTitle: "شركاء التطوير والتنفيذ",
    partnersDesc:
      "عرض أوضح لجهات التطوير والمقاولين الذين اعتمدوا على الغربية الذهبية في مشاريع سكنية وتعليمية وبنية تحتية.",
    partnersNote:
      "نماذج مرجعية من شركاء التطوير والتنفيذ قُدمت هنا بشكل ثابت وواضح لسهولة قراءة الأسماء والشعارات.",
    partner1: "شركة إقناع العقارية",
    partner2: "شركة آفاق للتطوير العقاري",
    partner3: "داركو للتطوير",
    partner4: "مجموعة المؤيد",
    partner5: "شركة راز العقارية",
    partner6: "روابط للتطوير العقاري",
    partner7: "إتمام العربية",

    blogTitle: "مقالات ورؤى الخرسانة الجاهزة",
    blogDesc:
      "مقالات فنية تساعد فرق المشروع على اختيار الخلطة الصحيحة، وتخطيط الصب، وتقليل مخاطر التنفيذ.",
    blogNote: "",
    blog1Date: "٢٨ مارس ٢٠٢٦",
    blog1Category: "الخرسانة الجاهزة",
    blog1Read: "٧ دقائق قراءة",
    blog1Badge: "مقال مميز",
    blog1Title:
      "دليل الخرسانة الجاهزة في جدة: الأنواع والاستخدامات وأهم معايير الاختيار",
    blog1Excerpt:
      "خريطة عملية لاختيار الخلطة المناسبة، تقدير التكلفة، والتأكد من الجودة قبل اعتماد التوريد.",
    readMore1: "قراءة المزيد",
    blog2Date: "١٦ مارس ٢٠٢٦",
    blog2Category: "الأجواء الحارة",
    blog2Read: "٦ دقائق قراءة",
    blog2Badge: "تشغيل موقعي",
    blog2Title:
      "الخرسانة في الأجواء الحارة بالسعودية: أفضل الممارسات لتقليل التشققات وفقدان الجودة",
    blog2Excerpt:
      "خطوات عملية للتحكم في الحرارة، زمن النقل، والمعالجة لضمان قوة التحمل.",
    readMore2: "قراءة المزيد",
    blog3Date: "٥ مارس ٢٠٢٦",
    blog3Category: "الجودة والاختبارات",
    blog3Read: "٨ دقائق قراءة",
    blog3Badge: "مختبر الجودة",
    blog3Title: "أهم اختبارات جودة الخرسانة الجاهزة من المصنع حتى موقع المشروع",
    blog3Excerpt:
      "دليل الاختبارات الأساسية التي تضمن مطابقة الخلطة للمواصفات في كل مرحلة.",
    readMore3: "قراءة المزيد",
    blogViewAll: "عرض جميع المقالات",

    certificatesTitle: "الشهادات",
    certificatesDesc:
      "اعتماداتنا التي تعكس التزامنا بالجودة والسلامة والاستدامة",
    certificatesNote:
      "مجموعة مرجعية من شهادات الجودة والسلامة والمعايرة والامتثال الداعمة لتشغيل المصنع والتوريد.",

    approvalsTitle: "اعتمادات المشاريع",
    approvalsDesc:
      "ملفات اعتماد مرجعية توضح الجاهزية الفنية، تأهيل المورد، واعتمادات التوريد للمشاريع والاستشاريين",
    approvalsNote:
      "ملفات اعتماد مرجعية تشمل التأهيل الفني، اعتماد الخلطات، وجدولة التوريد وقبول المورد بالمشروع.",

    newsletterTitle: "اشترك في النشرة",
    newsletterDesc:
      "استقبل آخر أخبار الخرسانة والعروض والتحديثات مباشرة إلى بريدك.",
    newsletterPlaceholder: "اكتب بريدك الإلكتروني",
    newsletterLabel: "البريد الإلكتروني",
    subscribeBtn: "اشترك الآن",
    contactTitle: "اتصل بنا",
    contactDesc:
      "تواصل مع فريقنا لمراجعة متطلبات الخلطة، وجدولة الصب، وإعداد عرض سعر مناسب لمشروعك.",
    locationTitle: "الموقع",
    locationText:
      "9054 مبنى أبو واجهة المرشدي، حي المروة، جدة، المملكة العربية السعودية",
    phoneTitle: "هاتف",
    phoneText: "0 5 44 58 44 58<br>05 04 100 55 4",
    emailTitle: "البريد الإلكتروني",
    emailText: "info@golden-western.sa",
    submitBtn: "إرسال الرسالة",
    formName: "الاسم الكامل",
    formEmail: "البريد الإلكتروني",
    formPhone: "رقم الجوال",
    formMessage: "تفاصيل المشروع",
    formNameLabel: "الاسم الكامل",
    formEmailLabel: "البريد الإلكتروني",
    formPhoneLabel: "رقم الهاتف",
    productSelectLabel: "نوع المنتج",
    quantityLabel: "الكمية المطلوبة (م³)",
    projectLocationLabel: "موقع المشروع",
    formMessageLabel: "تفاصيل المشروع",
    concreteTypeLabel: "نوع الخرسانة",

    productSelectPlaceholder: "اختر نوع المنتج (اختياري)",
    productOptions: {
      "15mpa": "15 MPA (5 أكياس)",
      "20mpa": "20 MPA (6 أكياس)",
      "25mpa": "25 MPA (7 أكياس)",
      "30mpa": "30 MPA (8 أكياس)",
      "35mpa": "35 MPA (9 أكياس)",
      "40mpa": "40 MPA (10 أكياس)",
      "fast-setting": "خرسانة سريعة الشك (3-5-7 أيام)",
      colored: "خرسانة ملونة",
      foam: "خرسانة رغوية",
      special: "خرسانة مواصفات خاصة",
    },
    concreteNormal: "خرسانة عادية",
    concreteResistant: "خرسانة مقاومة",
    quantityPlaceholder: "الكمية المطلوبة (م³) (اختياري)",
    projectLocationPlaceholder: "موقع المشروع (اختياري)",
    paymentMethodLabel: "طريقة الدفع",
    paymentOptionCash: "كاش (دفع كامل)",
    paymentOptionBank: "تحويل بنكي",
    paymentNote1:
      "اختيار طريقة الدفع هو تفضيل مبدئي فقط، وليس عملية دفع فعلية أو اتفاقًا ملزمًا.",
    paymentNote2: "سنتواصل معك لتأكيد الطلب ومشاركة عرض السعر النهائي.",
    paymentError: "فضلاً اختر طريقة الدفع.",
    consentPrefix: "أقرّ بصحة البيانات وأوافق على",
    consentPrivacy: "سياسة الخصوصية",
    consentTerms: "الشروط والأحكام",
    consentRefund: "سياسة الاسترجاع والإلغاء",
    consentAnd: "و",
    consentError: "فضلاً وافق على السياسات للمتابعة.",

    quickLinks: "روابط سريعة",
    servicesLinks: "الخدمات",
    contactFooter: "معلومات الاتصال",
    footerDesc: "قيادة صناعة البناء بالجودة والابتكار والاستدامة منذ عام 2012.",
    "footer-link-home": "الرئيسية",
    "footer-link-about": "من نحن",
    "footer-link-why": "لماذا نحن",
    "footer-link-products": "المنتجات",
    "footer-link-projects": "المعرض",
    "footer-link-partners": "الشركاء",
    "footer-link-blog": "المدونة",
    "footer-link-certificates": "الشهادات",
    "footer-link-approvals": "الاعتمادات",
    "footer-link-contact": "اتصل بنا",
    "footer-link-quote": "اطلب عرض سعر",
    "privacy-policy-link": "سياسة الخصوصية",
    "terms-link": "الشروط والأحكام",
    "refund-link": "سياسة الاسترجاع والإلغاء",
    footerPoliciesTitle: "سياسات الموقع",
    footerPolicyMainPrivacy: "سياسة الخصوصية",
    footerPolicyMainTerms: "الشروط والأحكام",
    footerPolicyMainRefund: "سياسة الاسترجاع والإلغاء",
    footerCopyrightCompany: "مصنع الغربية الذهبية للخرسانة الجاهزة",
    footerCopyrightRights: "جميع الحقوق محفوظة.",
    skipLink: "تخطي إلى المحتوى",
    stickyCall: "اتصل",
    stickyWhatsapp: "واتساب",
    stickyQuote: "عرض سعر",
    stickyCallAria: "اتصل بنا",
    stickyWhatsappAria: "واتساب",
    stickyQuoteAria: "اطلب عرض سعر",
    backToTopAria: "العودة للأعلى",
    topBarLocation: "جدة، المملكة العربية السعودية",
    topBarHours: "من السبت إلى الخميس: ٧ ص - ٥ م",
    topBarPhone: "+966 5 44 58 44 58",
    topBarEmail: "info@golden-western.sa",
  },
};

Object.assign(translations.en, {
  heroBadge:
    "Certified Ready-Mix Concrete Supply in Jeddah for Residential and Commercial Projects",
  heroTitle: "Ready-Mix Concrete in Jeddah",
  heroSubtitle: "Controlled Supply and Reliable Quality for Saudi Projects",
  heroDesc:
    "Golden Western supplies ready-mix concrete in Jeddah for contractors, developers, and infrastructure teams with specification-driven batching, disciplined dispatch, and dependable pour scheduling.",
  aboutDesc:
    "Golden Western is a ready-mix concrete supplier in Jeddah serving residential, commercial, and infrastructure projects with controlled operations, in-house quality assurance, and dependable delivery capacity.",
  productsDesc:
    "Ready-mix concrete solutions including standard structural mixes, high-strength concrete, and project-specific mixes for residential, commercial, and infrastructure work in Jeddah and Saudi Arabia.",
  blogDesc:
    "Practical articles on ready-mix concrete in Saudi Arabia, concrete strength selection, hot weather concreting, quality testing, and reducing on-site execution risk.",
  blogTopicsHtml:
    '<span class="blog-topic-label">Explore topics:</span><a class="blog-topic-chip" href="blog/hot-weather-concreting-saudi-arabia/">Hot weather concreting</a><a class="blog-topic-chip" href="blog/how-to-choose-concrete-strength/">Concrete strength selection</a><a class="blog-topic-chip" href="blog/types-of-concrete-differences/">Concrete types and uses</a>',
  contactDesc:
    "Contact Golden Western to review mix specifications, quantities, and pour schedules, and get a quotation for ready-mix concrete supply in Jeddah.",
});

Object.assign(translations.ar, {
  heroBadge: "توريد خرسانة جاهزة معتمدة في جدة للمشاريع السكنية والتجارية",
  heroTitle: "خرسانة جاهزة في جدة",
  heroSubtitle: "نبني الاساس لمشاريع المستقيل",
  heroDesc:
    "توفر الغربية الذهبية حلول الخرسانة الجاهزة في جدة للمقاولين والمطورين، مع خلطات مطابقة للمواصفات، وجدولة صب دقيقة، وخدمة توريد تدعم مشاريع السكن والبنية التحتية والتطوير التجاري.",
  aboutDesc:
    "الغربية الذهبية مورد خرسانة جاهزة في جدة يخدم المشاريع السكنية والتجارية والبنية التحتية، مع تشغيل منضبط، ومختبر جودة داخلي، وقدرة توريد تناسب متطلبات المشاريع المتوسطة والكبيرة.",
  productsDesc:
    "حلول خرسانة جاهزة تشمل الخلطات القياسية وعالية المقاومة والخلطات الخاصة للمشاريع السكنية والتجارية ومشاريع البنية التحتية في جدة والسعودية.",
  blogDesc:
    "مقالات عملية حول الخرسانة الجاهزة في السعودية: اختيار المقاومة، الصب في الأجواء الحارة، اختبارات الجودة، وتقليل أخطاء التنفيذ في الموقع.",
  blogTopicsHtml:
    '<span class="blog-topic-label">مواضيع مهمة:</span><a class="blog-topic-chip" href="blog/hot-weather-concreting-saudi-arabia/">الأجواء الحارة</a><a class="blog-topic-chip" href="blog/how-to-choose-concrete-strength/">اختيار المقاومة</a><a class="blog-topic-chip" href="blog/types-of-concrete-differences/">أنواع الخرسانة</a>',
  contactDesc:
    "تواصل مع فريق الغربية الذهبية لمراجعة مواصفات الخلطة والكميات وجدولة الصب، والحصول على عرض سعر لتوريد الخرسانة الجاهزة في جدة.",
});

function toggleTheme(theme, persist = true) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  syncThemeButtons(theme);
  if (persist) {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }
  syncNavOffset();
}

function syncNavOffset() {
  const topBar = document.querySelector(".top-bar");
  const isHidden =
    !topBar || window.getComputedStyle(topBar).display === "none";
  const offset = isHidden ? 0 : topBar.offsetHeight;
  document.documentElement.style.setProperty("--top-bar-offset", `${offset}px`);
}

function syncLanguageButtons(lang) {
  document.querySelectorAll(".lang-btn").forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncThemeButtons(theme) {
  document.querySelectorAll(".theme-btn").forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateContent(lang) {
  const content = translations[lang];
  const isRTL = lang === "ar";
  const setFooterLink = (id, label) => {
    const link = document.getElementById(id);
    if (link) link.innerHTML = `<i class="fas fa-chevron-left"></i> ${label}`;
  };

  document.body.classList.toggle("rtl", isRTL);
  document.body.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = isRTL ? "ar" : "en";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  syncLanguageButtons(lang);
  document
    .querySelectorAll('.theme-btn[data-theme="light"]')
    .forEach((button) => {
      button.setAttribute("aria-label", content.themeLightLabel);
    });
  document
    .querySelectorAll('.theme-btn[data-theme="dark"]')
    .forEach((button) => {
      button.setAttribute("aria-label", content.themeDarkLabel);
    });
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) skipLink.textContent = content.skipLink;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const setHTML = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  };

  const marquee = document.querySelector(".partners-marquee-container");
  if (marquee) marquee.dir = "ltr";

  setText("company-name", content.companyName);
  setText("company-tagline", content.companyTagline);
  document
    .querySelectorAll(".mobile-company-name, .footer-company-name")
    .forEach((el) => (el.textContent = content.companyName));
  document
    .querySelectorAll(".footer-company-tagline")
    .forEach((el) => (el.textContent = content.companyTagline));

  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link, index) => {
    if (content.nav[index]) {
      link.textContent = content.nav[index];
    }
  });

  setText("mobile-home", content["mobile-home"]);
  setText("mobile-about", content["mobile-about"]);
  setText("mobile-why", content["mobile-why"]);
  setText("mobile-products", content["mobile-products"]);
  setText("mobile-projects", content["mobile-projects"]);
  setText("mobile-partners", content["mobile-partners"]);
  setText("mobile-blog", content["mobile-blog"]);
  setText("mobile-certificates", content["mobile-certificates"]);
  setText("mobile-approvals", content["mobile-approvals"]);
  setText("mobile-contact", content["mobile-contact"]);
  const mobileThemeLightLabel = document.getElementById(
    "mobile-theme-light-label",
  );
  if (mobileThemeLightLabel) {
    mobileThemeLightLabel.textContent = content.mobileThemeLight;
  }
  const mobileThemeDarkLabel = document.getElementById(
    "mobile-theme-dark-label",
  );
  if (mobileThemeDarkLabel) {
    mobileThemeDarkLabel.textContent = content.mobileThemeDark;
  }

  setText("quoteBtnText", content.quoteBtn);
  const mobileQuoteBtnText = document.getElementById("mobileQuoteBtnText");
  if (mobileQuoteBtnText) {
    mobileQuoteBtnText.textContent = content.quoteBtn;
  }

  setText("hero-badge", content.heroBadge);
  setHTML(
    "hero-title",
    `${content.heroTitle}<br><span>${content.heroSubtitle}</span>`,
  );
  setText("hero-subtitle", content.heroDesc);
  setText("explore-btn", content.exploreBtn);
  setText("contact-btn", content.contactBtn);
  const heroPlayBtn = document.getElementById("heroPlayBtn");
  if (heroPlayBtn) heroPlayBtn.setAttribute("aria-label", content.heroPlayAria);
  const heroWhatsapp = document.getElementById("hero-whatsapp");
  if (heroWhatsapp) {
    const heroWhatsappLabel = heroWhatsapp.querySelector("span");
    if (heroWhatsappLabel) heroWhatsappLabel.textContent = content.heroWhatsapp;
  }
  const heroResponseNote = document.getElementById("hero-response-note");
  if (heroResponseNote) heroResponseNote.textContent = content.heroResponseNote;
  ["trust1", "trust2", "trust3", "trust4"].forEach((trustKey) => {
    const trustLabel = document.getElementById(`${trustKey}-label`);
    if (trustLabel) trustLabel.textContent = content[trustKey];
  });

  setText("stat1", content.stat1);
  setText("stat2", content.stat2);
  setText("stat-stations", content["stat-stations"]);
  setText("stat3", content.stat3);
  setText("stat4", content.stat4);

  setText("about-title", content.aboutTitle);
  setText("about-desc", content.aboutDesc);
  const aboutKicker = document.getElementById("about-kicker");
  if (aboutKicker) aboutKicker.textContent = content.aboutKicker;
  const aboutLead = document.getElementById("about-lead");
  if (aboutLead) aboutLead.textContent = content.aboutLead;
  const aboutText = document.getElementById("about-text");
  if (aboutText) aboutText.textContent = content.aboutText;
  const aboutPoint1 = document.getElementById("about-point1");
  if (aboutPoint1) aboutPoint1.textContent = content.aboutPoint1;
  const aboutPoint2 = document.getElementById("about-point2");
  if (aboutPoint2) aboutPoint2.textContent = content.aboutPoint2;
  const aboutPoint3 = document.getElementById("about-point3");
  if (aboutPoint3) aboutPoint3.textContent = content.aboutPoint3;
  const aboutPoint4 = document.getElementById("about-point4");
  if (aboutPoint4) aboutPoint4.textContent = content.aboutPoint4;
  const aboutImageCaption = document.getElementById("about-image-caption");
  if (aboutImageCaption)
    aboutImageCaption.textContent = content.aboutImageCaption;
  const aboutMiniTitle1 = document.getElementById("about-mini-title1");
  const aboutMiniDesc1 = document.getElementById("about-mini-desc1");
  if (aboutMiniTitle1) aboutMiniTitle1.textContent = content.aboutMiniTitle1;
  if (aboutMiniDesc1) aboutMiniDesc1.textContent = content.aboutMiniDesc1;
  const aboutMiniTitle2 = document.getElementById("about-mini-title2");
  const aboutMiniDesc2 = document.getElementById("about-mini-desc2");
  if (aboutMiniTitle2) aboutMiniTitle2.textContent = content.aboutMiniTitle2;
  if (aboutMiniDesc2) aboutMiniDesc2.textContent = content.aboutMiniDesc2;
  const aboutMiniTitle3 = document.getElementById("about-mini-title3");
  const aboutMiniDesc3 = document.getElementById("about-mini-desc3");
  if (aboutMiniTitle3) aboutMiniTitle3.textContent = content.aboutMiniTitle3;
  if (aboutMiniDesc3) aboutMiniDesc3.textContent = content.aboutMiniDesc3;
  const aboutNote = document.getElementById("about-note");
  if (aboutNote) aboutNote.textContent = content.aboutNote;
  const aboutProfileBadge = document.getElementById("about-profile-badge");
  if (aboutProfileBadge)
    aboutProfileBadge.textContent = content.aboutProfileBadge;
  const aboutProfileTitle = document.getElementById("about-profile-title");
  if (aboutProfileTitle)
    aboutProfileTitle.textContent = content.aboutProfileTitle;
  const aboutProfileText = document.getElementById("about-profile-text");
  if (aboutProfileText) aboutProfileText.textContent = content.aboutProfileText;
  const aboutProfileViewLabel = document.getElementById(
    "about-profile-view-label",
  );
  if (aboutProfileViewLabel)
    aboutProfileViewLabel.textContent = content.aboutProfileViewLabel;
  const aboutProfileDownloadLabel = document.getElementById(
    "about-profile-download-label",
  );
  if (aboutProfileDownloadLabel)
    aboutProfileDownloadLabel.textContent = content.aboutProfileDownloadLabel;

  document.getElementById("why-title").textContent = content.whyTitle;
  document.getElementById("why-desc").textContent = content.whyDesc;

  document.getElementById("feature-nrmca-title").textContent =
    content["feature-nrmca-title"];
  document.getElementById("feature-nrmca-desc").textContent =
    content["feature-nrmca-desc"];

  document.getElementById("feature-code-title").textContent =
    content["feature-code-title"];
  document.getElementById("feature-code-desc").textContent =
    content["feature-code-desc"];

  document.getElementById("feature1-title").textContent = content.feature1Title;
  document.getElementById("feature1-desc").textContent = content.feature1Desc;
  document.getElementById("feature2-title").textContent = content.feature2Title;
  document.getElementById("feature2-desc").textContent = content.feature2Desc;
  document.getElementById("feature3-title").textContent = content.feature3Title;
  document.getElementById("feature3-desc").textContent = content.feature3Desc;
  document.getElementById("feature4-title").textContent = content.feature4Title;
  document.getElementById("feature4-desc").textContent = content.feature4Desc;
  document.getElementById("feature5-title").textContent = content.feature5Title;
  document.getElementById("feature5-desc").textContent = content.feature5Desc;
  document.getElementById("feature6-title").textContent = content.feature6Title;
  document.getElementById("feature6-desc").textContent = content.feature6Desc;

  document.getElementById("products-title").textContent = content.productsTitle;
  document.getElementById("products-desc").textContent = content.productsDesc;
  document.getElementById("product1-title").textContent = content.product1Title;
  document.getElementById("product1-desc").textContent = content.product1Desc;
  document.getElementById("product2-title").textContent = content.product2Title;
  document.getElementById("product2-desc").textContent = content.product2Desc;
  document.getElementById("product3-title").textContent = content.product3Title;
  document.getElementById("product3-desc").textContent = content.product3Desc;
  document.getElementById("product4-title").textContent = content.product4Title;
  document.getElementById("product4-desc").textContent = content.product4Desc;

  document.getElementById("projects-title").textContent = content.projectsTitle;
  document.getElementById("projects-desc").textContent = content.projectsDesc;
  const projectsNote = document.getElementById("projects-note");
  if (projectsNote) projectsNote.textContent = content.projectsNote;

  document.getElementById("project2-title").textContent = content.project2Title;
  document.getElementById("project2-desc").textContent = content.project2Desc;
  const project2Meta1Label = document.getElementById("project2-meta1-label");
  if (project2Meta1Label)
    project2Meta1Label.textContent = content.project2Meta1Label;
  document.getElementById("project2-meta2-label").textContent =
    content.project2Meta2Label;
  document.getElementById("project2-meta3-label").textContent =
    content.project2Meta3Label;
  document.getElementById("project3-title").textContent = content.project3Title;
  document.getElementById("project3-desc").textContent = content.project3Desc;
  document.getElementById("project3-meta1-label").textContent =
    content.project3Meta1Label;
  document.getElementById("project3-meta2-label").textContent =
    content.project3Meta2Label;
  document.getElementById("project3-meta3-label").textContent =
    content.project3Meta3Label;
  document.getElementById("project4-title").textContent = content.project4Title;
  document.getElementById("project4-desc").textContent = content.project4Desc;
  document.getElementById("project4-meta1-label").textContent =
    content.project4Meta1Label;
  document.getElementById("project4-meta2-label").textContent =
    content.project4Meta2Label;
  document.getElementById("project4-meta3-label").textContent =
    content.project4Meta3Label;
  document.getElementById("project5-title").textContent = content.project5Title;
  document.getElementById("project5-desc").textContent = content.project5Desc;
  document.getElementById("project5-meta1-label").textContent =
    content.project5Meta1Label;
  document.getElementById("project5-meta2-label").textContent =
    content.project5Meta2Label;
  document.getElementById("project5-meta3-label").textContent =
    content.project5Meta3Label;
  [
    "project2Tag1",
    "project2Tag2",
    "project2Tag3",
    "project3Tag1",
    "project3Tag2",
    "project3Tag3",
    "project4Tag1",
    "project4Tag2",
    "project5Tag1",
    "project5Tag2",
  ].forEach((tagKey) => {
    const tagId =
      tagKey.charAt(0).toLowerCase() + tagKey.slice(1).replace("Tag", "-tag");
    const tagElement = document.getElementById(tagId);
    if (tagElement) tagElement.textContent = content[tagKey];
  });

  projectCards.forEach((card) => {
    const title = card.querySelector(".project-title")?.textContent?.trim();
    if (title) {
      const label = isRTL ? `عرض تفاصيل ${title}` : `View details for ${title}`;
      card.setAttribute("aria-label", label);
    }
  });

  document.getElementById("mockProjectsTitle").textContent =
    content.mockProjectsTitle;

  if (currentProjectId && projectModal.classList.contains("active")) {
    renderProjectModalContent(currentProjectId);
  }

  document.getElementById("partners-title").textContent = content.partnersTitle;
  document.getElementById("partners-desc").textContent = content.partnersDesc;
  const partnersNote = document.getElementById("partners-note");
  if (partnersNote) partnersNote.textContent = content.partnersNote;

  const partnerIds = [
    "partner1",
    "partner2",
    "partner3",
    "partner4",
    "partner5",
    "partner6",
    "partner7",
  ];
  partnerIds.forEach((id) => {
    const primary = document.getElementById(id);
    if (primary) primary.textContent = content[id];
    const dup = document.getElementById(`${id}-dup`);
    if (dup) dup.textContent = content[id];
  });
  refreshPartnersMarquee();

  const consent = document.getElementById("consent-text");
  if (consent) {
    consent.innerHTML = `${content.consentPrefix} <a id="consent-privacy" href="privacy-policy.html">${content.consentPrivacy}</a> ${content.consentAnd} <a id="consent-terms" href="terms.html">${content.consentTerms}</a> ${content.consentAnd} <a id="consent-refund" href="refund-policy.html">${content.consentRefund}</a>.`;
  }
  const termsConsentError = document.getElementById("termsConsentError");
  if (termsConsentError) termsConsentError.textContent = content.consentError;

  const privacyLink = document.getElementById("privacy-policy-link");
  const termsLink = document.getElementById("terms-link");
  const refundLink = document.getElementById("refund-link");
  if (privacyLink) privacyLink.textContent = content["privacy-policy-link"];
  if (termsLink) termsLink.textContent = content["terms-link"];
  if (refundLink) refundLink.textContent = content["refund-link"];

  document.getElementById("blog-title").textContent = content.blogTitle;
  document.getElementById("blog-desc").textContent = content.blogDesc;
  const blogTopicLinks = document.getElementById("blog-topic-links");
  if (blogTopicLinks && content.blogTopicsHtml) {
    blogTopicLinks.innerHTML = content.blogTopicsHtml;
  }
  const blogNote = document.getElementById("blog-note");
  if (blogNote) blogNote.textContent = content.blogNote;
  const blogViewAll = document.getElementById("blog-view-all");
  if (blogViewAll) blogViewAll.textContent = content.blogViewAll;

  document.getElementById("certificates-title").textContent =
    content.certificatesTitle;
  document.getElementById("certificates-desc").textContent =
    content.certificatesDesc;
  const certificatesNote = document.getElementById("certificates-note");
  if (certificatesNote) certificatesNote.textContent = content.certificatesNote;

  document.getElementById("approvals-title").textContent =
    content.approvalsTitle;
  document.getElementById("approvals-desc").textContent = content.approvalsDesc;
  const approvalsNote = document.getElementById("approvals-note");
  if (approvalsNote) approvalsNote.textContent = content.approvalsNote;

  document.getElementById("newsletter-title").textContent =
    content.newsletterTitle;
  document.getElementById("newsletter-desc").textContent =
    content.newsletterDesc;
  document.getElementById("newsletter-input").placeholder =
    content.newsletterPlaceholder;
  const newsletterLabel = document.getElementById("newsletter-label");
  if (newsletterLabel) newsletterLabel.textContent = content.newsletterLabel;
  document.getElementById("subscribe-btn").textContent = content.subscribeBtn;

  document.getElementById("contact-title").textContent = content.contactTitle;
  document.getElementById("contact-desc").textContent = content.contactDesc;
  document.getElementById("location-title").textContent = content.locationTitle;
  document.getElementById("location-text").textContent = content.locationText;
  document.getElementById("phone-title").textContent = content.phoneTitle;
  document.getElementById("phone-text").innerHTML = content.phoneText;
  document.getElementById("email-title").textContent = content.emailTitle;
  document.getElementById("email-text").innerHTML = content.emailText;
  document.getElementById("submit-btn").textContent = content.submitBtn;

  document.getElementById("fullName").placeholder = content.formName;
  document.getElementById("email").placeholder = content.formEmail;
  document.getElementById("phone").placeholder = content.formPhone;
  document.getElementById("message").placeholder = content.formMessage;
  const labelFullName = document.getElementById("label-fullName");
  if (labelFullName) labelFullName.textContent = content.formNameLabel;
  const labelEmail = document.getElementById("label-email");
  if (labelEmail) labelEmail.textContent = content.formEmailLabel;
  const labelPhone = document.getElementById("label-phone");
  if (labelPhone) labelPhone.textContent = content.formPhoneLabel;
  const labelProductType = document.getElementById("label-productType");
  if (labelProductType)
    labelProductType.textContent = content.productSelectLabel;
  const labelQuantity = document.getElementById("label-quantity");
  if (labelQuantity) labelQuantity.textContent = content.quantityLabel;
  const labelProjectLocation = document.getElementById("label-projectLocation");
  if (labelProjectLocation)
    labelProjectLocation.textContent = content.projectLocationLabel;
  const labelMessage = document.getElementById("label-message");
  if (labelMessage) labelMessage.textContent = content.formMessageLabel;
  const concreteLegend = document.getElementById("concrete-type-legend");
  if (concreteLegend) concreteLegend.textContent = content.concreteTypeLabel;

  const productSelect = document.getElementById("productType");
  productSelect.innerHTML = `<option value="">${content.productSelectPlaceholder}</option>`;
  for (const [key, value] of Object.entries(content.productOptions)) {
    productSelect.innerHTML += `<option value="${key}">${value}</option>`;
  }

  document.getElementById("concrete-normal").textContent =
    content.concreteNormal;
  document.getElementById("concrete-resistant").textContent =
    content.concreteResistant;
  document.getElementById("quantity").placeholder = content.quantityPlaceholder;
  document.getElementById("projectLocation").placeholder =
    content.projectLocationPlaceholder;

  document.getElementById("quick-links").textContent = content.quickLinks;
  document.getElementById("services-links").textContent = content.servicesLinks;
  document.getElementById("contact-footer").textContent = content.contactFooter;
  document.getElementById("footer-desc").textContent = content.footerDesc;
  const footerPoliciesTitle = document.getElementById("footer-policies-title");
  if (footerPoliciesTitle)
    footerPoliciesTitle.textContent = content.footerPoliciesTitle;
  const footerCopyrightCompany = document.getElementById(
    "footer-copyright-company",
  );
  if (footerCopyrightCompany)
    footerCopyrightCompany.textContent = content.footerCopyrightCompany;
  const footerCopyrightRights = document.getElementById(
    "footer-copyright-rights",
  );
  if (footerCopyrightRights)
    footerCopyrightRights.textContent = content.footerCopyrightRights;

  setFooterLink("footer-link-home", content["footer-link-home"]);
  setFooterLink("footer-link-about", content["footer-link-about"]);
  setFooterLink("footer-link-why", content["footer-link-why"]);
  setFooterLink("footer-link-products", content["footer-link-products"]);
  setFooterLink("footer-link-projects", content["footer-link-projects"]);
  setFooterLink("footer-link-partners", content["footer-link-partners"]);
  setFooterLink("footer-link-blog", content["footer-link-blog"]);
  setFooterLink(
    "footer-link-certificates",
    content["footer-link-certificates"],
  );
  setFooterLink("footer-link-approvals", content["footer-link-approvals"]);
  setFooterLink("footer-link-contact", content["footer-link-contact"]);
  setFooterLink("footer-link-quote", content["footer-link-quote"]);
  setFooterLink("footer-policy-main-privacy", content.footerPolicyMainPrivacy);
  setFooterLink("footer-policy-main-terms", content.footerPolicyMainTerms);
  setFooterLink("footer-policy-main-refund", content.footerPolicyMainRefund);
  document.getElementById("privacy-policy-link").textContent =
    content["privacy-policy-link"];
  const termsFooterLink = document.getElementById("terms-link");
  if (termsFooterLink) termsFooterLink.textContent = content["terms-link"];
  const refundFooterLink = document.getElementById("refund-link");
  if (refundFooterLink) refundFooterLink.textContent = content["refund-link"];

  const stickyCallLabel = document.getElementById("sticky-call-label");
  if (stickyCallLabel) stickyCallLabel.textContent = content.stickyCall;
  const stickyWhatsappLabel = document.getElementById("sticky-whatsapp-label");
  if (stickyWhatsappLabel)
    stickyWhatsappLabel.textContent = content.stickyWhatsapp;
  const stickyQuoteLabel = document.getElementById("sticky-quote-label");
  if (stickyQuoteLabel) stickyQuoteLabel.textContent = content.stickyQuote;
  const stickyCallLink = document.getElementById("sticky-call-link");
  if (stickyCallLink)
    stickyCallLink.setAttribute("aria-label", content.stickyCallAria);
  const stickyWhatsappLink = document.getElementById("sticky-whatsapp-link");
  if (stickyWhatsappLink)
    stickyWhatsappLink.setAttribute("aria-label", content.stickyWhatsappAria);
  const stickyQuoteLink = document.getElementById("sticky-quote-link");
  if (stickyQuoteLink)
    stickyQuoteLink.setAttribute("aria-label", content.stickyQuoteAria);
  const backToTop = document.getElementById("backToTop");
  if (backToTop) backToTop.setAttribute("aria-label", content.backToTopAria);

  const topBarLocation = document.getElementById("top-bar-location");
  if (topBarLocation)
    topBarLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${content.topBarLocation}`;
  const topBarHours = document.getElementById("top-bar-hours");
  if (topBarHours)
    topBarHours.innerHTML = `<i class="fas fa-clock"></i> ${content.topBarHours}`;
  const topBarPhone = document.getElementById("top-bar-phone");
  if (topBarPhone)
    topBarPhone.innerHTML = `<i class="fas fa-phone-alt"></i> <span dir="ltr">${content.topBarPhone}</span>`;
  const topBarEmail = document.getElementById("top-bar-email");
  if (topBarEmail)
    topBarEmail.innerHTML = `<i class="fas fa-envelope"></i> <span dir="ltr">${content.topBarEmail}</span>`;

  syncNavOffset();
  hydrateDynamic(lang);
}

const langBtns = document.querySelectorAll(".lang-btn");
const themeBtns = document.querySelectorAll(".theme-btn");

const savedLang = (() => {
  try {
    return localStorage.getItem("lang") === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
})();
const savedTheme = (() => {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
})();

populateProjectData();
setupGalleries(savedLang);
updateContent(savedLang);
toggleTheme(savedTheme, false);
syncNavOffset();
window.addEventListener("resize", syncNavOffset);
setupConcreteCalculation();

langBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang || "ar";
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    setupGalleries(lang);
    updateContent(lang);
  });
});

themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme || "light";
    toggleTheme(theme, true);
  });
});

const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const menuOverlay = document.getElementById("menuOverlay");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

function toggleMobileMenu() {
  if (!mobileMenu || !menuOverlay || !mobileMenuToggle) return;
  const isOpen = !mobileMenu.classList.contains("active");
  mobileMenu.classList.toggle("active", isOpen);
  menuOverlay.classList.toggle("active", isOpen);
  mobileMenu.setAttribute("aria-hidden", (!isOpen).toString());
  menuOverlay.setAttribute("aria-hidden", (!isOpen).toString());
  mobileMenuToggle.setAttribute("aria-expanded", isOpen.toString());
}

if (mobileMenuToggle)
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);
if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", toggleMobileMenu);
if (menuOverlay) menuOverlay.addEventListener("click", toggleMobileMenu);

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileMenu?.classList.contains("active")) {
      toggleMobileMenu();
    }
  });
});

const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    if (navbar) navbar.classList.add("scrolled");
    if (backToTop) backToTop.classList.add("show");
  } else {
    if (navbar) navbar.classList.remove("scrolled");
    if (backToTop) backToTop.classList.remove("show");
  }

  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-links a",
  );

  let current = "";
  if (sections.length) {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href") || "";
    const hash = href.includes("#") ? href.split("#").pop() : "";
    if (hash === current) {
      link.classList.add("active");
    }
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const video = document.querySelector("video");
if (video) {
  video.addEventListener("error", function () {
    this.style.display = "none";
  });
  video.preload = "auto";
}

document.querySelectorAll('a[target=\"_blank\"]').forEach((link) => {
  if (!link.rel || !link.rel.includes("noopener")) {
    link.rel = "noopener";
  }
});

document.getElementById("current-year").textContent = new Date().getFullYear();

(function () {
  const form = document.getElementById("projectInquiryForm");
  if (!form) return;

  const statusEl = document.getElementById("formStatus");
  const termsError = document.getElementById("termsConsentError");

  const setStatus = (msg, tone = "success", mode = "direct") => {
    setLeadStatus(statusEl, "inquiry", msg, { tone, mode });
  };

  function collectFormData() {
    const concreteTypeEl = form.querySelector(
      'input[name="concreteType"]:checked',
    );
    const productTypeEl = document.getElementById("productType");
    const selectedProductOption =
      productTypeEl?.options?.[productTypeEl.selectedIndex] || null;
    const productTypeLabel =
      selectedProductOption && selectedProductOption.value
        ? selectedProductOption.textContent.trim()
        : "";
    const termsConsentEl = document.getElementById("termsConsent");
    return {
      fullName: (document.getElementById("fullName")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      phone: (document.getElementById("phone")?.value || "").trim(),
      productType: (productTypeEl?.value || "").trim(),
      productTypeLabel,
      concreteType: concreteTypeEl ? concreteTypeEl.value : "",
      quantity: (document.getElementById("quantity")?.value || "").trim(),
      projectLocation: (
        document.getElementById("projectLocation")?.value || ""
      ).trim(),
      message: (document.getElementById("message")?.value || "").trim(),
      termsAccepted: !!(termsConsentEl && termsConsentEl.checked),
      company: (document.getElementById("company")?.value || "").trim(), // honeypot
      utm_source: (document.getElementById("utm_source")?.value || "").trim(),
      utm_medium: (document.getElementById("utm_medium")?.value || "").trim(),
      utm_campaign: (
        document.getElementById("utm_campaign")?.value || ""
      ).trim(),
      page_url: (document.getElementById("page_url")?.value || "").trim(),
      timestamp: (document.getElementById("timestamp")?.value || "").trim(),
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = collectFormData();
    const copy = getLeadFlowCopy();

    clearLeadStatus(statusEl);
    if (termsError) termsError.style.display = "none";

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.phone ||
      !payload.message
    ) {
      setStatus(copy.requiredFields, "error");
      return;
    }

    if (!payload.termsAccepted) {
      if (termsError) termsError.style.display = "block";
      setStatus(copy.acceptTerms, "error");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtn = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = copy.sending;
    }

    try {
      if (payload.company) {
        setStatus(copy.honeypotPrepared, "success");
        form.reset();
        resetQuantityDisplay();
        return;
      }

      const result = await submitProjectInquiryLead(payload);
      setStatus(
        result.mode === "mailto"
          ? copy.requestPreparedFallback
          : copy.requestPrepared,
        result.mode === "mailto" ? "info" : "success",
        result.mode,
      );
      form.reset();
      if (termsError) termsError.style.display = "none";
      resetQuantityDisplay();
    } catch (err) {
      console.error(err);
      setStatus(copy.requestFailed, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtn;
      }
    }
  });
})(); // Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  const newsletterStatusEl = document.getElementById("newsletterStatus");

  const setNewsletterStatus = (msg, tone = "success", mode = "direct") => {
    setLeadStatus(newsletterStatusEl, "newsletter", msg, { tone, mode });
  };

  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-input");
    const email = emailInput?.value.trim() || "";
    const copy = getLeadFlowCopy();
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtn = submitBtn ? submitBtn.innerHTML : "";

    clearLeadStatus(newsletterStatusEl);

    if (!email) {
      emailInput?.reportValidity();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = copy.sending;
    }

    const formData = {
      email: email,
      type: "newsletter",
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await submitNewsletterLead(formData);
      setNewsletterStatus(
        result.mode === "mailto"
          ? copy.newsletterPreparedFallback
          : copy.newsletterPrepared,
        result.mode === "mailto" ? "info" : "success",
        result.mode,
      );
      this.reset();
    } catch (error) {
      console.error("Newsletter subscription failed:", email, error);
      setNewsletterStatus(copy.newsletterFailed, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtn;
      }
    }
  });
}

let threeLoaded = false;

function loadThreeScript() {
  return new Promise((resolve, reject) => {
    if (threeLoaded) return resolve();
    const script = document.createElement("script");
    script.src = "assets/js/three.min.js?v=20260305";
    script.async = true;
    script.onload = () => {
      threeLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadHeroVideo() {
  const video = document.getElementById("heroVideo");
  const playBtn = document.getElementById("heroPlayBtn");
  if (!video) return;
  const source = video.querySelector("source");
  const videoBackground = video.parentElement;
  const configuredHeroVideoUrl = window.GW_SITE_CONFIG?.heroVideoUrl || "";
  const configuredHeroVideoUrls = Array.isArray(
    window.GW_SITE_CONFIG?.heroVideoUrls,
  )
    ? window.GW_SITE_CONFIG.heroVideoUrls.filter(Boolean)
    : [];
  const configuredHeroPosterUrl = window.GW_SITE_CONFIG?.heroPosterUrl || "";
  const configuredHeroPosterMode = !!window.GW_SITE_CONFIG?.heroUsePosterModal;
  const videoUrls =
    configuredHeroVideoUrls.length > 0
      ? configuredHeroVideoUrls
      : [configuredHeroVideoUrl].filter(Boolean);
  let currentHeroVideoIndex = 0;
  const videoSrc =
    videoUrls[currentHeroVideoIndex] ||
    source?.getAttribute("data-src") ||
    source?.getAttribute("src") ||
    "";
  const youtubeVideoId = extractYouTubeId(configuredHeroVideoUrl);
  const setHeroVideoSource = (index) => {
    const url = videoUrls[index];
    if (!url) return false;
    if (source) {
      source.src = url;
    } else {
      video.src = url;
    }
    return true;
  };
  const getNextHeroVideoUrl = () => {
    if (currentHeroVideoIndex + 1 >= videoUrls.length) return "";
    currentHeroVideoIndex += 1;
    return videoUrls[currentHeroVideoIndex];
  };
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const lowBandwidth = !!(
    connection &&
    (connection.saveData ||
      /(^(slow-)?2g$)|(^3g$)/i.test(connection.effectiveType || ""))
  );
  const shouldPreferPosterOnly = configuredHeroPosterMode;
  const hidePlayBtn = () => {
    if (!playBtn) return;
    playBtn.hidden = true;
    playBtn.classList.remove("visible");
    playBtn.onclick = null;
  };
  const fallbackToPoster = () => {
    if (!videoBackground) return;
    if (configuredHeroPosterUrl) {
      applyHeroPosterImage(videoBackground, configuredHeroPosterUrl);
    } else if (youtubeVideoId) {
      applyYouTubeHeroPoster(videoBackground, configuredHeroVideoUrl);
    }
    video.pause();
    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");
    hidePlayBtn();
  };

  if (shouldPreferPosterOnly && configuredHeroVideoUrl) {
    if (!videoBackground) return;

    if (configuredHeroPosterUrl) {
      applyHeroPosterImage(videoBackground, configuredHeroPosterUrl);
    } else if (youtubeVideoId) {
      applyYouTubeHeroPoster(videoBackground, configuredHeroVideoUrl);
    }

    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");
    hidePlayBtn();
    return;
  }

  if (youtubeVideoId) {
    if (!videoBackground) return;
    if (configuredHeroPosterUrl) {
      applyHeroPosterImage(videoBackground, configuredHeroPosterUrl);
    } else {
      applyYouTubeHeroPoster(videoBackground, configuredHeroVideoUrl);
    }
    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");

    const mounted = mountHeroYouTubeBackground(
      videoBackground,
      configuredHeroVideoUrl,
    );

    hidePlayBtn();
    if (!mounted) fallbackToPoster();
    return;
  }

  let videoAvailable = Boolean(videoSrc);
  const hydrate = () => {
    if (!videoAvailable) return;
    let sourceUpdated = false;
    if (source && videoSrc) {
      if (source.getAttribute("src") !== videoSrc) {
        source.src = videoSrc;
        sourceUpdated = true;
      }
    }
    if (videoSrc && !source && video.getAttribute("src") !== videoSrc) {
      video.src = videoSrc;
      sourceUpdated = true;
    }
    if (configuredHeroPosterUrl) {
      video.poster = configuredHeroPosterUrl;
    } else {
      video.removeAttribute("poster");
    }
    video.style.display = "block";
    video.removeAttribute("aria-hidden");
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "metadata";
    video.setAttribute("fetchpriority", "low");
    if (
      sourceUpdated ||
      video.networkState === HTMLMediaElement.NETWORK_EMPTY
    ) {
      video.load();
    }
  };
  const attemptPlay = (userInitiated = false) => {
    video
      .play()
      .then(() => {
        hidePlayBtn();
      })
      .catch(() => {
        if (userInitiated) video.pause();
      });
  };
  const attemptPlayWhenReady = (userInitiated = false) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      attemptPlay(userInitiated);
      return;
    }
    video.addEventListener(
      "loadeddata",
      () => {
        attemptPlay(userInitiated);
      },
      { once: true },
    );
  };

  if (playBtn) {
    hidePlayBtn();
  }

  video.addEventListener("error", () => {
    const nextUrl = getNextHeroVideoUrl();
    if (nextUrl) {
      setHeroVideoSource(currentHeroVideoIndex);
      video.load();
      attemptPlayWhenReady(false);
      return;
    }
    videoAvailable = false;
    fallbackToPoster();
  });

  if (!videoAvailable) return;

  let playbackStarted = false;
  const startPlayback = () => {
    if (playbackStarted) return;
    playbackStarted = true;
    hydrate();
    attemptPlayWhenReady(false);
  };

  if ("IntersectionObserver" in window && videoBackground) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          startPlayback();
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(videoBackground);
  } else {
    startPlayback();
  }

  window.setTimeout(() => {
    startPlayback();
  }, 1400);
}

function enableThreeIfNeeded() {
  const container = document.getElementById("three-container");
  if (!container) return;
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  if (isMobile) return;
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (e) => {
          if (e.isIntersecting) {
            obs.disconnect();
            try {
              await loadThreeScript();
              if (typeof THREE !== "undefined") init3DConcreteBackground();
            } catch (err) {
              console.warn("three.js failed to load", err);
            }
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(container);
  } else {
    loadThreeScript()
      .then(() => {
        if (typeof THREE !== "undefined") init3DConcreteBackground();
      })
      .catch(() => {});
  }
}

function setUtmFields() {
  const params = new URLSearchParams(window.location.search);
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };
  setVal("utm_source", params.get("utm_source"));
  setVal("utm_medium", params.get("utm_medium"));
  setVal("utm_campaign", params.get("utm_campaign"));
  const pageUrl = document.getElementById("page_url");
  if (pageUrl) pageUrl.value = window.location.href;
  const ts = document.getElementById("timestamp");
  if (ts) ts.value = new Date().toISOString();
}

document.addEventListener("DOMContentLoaded", () => {
  disableTextAssistance();
  loadHeroVideo();
  syncNavOffset();
  animateCounters();
  window.addEventListener("scroll", animateCounters, { passive: true });
  window.addEventListener("resize", animateCounters);
});

window.addEventListener("load", () => {
  animateCounters();
  enableThreeIfNeeded();
  setUtmFields();
  syncNavOffset();
});

function resolveDynamicLanguage(preferredLang) {
  if (preferredLang === "en" || preferredLang === "ar") {
    return preferredLang;
  }

  try {
    return localStorage.getItem("lang") === "en" ? "en" : "ar";
  } catch (error) {
    return document.documentElement.lang === "en" ? "en" : "ar";
  }
}

function applyProjectCardContent(card, project, lang) {
  const title = card.querySelector(".project-title");
  const desc = card.querySelector(".project-desc");
  const img = card.querySelector("img");
  const localizedTitle =
    lang === "en"
      ? project.title_en || project.title_ar || ""
      : project.title_ar || project.title_en || "";
  const localizedDesc =
    lang === "en"
      ? project.description_en || project.description_ar || ""
      : project.description_ar || project.description_en || "";

  if (title && localizedTitle) title.textContent = localizedTitle;
  if (desc && localizedDesc) desc.textContent = localizedDesc;
  if (img && project.image) img.src = project.image;
  if (img && localizedTitle) img.alt = localizedTitle;
}

function renderHomeBlogCards(container, posts, lang) {
  if (!container || typeof window.createArticleCard !== "function") {
    return;
  }

  const visiblePosts = Array.isArray(posts) ? posts.slice(0, 3) : [];
  if (!visiblePosts.length) {
    return;
  }

  container.innerHTML = visiblePosts
    .map((post, index) =>
      window.createArticleCard(post, "", {
        lang,
        imageLoading: index === 0 ? "eager" : "lazy",
        imageFetchPriority: index === 0 ? "high" : "auto",
      }),
    )
    .join("");
}

async function hydrateDynamic(preferredLang) {
  const currentLang = resolveDynamicLanguage(preferredLang);
  const blogGrid = document.querySelector("#blog .home-article-grid");

  if (!blogGrid) {
    return;
  }

  try {
    const posts =
      typeof window.loadPublicBlogPosts === "function"
        ? await window.loadPublicBlogPosts("")
        : Array.isArray(window.BLOG_POSTS)
          ? window.BLOG_POSTS
          : [];
    renderHomeBlogCards(blogGrid, posts, currentLang);
  } catch (e) {
    console.warn("Blog content fallback", e);
  }
}

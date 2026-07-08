(function () {
  const html = document.documentElement;
  const basePath = html.dataset.basePath || "";
  const activePage = html.dataset.activePage || "";
  const mainContent = document.getElementById("main-content");
  const defaultMainHtml = mainContent ? mainContent.innerHTML : "";
  const defaultMeta = captureMeta();

  const LEGAL_PAGES_EN = {
    privacy: {
      title: "Privacy Policy | Golden Western Ready-Mix Concrete",
      metaDescription:
        "Privacy policy for Golden Western Ready-Mix Concrete, including what information we collect, how we use it, protect it, and respond to update or deletion requests.",
      ogTitle: "Privacy Policy | Golden Western",
      ogDescription:
        "Learn what information may be collected through quote requests and communication channels, how it is used, and how privacy requests are handled.",
      twitterTitle: "Privacy Policy | Golden Western",
      twitterDescription:
        "A clear privacy policy covering contact requests, quote requests, and data handling practices.",
      breadcrumb: "Privacy Policy",
      kickerIcon: "fa-shield-alt",
      kicker: "Data Protection",
      pageTitle: "Privacy Policy",
      pageLead:
        "This page explains what information may be collected through quote requests and contact forms, how it may be used and protected, and how requests for update or deletion are handled.",
      tocTitle: "Page Contents",
      tocAria: "Page contents",
      sections: [
        {
          id: "scope",
          title: "Policy Scope",
          paragraphs: [
            "This policy applies to information submitted through quote request forms, project inquiry forms, direct communication channels, or any correspondence related to a commercial request or service inquiry.",
            "Information is used only to support the request, coordinate project needs, and improve service reliability without unrelated use beyond the requested service or applicable legal obligations.",
          ],
        },
        {
          id: "data-collected",
          title: "Information We Collect",
          listType: "ul",
          items: [
            "Basic contact details such as name, phone number, email address, and project or site name.",
            "Operational details needed to prepare a quotation, such as request type, estimated quantity, city, and expected delivery timing.",
            "General technical information such as IP address, browser type, and usage logs required for performance and security improvement.",
            "Any additional information voluntarily shared by the customer in messages or attachments related to the request.",
          ],
        },
        {
          id: "use",
          title: "How We Use Information",
          listType: "ul",
          items: [
            "Preparing quotations and handling communication related to the request or project.",
            "Coordinating supply and follow-up with operations or sales teams when needed.",
            "Improving service quality, reviewing recurring inquiries, and raising response efficiency.",
            "Meeting legal obligations and contractual requirements relevant to the workflow.",
          ],
        },
        {
          id: "storage",
          title: "Storage and Protection",
          paragraphs: [
            "Information is stored in suitable operational environments with controlled access permissions, and reasonable measures are taken to reduce unauthorized access, alteration, or loss.",
            "Information is retained for as long as needed to serve the request or meet relevant operational and legal obligations, then reviewed when appropriate.",
          ],
        },
        {
          id: "rights",
          title: "Your Rights",
          listType: "ol",
          items: [
            "You may request access to the core information linked to your request whenever operationally feasible.",
            "You may request correction or completion of inaccurate information when this affects processing.",
            "You may request deletion of information when no operational or legal retention requirement applies.",
          ],
          actions: [
            {
              href: "mailto:info@golden-western.sa?subject=Privacy%20Data%20Request",
              label: "Submit a Data Request",
              variant: "primary",
            },
            {
              href: "/#contact",
              label: "Go to Contact Page",
              variant: "outline",
            },
          ],
        },
        {
          id: "contact",
          title: "Contact Information",
          paragraphs: [
            "For privacy-related inquiries or update and deletion requests, contact info@golden-western.sa or call +966 5 44 58 44 58.",
            "Last updated: March 29, 2026.",
          ],
        },
      ],
    },
  };

  function getMetaContent(selector) {
    const node = document.querySelector(selector);
    return node ? node.getAttribute("content") || "" : "";
  }

  function setMetaContent(selector, value) {
    const node = document.querySelector(selector);
    if (node && typeof value === "string") {
      node.setAttribute("content", value);
    }
  }

  function captureMeta() {
    return {
      title: document.title,
      description: getMetaContent('meta[name="description"]'),
      ogTitle: getMetaContent('meta[property="og:title"]'),
      ogDescription: getMetaContent('meta[property="og:description"]'),
      twitterTitle: getMetaContent('meta[name="twitter:title"]'),
      twitterDescription: getMetaContent('meta[name="twitter:description"]'),
    };
  }

  function setPageMeta(lang) {
    if (lang === "ar") {
      document.title = defaultMeta.title;
      setMetaContent('meta[name="description"]', defaultMeta.description);
      setMetaContent('meta[property="og:title"]', defaultMeta.ogTitle);
      setMetaContent(
        'meta[property="og:description"]',
        defaultMeta.ogDescription,
      );
      setMetaContent('meta[name="twitter:title"]', defaultMeta.twitterTitle);
      setMetaContent(
        'meta[name="twitter:description"]',
        defaultMeta.twitterDescription,
      );
      return;
    }

    const copy = LEGAL_PAGES_EN[activePage];
    if (!copy) {
      return;
    }

    document.title = copy.title;
    setMetaContent('meta[name="description"]', copy.metaDescription);
    setMetaContent('meta[property="og:title"]', copy.ogTitle);
    setMetaContent('meta[property="og:description"]', copy.ogDescription);
    setMetaContent('meta[name="twitter:title"]', copy.twitterTitle);
    setMetaContent('meta[name="twitter:description"]', copy.twitterDescription);
  }

  function renderSection(section) {
    const body = [];

    if (Array.isArray(section.paragraphs)) {
      section.paragraphs.forEach((paragraph) => {
        body.push(`<p>${paragraph}</p>`);
      });
    }

    if (Array.isArray(section.items) && section.items.length) {
      const listTag = section.listType === "ol" ? "ol" : "ul";
      body.push(`
            <${listTag}>
                ${section.items.map((item) => `<li>${item}</li>`).join("")}
            </${listTag}>
        `);
    }

    if (Array.isArray(section.actions) && section.actions.length) {
      body.push(`
            <div class="page-actions">
                ${section.actions.map((action) => `<a href="${action.href}" class="btn btn-${action.variant === "outline" ? "outline" : "primary"}">${action.label}</a>`).join("")}
            </div>
        `);
    }

    return `
        <section class="page-panel" id="${section.id}">
            <h2>${section.title}</h2>
            ${body.join("")}
        </section>
    `;
  }

  function renderEnglishPage() {
    const copy = LEGAL_PAGES_EN[activePage];
    if (!copy || !mainContent) {
      return;
    }

    mainContent.innerHTML = `
        <section class="page-hero">
            <div class="container page-hero-shell">
                <nav class="page-breadcrumbs" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span>&bull;</span>
                    <span>${copy.breadcrumb}</span>
                </nav>
                <div class="page-hero-content">
                    <span class="page-kicker"><i class="fas ${copy.kickerIcon}"></i>${copy.kicker}</span>
                    <h1 class="page-title">${copy.pageTitle}</h1>
                    <p class="page-lead">${copy.pageLead}</p>
                </div>
            </div>
        </section>

        <section class="page-section">
            <div class="container legal-layout">
                <aside class="page-panel legal-nav">
                    <h2 class="article-sidebar-title">${copy.tocTitle}</h2>
                    <nav class="legal-nav-links" aria-label="${copy.tocAria}">
                        ${copy.sections.map((section) => `<a href="#${section.id}">${section.title}</a>`).join("")}
                    </nav>
                </aside>

                <div class="legal-stack">
                    ${copy.sections.map(renderSection).join("")}
                </div>
            </div>
        </section>
    `;
  }

  function renderPage(lang) {
    const resolvedLang = lang === "en" ? "en" : "ar";

    renderSiteShell({
      basePath,
      activePage,
      quoteTarget: "/#contact",
      backToTopTarget: "#page-top",
      lang: resolvedLang,
    });

    setPageMeta(resolvedLang);

    if (!mainContent) {
      html.dataset.legalReady = "true";
      bindLanguageSwitcher(renderPage);
      return;
    }

    if (resolvedLang === "ar") {
      mainContent.innerHTML = defaultMainHtml;
    } else {
      renderEnglishPage();
    }

    html.dataset.legalReady = "true";
    bindLanguageSwitcher(renderPage);
  }

  renderPage(
    typeof getStoredLanguage === "function" ? getStoredLanguage() : "ar",
  );
})();

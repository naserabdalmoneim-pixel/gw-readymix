(function () {
<<<<<<< HEAD
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
              href: "index.html#contact",
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
    terms: {
      title: "Terms & Conditions | Golden Western Ready-Mix Concrete",
      metaDescription:
        "Terms and conditions for using the Golden Western Ready-Mix Concrete website, including request handling, quotations, supply coordination, and use of published content.",
      ogTitle: "Terms & Conditions | Golden Western",
      ogDescription:
        "Review the terms governing website use, quotation requests, operational coordination, and project-related communication.",
      twitterTitle: "Terms & Conditions | Golden Western",
      twitterDescription:
        "Clear website terms covering requests, quotations, and ready-mix concrete services.",
      breadcrumb: "Terms & Conditions",
      kickerIcon: "fa-file-contract",
      kicker: "Terms of Use",
      pageTitle: "Terms & Conditions",
      pageLead:
        "This content outlines the general framework for using the website, submitting requests, reviewing quotations, and coordinating services related to ready-mix concrete and associated projects.",
      tocTitle: "Page Contents",
      tocAria: "Page contents",
      sections: [
        {
          id: "acceptance",
          title: "Acceptance of Terms",
          paragraphs: [
            "By using the website or submitting any request through forms or related communication channels, the user acknowledges these terms and conditions. Any later transaction is subject to them, together with any project-specific written quotation or agreement.",
          ],
        },
        {
          id: "use",
          title: "Website Use",
          listType: "ul",
          items: [
            "The website is provided to present services and products, request quotations, and support business communication.",
            "Users must provide accurate and sufficient information and must not use the website in a way that disrupts or misuses the service.",
            "Published content may not be copied or reused in a way that implies representation or endorsement without explicit permission.",
          ],
        },
        {
          id: "quotes",
          title: "Quotations and Pricing",
          listType: "ul",
          items: [
            "Any initial quotation is considered indicative information until the technical and operational details of the project are completed.",
            "Pricing and operating conditions may change based on site location, concrete mix type, quantities, delivery timing, and site readiness.",
            "No request is considered finally approved until technical and operational requirements are completed and confirmed by the responsible team.",
          ],
        },
        {
          id: "delivery",
          title: "Supply and Execution",
          listType: "ul",
          items: [
            "Order execution depends on operational capacity, field readiness, and access conditions to the project site.",
            "The customer is responsible for providing the requirements needed to begin and continue the pour or supply process as agreed.",
            "Any field delay or sudden change in site conditions, quantities, or schedule may affect timing, cost, and execution.",
          ],
        },
        {
          id: "liability",
          title: "Limitation of Liability",
          paragraphs: [
            "The factory exercises reasonable professional care in providing operational information and services, but final execution outcomes also depend on the accuracy of customer-provided information, site readiness, and compliance with technical instructions.",
            "The website is not responsible for any technical or financial decision made before final evaluation is complete or an official quotation is approved.",
          ],
        },
        {
          id: "contact",
          title: "Contact About These Terms",
          paragraphs: [
            "For any question related to these terms, contact info@golden-western.sa or call +966 5 44 58 44 58.",
            "Last updated: March 29, 2026.",
          ],
          actions: [
            {
              href: "index.html#contact",
              label: "Go to Contact Page",
              variant: "primary",
            },
            {
              href: "privacy-policy.html",
              label: "Review Privacy Policy",
              variant: "outline",
            },
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
=======
const html = document.documentElement;
const basePath = html.dataset.basePath || "";
const activePage = html.dataset.activePage || "";
const mainContent = document.getElementById("main-content");
const defaultMainHtml = mainContent ? mainContent.innerHTML : "";
const defaultMeta = captureMeta();

const LEGAL_PAGES_EN = {
    privacy: {
        title: "Privacy Policy | Golden Western Ready-Mix Concrete",
        metaDescription: "Privacy policy for Golden Western Ready-Mix Concrete, including what information we collect, how we use it, protect it, and respond to update or deletion requests.",
        ogTitle: "Privacy Policy | Golden Western",
        ogDescription: "Learn what information may be collected through quote requests and communication channels, how it is used, and how privacy requests are handled.",
        twitterTitle: "Privacy Policy | Golden Western",
        twitterDescription: "A clear privacy policy covering contact requests, quote requests, and data handling practices.",
        breadcrumb: "Privacy Policy",
        kickerIcon: "fa-shield-alt",
        kicker: "Data Protection",
        pageTitle: "Privacy Policy",
        pageLead: "This page explains what information may be collected through quote requests and contact forms, how it may be used and protected, and how requests for update or deletion are handled.",
        tocTitle: "Page Contents",
        tocAria: "Page contents",
        sections: [
            {
                id: "scope",
                title: "Policy Scope",
                paragraphs: [
                    "This policy applies to information submitted through quote request forms, project inquiry forms, direct communication channels, or any correspondence related to a commercial request or service inquiry.",
                    "Information is used only to support the request, coordinate project needs, and improve service reliability without unrelated use beyond the requested service or applicable legal obligations."
                ]
            },
            {
                id: "data-collected",
                title: "Information We Collect",
                listType: "ul",
                items: [
                    "Basic contact details such as name, phone number, email address, and project or site name.",
                    "Operational details needed to prepare a quotation, such as request type, estimated quantity, city, and expected delivery timing.",
                    "General technical information such as IP address, browser type, and usage logs required for performance and security improvement.",
                    "Any additional information voluntarily shared by the customer in messages or attachments related to the request."
                ]
            },
            {
                id: "use",
                title: "How We Use Information",
                listType: "ul",
                items: [
                    "Preparing quotations and handling communication related to the request or project.",
                    "Coordinating supply and follow-up with operations or sales teams when needed.",
                    "Improving service quality, reviewing recurring inquiries, and raising response efficiency.",
                    "Meeting legal obligations and contractual requirements relevant to the workflow."
                ]
            },
            {
                id: "storage",
                title: "Storage and Protection",
                paragraphs: [
                    "Information is stored in suitable operational environments with controlled access permissions, and reasonable measures are taken to reduce unauthorized access, alteration, or loss.",
                    "Information is retained for as long as needed to serve the request or meet relevant operational and legal obligations, then reviewed when appropriate."
                ]
            },
            {
                id: "rights",
                title: "Your Rights",
                listType: "ol",
                items: [
                    "You may request access to the core information linked to your request whenever operationally feasible.",
                    "You may request correction or completion of inaccurate information when this affects processing.",
                    "You may request deletion of information when no operational or legal retention requirement applies."
                ],
                actions: [
                    { href: "mailto:info@golden-western.sa?subject=Privacy%20Data%20Request", label: "Submit a Data Request", variant: "primary" },
                    { href: "index.html#contact", label: "Go to Contact Page", variant: "outline" }
                ]
            },
            {
                id: "contact",
                title: "Contact Information",
                paragraphs: [
                    "For privacy-related inquiries or update and deletion requests, contact info@golden-western.sa or call +966 5 44 58 44 58.",
                    "Last updated: March 29, 2026."
                ]
            }
        ]
    },
    terms: {
        title: "Terms & Conditions | Golden Western Ready-Mix Concrete",
        metaDescription: "Terms and conditions for using the Golden Western Ready-Mix Concrete website, including request handling, quotations, supply coordination, and use of published content.",
        ogTitle: "Terms & Conditions | Golden Western",
        ogDescription: "Review the terms governing website use, quotation requests, operational coordination, and project-related communication.",
        twitterTitle: "Terms & Conditions | Golden Western",
        twitterDescription: "Clear website terms covering requests, quotations, and ready-mix concrete services.",
        breadcrumb: "Terms & Conditions",
        kickerIcon: "fa-file-contract",
        kicker: "Terms of Use",
        pageTitle: "Terms & Conditions",
        pageLead: "This content outlines the general framework for using the website, submitting requests, reviewing quotations, and coordinating services related to ready-mix concrete and associated projects.",
        tocTitle: "Page Contents",
        tocAria: "Page contents",
        sections: [
            {
                id: "acceptance",
                title: "Acceptance of Terms",
                paragraphs: [
                    "By using the website or submitting any request through forms or related communication channels, the user acknowledges these terms and conditions. Any later transaction is subject to them, together with any project-specific written quotation or agreement."
                ]
            },
            {
                id: "use",
                title: "Website Use",
                listType: "ul",
                items: [
                    "The website is provided to present services and products, request quotations, and support business communication.",
                    "Users must provide accurate and sufficient information and must not use the website in a way that disrupts or misuses the service.",
                    "Published content may not be copied or reused in a way that implies representation or endorsement without explicit permission."
                ]
            },
            {
                id: "quotes",
                title: "Quotations and Pricing",
                listType: "ul",
                items: [
                    "Any initial quotation is considered indicative information until the technical and operational details of the project are completed.",
                    "Pricing and operating conditions may change based on site location, concrete mix type, quantities, delivery timing, and site readiness.",
                    "No request is considered finally approved until technical and operational requirements are completed and confirmed by the responsible team."
                ]
            },
            {
                id: "delivery",
                title: "Supply and Execution",
                listType: "ul",
                items: [
                    "Order execution depends on operational capacity, field readiness, and access conditions to the project site.",
                    "The customer is responsible for providing the requirements needed to begin and continue the pour or supply process as agreed.",
                    "Any field delay or sudden change in site conditions, quantities, or schedule may affect timing, cost, and execution."
                ]
            },
            {
                id: "liability",
                title: "Limitation of Liability",
                paragraphs: [
                    "The factory exercises reasonable professional care in providing operational information and services, but final execution outcomes also depend on the accuracy of customer-provided information, site readiness, and compliance with technical instructions.",
                    "The website is not responsible for any technical or financial decision made before final evaluation is complete or an official quotation is approved."
                ]
            },
            {
                id: "contact",
                title: "Contact About These Terms",
                paragraphs: [
                    "For any question related to these terms, contact info@golden-western.sa or call +966 5 44 58 44 58.",
                    "Last updated: March 29, 2026."
                ],
                actions: [
                    { href: "index.html#contact", label: "Go to Contact Page", variant: "primary" },
                    { href: "privacy-policy.html", label: "Review Privacy Policy", variant: "outline" }
                ]
            }
        ]
    },
    refund: {
        title: "Refund & Cancellation Policy | Golden Western Ready-Mix Concrete",
        metaDescription: "Refund and cancellation policy for Golden Western Ready-Mix Concrete requests, covering changes, cancellation timing, refund handling, and external payment providers.",
        ogTitle: "Refund & Cancellation Policy | Golden Western",
        ogDescription: "Review the rules for request amendments, cancellation, refund handling, and external financing or payment scenarios.",
        twitterTitle: "Refund & Cancellation Policy | Golden Western",
        twitterDescription: "A clear policy covering modifications, cancellations, and refunds related to ready-mix concrete orders.",
        breadcrumb: "Refund & Cancellation Policy",
        kickerIcon: "fa-rotate-left",
        kicker: "Request Policies",
        pageTitle: "Refund & Cancellation Policy",
        pageLead: "This page explains the rules for amending or cancelling requests and the possible refund path depending on approval stage, execution start, or delivery scheduling.",
        tocTitle: "Page Contents",
        tocAria: "Page contents",
        sections: [
            {
                id: "before-confirmation",
                title: "Before Final Confirmation",
                paragraphs: [
                    "Customers may request amendment or cancellation before the final quotation is approved or an execution date is locked without operational charges, provided the request has not entered production or final field coordination.",
                    "Approval of changes at this stage depends on complete operational details and whether resources or delivery instructions have already been committed."
                ]
            },
            {
                id: "after-confirmation",
                title: "After Approval or Scheduling",
                listType: "ul",
                items: [
                    "After quotation approval or pour scheduling, operational charges may apply for preparation, reservation, or transportation.",
                    "If mix preparation has started, resources have been allocated, or fleet movement has begun, full cancellation may no longer be available depending on the execution status.",
                    "Any urgent change in site conditions, quantities, or schedule should be reported immediately so its impact on cost and coordination can be assessed."
                ]
            },
            {
                id: "custom-orders",
                title: "Custom or Special Orders",
                paragraphs: [
                    "Special mixes, project-specific formulations, or orders requiring dedicated operational arrangements may not be refundable once production has started or linked materials have been approved.",
                    "These situations are assessed based on mix type, execution stage, and whether the order can be operationally reallocated."
                ]
            },
            {
                id: "refund-method",
                title: "Refund Method",
                listType: "ul",
                items: [
                    "When a refund is approved, it is processed through the approved payment method or suitable financial channel according to internal procedures.",
                    "Processing time varies depending on the payment method, review cycle, and the requirements of the financial service provider.",
                    "Operational charges or direct costs may be deducted if the case involves actual preparation work or an operational commitment that has already started."
                ]
            },
            {
                id: "payment-provider",
                title: "Payment Gateways and Installments",
                paragraphs: [
                    "When an external payment gateway or installment provider is used, that provider's terms may also apply, including review timelines, cancellation rules, and refund handling."
                ]
            },
            {
                id: "request-process",
                title: "How to Submit a Request",
                paragraphs: [
                    "Cancellation, amendment, or refund requests can be sent to info@golden-western.sa or through the approved communication channels linked to the request.",
                    "Last updated: March 29, 2026."
                ]
            }
        ]
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
        twitterDescription: getMetaContent('meta[name="twitter:description"]')
    };
}

function setPageMeta(lang) {
    if (lang === "ar") {
        document.title = defaultMeta.title;
        setMetaContent('meta[name="description"]', defaultMeta.description);
        setMetaContent('meta[property="og:title"]', defaultMeta.ogTitle);
        setMetaContent('meta[property="og:description"]', defaultMeta.ogDescription);
        setMetaContent('meta[name="twitter:title"]', defaultMeta.twitterTitle);
        setMetaContent('meta[name="twitter:description"]', defaultMeta.twitterDescription);
        return;
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
    }

    const copy = LEGAL_PAGES_EN[activePage];
    if (!copy) {
<<<<<<< HEAD
      return;
=======
        return;
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
    }

    document.title = copy.title;
    setMetaContent('meta[name="description"]', copy.metaDescription);
    setMetaContent('meta[property="og:title"]', copy.ogTitle);
    setMetaContent('meta[property="og:description"]', copy.ogDescription);
    setMetaContent('meta[name="twitter:title"]', copy.twitterTitle);
    setMetaContent('meta[name="twitter:description"]', copy.twitterDescription);
<<<<<<< HEAD
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
=======
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
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
            <${listTag}>
                ${section.items.map((item) => `<li>${item}</li>`).join("")}
            </${listTag}>
        `);
    }

    if (Array.isArray(section.actions) && section.actions.length) {
<<<<<<< HEAD
      body.push(`
=======
        body.push(`
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
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
<<<<<<< HEAD
  }

  function renderEnglishPage() {
    const copy = LEGAL_PAGES_EN[activePage];
    if (!copy || !mainContent) {
      return;
=======
}

function renderEnglishPage() {
    const copy = LEGAL_PAGES_EN[activePage];
    if (!copy || !mainContent) {
        return;
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
    }

    mainContent.innerHTML = `
        <section class="page-hero">
            <div class="container page-hero-shell">
                <nav class="page-breadcrumbs" aria-label="Breadcrumb">
                    <a href="${basePath}index.html">Home</a>
                    <span>•</span>
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
<<<<<<< HEAD
  }

  function renderPage(lang) {
    const resolvedLang = lang === "en" ? "en" : "ar";

    renderSiteShell({
      basePath,
      activePage,
      quoteTarget: "index.html#contact",
      backToTopTarget: "#page-top",
      lang: resolvedLang,
=======
}

function renderPage(lang) {
    const resolvedLang = lang === "en" ? "en" : "ar";

    renderSiteShell({
        basePath,
        activePage,
        quoteTarget: "index.html#contact",
        backToTopTarget: "#page-top",
        lang: resolvedLang
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
    });

    setPageMeta(resolvedLang);

    if (!mainContent) {
<<<<<<< HEAD
      html.dataset.legalReady = "true";
      bindLanguageSwitcher(renderPage);
      return;
    }

    if (resolvedLang === "ar") {
      mainContent.innerHTML = defaultMainHtml;
    } else {
      renderEnglishPage();
=======
        html.dataset.legalReady = "true";
        bindLanguageSwitcher(renderPage);
        return;
    }

    if (resolvedLang === "ar") {
        mainContent.innerHTML = defaultMainHtml;
    } else {
        renderEnglishPage();
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
    }

    html.dataset.legalReady = "true";
    bindLanguageSwitcher(renderPage);
<<<<<<< HEAD
  }

  renderPage(
    typeof getStoredLanguage === "function" ? getStoredLanguage() : "ar",
  );
=======
}

renderPage(typeof getStoredLanguage === "function" ? getStoredLanguage() : "ar");
>>>>>>> 5c6dd0d7831c7887961fcc595aff65f675b7ce40
})();

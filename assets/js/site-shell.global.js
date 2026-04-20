(function () {
  let resizeHandler = null;
  let scrollHandler = null;
  const SHELL_TRANSLATIONS = {
    ar: {
      companyName: "مصنع الغربية الذهبية",
      companyTagline: "للخرسانة الجاهزة",
      mobileCompanyName: "مصنع الغربية الذهبية للخرسانة الجاهزة",
      navAriaLabel: "التنقل الرئيسي",
      languageSwitcherLabel: "تبديل اللغة",
      themeSwitcherLabel: "تبديل الوضع",
      topBarLabel: "معلومات الاتصال السريعة",
      mobileMenuLabel: "القائمة الرئيسية",
      mobileMenuCloseLabel: "إغلاق القائمة",
      mobileMenuOpenLabel: "فتح القائمة الرئيسية",
      themeLightLabel: "الوضع الفاتح",
      themeDarkLabel: "الوضع الداكن",
      mobileThemeLight: "فاتح",
      mobileThemeDark: "داكن",
      skipLinkLabel: "تخطي إلى المحتوى",
      location: "جدة، المملكة العربية السعودية",
      hours: "من السبت إلى الخميس: 7 ص - 5 م",
      quoteLabel: "اطلب عرض سعر",
      quickLinks: "روابط سريعة",
      servicesLinks: "الخدمات",
      sitePolicies: "سياسات الموقع",
      contactInfo: "معلومات الاتصال",
      footerDesc:
        "قيادة صناعة البناء بالجودة والابتكار والاستدامة منذ عام 2012.",
      footerRights: "جميع الحقوق محفوظة.",
      callLabel: "اتصل",
      whatsappLabel: "واتساب",
      mobileQuoteLabel: "عرض سعر",
      backToTopLabel: "العودة للأعلى",
      footerAddress:
        "مبنى 9054، ابو وجاهة المرشدي، حي المرة، جدة، المملكة العربية السعودية",
      navItems: [
        { href: "index.html", label: "الرئيسية", activeKeys: ["home"] },
        { href: "index.html#about", label: "من نحن", activeKeys: [] },
        {
          href: "index.html#why-choose-us",
          label: "لماذا نحن",
          activeKeys: [],
        },
        { href: "index.html#products", label: "المنتجات", activeKeys: [] },
        { href: "index.html#projects", label: "المشاريع", activeKeys: [] },
        { href: "index.html#partners", label: "الشركاء", activeKeys: [] },
        { href: "index.html#blog", label: "المدونة", activeKeys: ["blog"] },
        { href: "index.html#certificates", label: "الشهادات", activeKeys: [] },
        {
          href: "index.html#approvals",
          label: "أوراق الاعتماد",
          activeKeys: [],
        },
        { href: "index.html#contact", label: "اتصل بنا", activeKeys: [] },
      ],
      mobileItems: [
        {
          href: "index.html",
          icon: "fa-home",
          label: "الرئيسية",
          activeKeys: ["home"],
        },
        {
          href: "index.html#about",
          icon: "fa-info-circle",
          label: "من نحن",
          activeKeys: [],
        },
        {
          href: "index.html#why-choose-us",
          icon: "fa-check-circle",
          label: "لماذا نحن",
          activeKeys: [],
        },
        {
          href: "index.html#products",
          icon: "fa-box-open",
          label: "المنتجات",
          activeKeys: [],
        },
        {
          href: "index.html#projects",
          icon: "fa-hard-hat",
          label: "المشاريع",
          activeKeys: [],
        },
        {
          href: "index.html#partners",
          icon: "fa-handshake",
          label: "الشركاء",
          activeKeys: [],
        },
        {
          href: "index.html#blog",
          icon: "fa-newspaper",
          label: "المدونة",
          activeKeys: ["blog"],
        },
        {
          href: "index.html#certificates",
          icon: "fa-certificate",
          label: "الشهادات",
          activeKeys: [],
        },
        {
          href: "index.html#approvals",
          icon: "fa-file-contract",
          label: "أوراق الاعتماد",
          activeKeys: [],
        },
        {
          href: "index.html#contact",
          icon: "fa-envelope",
          label: "اتصل بنا",
          activeKeys: [],
        },
      ],
      footerQuickItems: [
        { href: "index.html", label: "الرئيسية" },
        { href: "index.html#about", label: "من نحن" },
        { href: "index.html#why-choose-us", label: "لماذا نحن" },
        { href: "index.html#products", label: "المنتجات" },
      ],
      footerServiceItems: [
        { href: "index.html#projects", label: "المشاريع" },
        { href: "index.html#partners", label: "الشركاء" },
        { href: "blog/", label: "المدونة" },
        { href: "index.html#certificates", label: "الشهادات" },
        { href: "index.html#approvals", label: "أوراق الاعتماد" },
        { href: "index.html#contact", label: "اتصل بنا" },
        { href: "index.html#contact", label: "اطلب عرض سعر" },
      ],
      footerPolicyItems: [
        { href: "privacy-policy.html", label: "سياسة الخصوصية" },
        { href: "terms.html", label: "الشروط والأحكام" },
      ],
    },
    en: {
      companyName: "Golden Western",
      companyTagline: "Ready-Mix Concrete",
      mobileCompanyName: "Golden Western Ready-Mix Concrete",
      navAriaLabel: "Primary navigation",
      languageSwitcherLabel: "Change language",
      themeSwitcherLabel: "Change theme",
      topBarLabel: "Quick contact information",
      mobileMenuLabel: "Main menu",
      mobileMenuCloseLabel: "Close menu",
      mobileMenuOpenLabel: "Open main menu",
      themeLightLabel: "Light mode",
      themeDarkLabel: "Dark mode",
      mobileThemeLight: "Light",
      mobileThemeDark: "Dark",
      skipLinkLabel: "Skip to content",
      location: "Jeddah, Saudi Arabia",
      hours: "Sat - Thu: 7 AM - 5 PM",
      quoteLabel: "Get Quote",
      quickLinks: "Quick Links",
      servicesLinks: "Services",
      sitePolicies: "Site Policies",
      contactInfo: "Contact Info",
      footerDesc:
        "Leading the construction industry with quality, innovation, and sustainability since 2012.",
      footerRights: "All rights reserved.",
      callLabel: "Call",
      whatsappLabel: "WhatsApp",
      mobileQuoteLabel: "Quote",
      backToTopLabel: "Back to top",
      footerAddress:
        "Building 9054, Abu Wajahah Al-Murshidi, Al Murrah District, Jeddah, Saudi Arabia",
      navItems: [
        { href: "index.html", label: "Home", activeKeys: ["home"] },
        { href: "index.html#about", label: "About", activeKeys: [] },
        { href: "index.html#why-choose-us", label: "Why Us", activeKeys: [] },
        { href: "index.html#products", label: "Products", activeKeys: [] },
        { href: "index.html#projects", label: "Projects", activeKeys: [] },
        { href: "index.html#partners", label: "Partners", activeKeys: [] },
        { href: "index.html#blog", label: "Blog", activeKeys: ["blog"] },
        {
          href: "index.html#certificates",
          label: "Certificates",
          activeKeys: [],
        },
        { href: "index.html#approvals", label: "Approvals", activeKeys: [] },
        { href: "index.html#contact", label: "Contact", activeKeys: [] },
      ],
      mobileItems: [
        {
          href: "index.html",
          icon: "fa-home",
          label: "Home",
          activeKeys: ["home"],
        },
        {
          href: "index.html#about",
          icon: "fa-info-circle",
          label: "About",
          activeKeys: [],
        },
        {
          href: "index.html#why-choose-us",
          icon: "fa-check-circle",
          label: "Why Us",
          activeKeys: [],
        },
        {
          href: "index.html#products",
          icon: "fa-box-open",
          label: "Products",
          activeKeys: [],
        },
        {
          href: "index.html#projects",
          icon: "fa-hard-hat",
          label: "Projects",
          activeKeys: [],
        },
        {
          href: "index.html#partners",
          icon: "fa-handshake",
          label: "Partners",
          activeKeys: [],
        },
        {
          href: "index.html#blog",
          icon: "fa-newspaper",
          label: "Blog",
          activeKeys: ["blog"],
        },
        {
          href: "index.html#certificates",
          icon: "fa-certificate",
          label: "Certificates",
          activeKeys: [],
        },
        {
          href: "index.html#approvals",
          icon: "fa-file-contract",
          label: "Approvals",
          activeKeys: [],
        },
        {
          href: "index.html#contact",
          icon: "fa-envelope",
          label: "Contact",
          activeKeys: [],
        },
      ],
      footerQuickItems: [
        { href: "index.html", label: "Home" },
        { href: "index.html#about", label: "About" },
        { href: "index.html#why-choose-us", label: "Why Us" },
        { href: "index.html#products", label: "Products" },
      ],
      footerServiceItems: [
        { href: "index.html#projects", label: "Projects" },
        { href: "index.html#partners", label: "Partners" },
        { href: "blog/", label: "Blog" },
        { href: "index.html#certificates", label: "Certificates" },
        { href: "index.html#approvals", label: "Approvals" },
        { href: "index.html#contact", label: "Contact" },
        { href: "index.html#contact", label: "Get Quote" },
      ],
      footerPolicyItems: [
        { href: "privacy-policy.html", label: "Privacy Policy" },
        { href: "terms.html", label: "Terms & Conditions" },
        { href: "refund-policy.html", label: "Refund & Cancellation Policy" },
      ],
    },
  };

  function joinPath(basePath, target) {
    if (!target || /^(#|https?:|mailto:|tel:)/.test(target)) {
      return target;
    }

    return `${basePath}${target}`;
  }

  function isActive(activePage, keys) {
    return keys.includes(activePage) ? "active" : "";
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem("lang") === "en" ? "en" : "ar";
    } catch {
      return "ar";
    }
  }

  function resolveLanguage(lang) {
    return lang === "en" || lang === "ar" ? lang : getStoredLanguage();
  }

  function getShellCopy(lang) {
    return SHELL_TRANSLATIONS[resolveLanguage(lang)];
  }

  function applyLanguageState(lang) {
    const resolvedLang = resolveLanguage(lang);
    const isRTL = resolvedLang === "ar";
    const skipLink = document.querySelector(".skip-link");

    document.documentElement.lang = resolvedLang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", isRTL);
    document.body.dir = isRTL ? "rtl" : "ltr";

    if (skipLink) {
      skipLink.textContent = getShellCopy(resolvedLang).skipLinkLabel;
    }

    document.querySelectorAll(".lang-btn").forEach((button) => {
      const isActive = button.dataset.lang === resolvedLang;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    return resolvedLang;
  }

  function createHeader(options) {
    const { basePath, activePage, quoteTarget, lang } = options;
    const copy = getShellCopy(lang);
    const resolvedLang = resolveLanguage(lang);
    const navItems = copy.navItems.map((item) => ({
      href: item.href,
      label: item.label,
      active: isActive(activePage, item.activeKeys),
    }));
    const mobileItems = copy.mobileItems.map((item) => ({
      href: item.href,
      icon: item.icon,
      label: item.label,
      active: isActive(activePage, item.activeKeys),
    }));

    return `
        <div class="menu-overlay" id="menuOverlay" aria-hidden="true"></div>
        <div class="mobile-menu" id="mobileMenu" aria-hidden="true" aria-label="${copy.mobileMenuLabel}">
            <div class="mobile-menu-header">
                <a href="${joinPath(basePath, "index.html")}" class="mobile-menu-logo">
                    <img loading="lazy" src="${joinPath(basePath, "assets/images/logo.png")}" width="381" height="353" alt="Golden Western Logo" class="logo-img">
                    <div class="logo-text">
                        <p class="mobile-company-name">${copy.mobileCompanyName}</p>
                    </div>
                </a>
                <button class="mobile-close-btn" id="mobileCloseBtn" type="button" aria-label="${copy.mobileMenuCloseLabel}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mobile-menu-tools">
                <div class="mobile-menu-tools-row">
                    <div class="language-switcher" aria-label="${copy.languageSwitcherLabel}">
                        <button class="lang-btn ${resolvedLang === "en" ? "active" : ""}" data-lang="en" type="button">
                            <img loading="lazy" src="${joinPath(basePath, "assets/images/flags/us.png")}" width="16" height="12" alt="English Flag"> EN
                        </button>
                        <button class="lang-btn ${resolvedLang === "ar" ? "active" : ""}" data-lang="ar" type="button">
                            <img loading="lazy" src="${joinPath(basePath, "assets/images/flags/sa.png")}" width="16" height="12" alt="Arabic Flag"> AR
                        </button>
                    </div>
                    <div class="theme-switcher" aria-label="${copy.themeSwitcherLabel}">
                        <button class="theme-btn active" data-theme="light" type="button" aria-label="${copy.themeLightLabel}">
                            <i class="fas fa-sun"></i>
                            <span class="theme-btn-label">${copy.mobileThemeLight}</span>
                        </button>
                        <button class="theme-btn" data-theme="dark" type="button" aria-label="${copy.themeDarkLabel}">
                            <i class="fas fa-moon"></i>
                            <span class="theme-btn-label">${copy.mobileThemeDark}</span>
                        </button>
                    </div>
                </div>
                <a href="${joinPath(basePath, quoteTarget)}" class="quote-btn">
                    <i class="fas fa-calculator"></i>
                    <span class="mobile-quote-btn-text">${copy.quoteLabel}</span>
                </a>
            </div>
            <div class="mobile-nav-links">
                <ul>
                    ${mobileItems
                      .map(
                        (item) => `
                        <li><a href="${joinPath(basePath, item.href)}" class="${item.active}"><i class="fas ${item.icon}"></i> <span>${item.label}</span></a></li>
                    `,
                      )
                      .join("")}
                </ul>
            </div>
            <div class="mobile-menu-footer">
                <div class="mobile-contact-info">
                    <a class="mobile-contact-item mobile-contact-link" href="tel:+966544584458">
                        <i class="fas fa-phone-alt"></i>
                        <span class="mobile-contact-value" dir="ltr">+966 5 44 58 44 58</span>
                    </a>
                    <a class="mobile-contact-item mobile-contact-link" href="mailto:info@golden-western.sa">
                        <i class="fas fa-envelope"></i>
                        <span class="mobile-contact-value" dir="ltr">info@golden-western.sa</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="top-bar" role="region" aria-label="${copy.topBarLabel}">
            <div class="container">
                <div class="top-content">
                    <div class="contact-mini">
                        <div class="contact-mini-item">
                            <i class="fas fa-map-marker-alt"></i> ${copy.location}
                        </div>
                        <div class="contact-mini-item">
                            <i class="fas fa-clock"></i> ${copy.hours}
                        </div>
                        <div class="contact-mini-item">
                            <i class="fas fa-phone-alt"></i> <span dir="ltr">+966 5 44 58 44 58</span>
                        </div>
                        <div class="contact-mini-item">
                            <i class="fas fa-envelope"></i> <span dir="ltr">info@golden-western.sa</span>
                        </div>
                    </div>
                    <div class="top-actions">
                        <div class="language-switcher" aria-label="${copy.languageSwitcherLabel}">
                            <button class="lang-btn ${resolvedLang === "en" ? "active" : ""}" data-lang="en" type="button">
                                <img loading="lazy" src="${joinPath(basePath, "assets/images/flags/us.png")}" width="16" height="12" alt="English Flag"> EN
                            </button>
                            <button class="lang-btn ${resolvedLang === "ar" ? "active" : ""}" data-lang="ar" type="button">
                                <img loading="lazy" src="${joinPath(basePath, "assets/images/flags/sa.png")}" width="16" height="12" alt="Arabic Flag"> AR
                            </button>
                        </div>
                        <div class="theme-switcher" aria-label="${copy.themeSwitcherLabel}">
                            <button class="theme-btn active" data-theme="light" type="button" aria-label="${copy.themeLightLabel}">
                                <i class="fas fa-sun"></i>
                            </button>
                            <button class="theme-btn" data-theme="dark" type="button" aria-label="${copy.themeDarkLabel}">
                                <i class="fas fa-moon"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <nav id="navbar" aria-label="${copy.navAriaLabel}">
            <div class="container nav-container">
                <a href="${joinPath(basePath, "index.html")}" class="logo">
                    <img loading="lazy" src="${joinPath(basePath, "assets/images/logo.png")}" width="381" height="353" alt="Golden Western Logo" class="logo-img">
                    <div class="logo-text">
                        <h2>${copy.companyName}</h2>
                        <p>${copy.companyTagline}</p>
                    </div>
                </a>
                <ul class="nav-links">
                    ${navItems
                      .map(
                        (item) => `
                        <li><a href="${joinPath(basePath, item.href)}" class="${item.active}">${item.label}</a></li>
                    `,
                      )
                      .join("")}
                </ul>
                <div class="nav-actions">
                    <a href="${joinPath(basePath, quoteTarget)}" class="quote-btn">
                        <i class="fas fa-calculator"></i>
                        <span>${copy.quoteLabel}</span>
                    </a>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="${copy.mobileMenuOpenLabel}" aria-expanded="false" aria-controls="mobileMenu" type="button">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </nav>
    `;
  }

  function renderFooterLinks(items, basePath) {
    return items
      .map(
        (item) => `
        <li><a href="${joinPath(basePath, item.href)}"><i class="fas fa-chevron-left"></i> ${item.label}</a></li>
    `,
      )
      .join("");
  }

  function createFooter(options) {
    const { basePath, lang } = options;
    const copy = getShellCopy(lang);

    return `
        <footer>
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-logo">
                        <a href="${joinPath(basePath, "index.html")}" class="logo footer-logo-link">
                            <img loading="lazy" src="${joinPath(basePath, "assets/images/logo.png")}" width="381" height="353" alt="Golden Western Logo" class="logo-img">
                            <div class="logo-text">
                                <p class="footer-company-name">${copy.companyName}</p>
                                <p class="footer-company-tagline">${copy.companyTagline}</p>
                            </div>
                        </a>
                        <p class="footer-desc">${copy.footerDesc}</p>
                        <div class="social-links">
                            <a href="https://wa.me/966544584458" class="social-link" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i></a>
                            <a href="https://www.linkedin.com/company/golden-western-sa/" class="social-link" target="_blank" rel="noopener"><i class="fab fa-linkedin-in"></i></a>
                            <a href="https://www.facebook.com/profile.php?id=61584653161813" class="social-link" target="_blank" rel="noopener"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://x.com/goldenwesternsa" class="social-link" target="_blank" rel="noopener"><i class="fab fa-x-twitter"></i></a>
                            <a href="https://www.snapchat.com/add/golden-western?share_id=lP_OQlKx54k&locale=en-US" class="social-link" target="_blank" rel="noopener"><i class="fab fa-snapchat"></i></a>
                            <a href="https://www.instagram.com/golden_western.sa/" class="social-link" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>
                            <a href="https://www.tiktok.com/@golden_western.sa" class="social-link" target="_blank" rel="noopener"><i class="fab fa-tiktok"></i></a>
                        </div>
                    </div>
                    <div class="footer-links">
                        <h3>${copy.quickLinks}</h3>
                        <ul>${renderFooterLinks(copy.footerQuickItems, basePath)}</ul>
                    </div>
                    <div class="footer-links">
                        <h3>${copy.servicesLinks}</h3>
                        <ul>${renderFooterLinks(copy.footerServiceItems, basePath)}</ul>
                    </div>
                    <div class="footer-links">
                        <h3>${copy.sitePolicies}</h3>
                        <ul>${renderFooterLinks(copy.footerPolicyItems, basePath)}</ul>
                    </div>
                    <div class="footer-links">
                        <h3>${copy.contactInfo}</h3>
                        <p class="footer-contact"><i class="fas fa-map-marker-alt"></i> <span class="footer-contact-text">${copy.footerAddress}</span></p>
                        <p class="footer-contact"><i class="fas fa-phone-alt"></i> <span class="footer-contact-text" dir="ltr">+966 5 44 58 44 58</span></p>
                        <p class="footer-contact"><i class="fas fa-envelope"></i> <span class="footer-contact-text" dir="ltr">info@golden-western.sa</span></p>
                    </div>
                </div>
                <div class="copyright">
                    &copy; <span id="current-year"></span> ${copy.companyName} ${copy.footerRights}
                    <br>
                    <div class="policy-links">
                        ${copy.footerPolicyItems
                          .map(
                            (item, index) => `
                            <a href="${joinPath(basePath, item.href)}" class="privacy-link">${item.label}</a>
                            ${index < copy.footerPolicyItems.length - 1 ? '<span class="separator">·</span>' : ""}
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </footer>
    `;
  }

  function createStickyCta() {
    return "";
  }

  function createBackToTop(backToTopTarget, lang) {
    const copy = getShellCopy(lang);

    return `
        <a href="${backToTopTarget}" class="back-to-top" id="backToTop" aria-label="${copy.backToTopLabel}">
            <i class="fas fa-arrow-up"></i>
        </a>
    `;
  }

  function applyTheme(theme, persist) {
    const shouldPersist = persist !== false;
    const isLight = theme === "light";

    document.body.classList.toggle("light-mode", isLight);
    document.body.classList.toggle("dark-mode", !isLight);
    document.querySelectorAll(".theme-btn").forEach((button) => {
      const isActive = button.dataset.theme === theme;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (shouldPersist) {
      try {
        localStorage.setItem("theme", theme);
      } catch {}
    }

    syncNavOffset();
  }

  function syncNavOffset() {
    const topBar = document.querySelector(".top-bar");
    const offset = topBar ? topBar.offsetHeight : 0;
    document.documentElement.style.setProperty(
      "--top-bar-offset",
      `${offset}px`,
    );
  }

  function syncNavbarState() {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
      return;
    }

    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }

  function syncBackToTopState() {
    const backToTop = document.getElementById("backToTop");

    if (!backToTop) {
      return;
    }

    backToTop.classList.toggle("show", window.scrollY > 500);
  }

  function setupThemeButtons() {
    let storedTheme = "light";

    try {
      storedTheme = localStorage.getItem("theme") || "light";
    } catch {
      storedTheme = "light";
    }

    applyTheme(storedTheme, false);
    document.querySelectorAll(".theme-btn").forEach((button) => {
      button.addEventListener("click", () => applyTheme(button.dataset.theme));
    });
  }

  function setupMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("menuOverlay");
    const openButton = document.getElementById("mobileMenuToggle");
    const closeButton = document.getElementById("mobileCloseBtn");

    if (!mobileMenu || !overlay || !openButton || !closeButton) {
      return;
    }

    const closeMenu = () => {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
      mobileMenu.setAttribute("aria-hidden", "true");
      openButton.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      mobileMenu.classList.add("active");
      overlay.classList.add("active");
      mobileMenu.setAttribute("aria-hidden", "false");
      openButton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    openButton.addEventListener("click", openMenu);
    closeButton.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function setupBackToTop() {
    syncBackToTopState();
  }

  function bindLanguageSwitcher(onChange) {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.dataset.lang === "en" ? "en" : "ar";

        try {
          localStorage.setItem("lang", lang);
        } catch {}

        if (typeof onChange === "function") {
          onChange(lang);
        }
      });
    });
  }

  function renderSiteShell(options) {
    const {
      basePath = "",
      activePage = "",
      quoteTarget = "index.html#contact",
      backToTopTarget = "#page-top",
      lang = "",
    } = options || {};
    const resolvedLang = resolveLanguage(lang);
    const headerHost = document.querySelector("[data-site-header]");
    const footerHost = document.querySelector("[data-site-footer]");
    const stickyHost = document.querySelector("[data-site-sticky-cta]");
    const backToTopHost = document.querySelector("[data-site-back-to-top]");

    if (headerHost) {
      headerHost.innerHTML = createHeader({
        basePath,
        activePage,
        quoteTarget,
        lang: resolvedLang,
      });
    }

    if (footerHost) {
      footerHost.innerHTML = createFooter({ basePath, lang: resolvedLang });
    }

    if (stickyHost) {
      stickyHost.innerHTML = createStickyCta({
        basePath,
        quoteTarget,
        lang: resolvedLang,
      });
    }

    if (backToTopHost) {
      backToTopHost.innerHTML = createBackToTop(backToTopTarget, resolvedLang);
    }

    applyLanguageState(resolvedLang);
    setupThemeButtons();
    setupMobileMenu();
    setupBackToTop();
    syncNavOffset();
    syncNavbarState();

    const year = document.getElementById("current-year");
    if (year) {
      year.textContent = new Date().getFullYear();
    }

    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
    }

    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
    }

    resizeHandler = () => {
      syncNavOffset();
    };

    scrollHandler = () => {
      syncNavbarState();
      syncBackToTopState();
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("scroll", scrollHandler, { passive: true });
  }

  window.getStoredLanguage = getStoredLanguage;
  window.applyLanguageState = applyLanguageState;
  window.bindLanguageSwitcher = bindLanguageSwitcher;
  window.renderSiteShell = renderSiteShell;
})();

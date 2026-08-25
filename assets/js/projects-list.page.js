(function () {
  "use strict";
  const html = document.documentElement;
  const basePath = html.dataset.basePath || "../";
  const api = window.GW_PROJECTS_API;
  const copy = {
    ar: { title: "مشاريعنا | مصنع الغربية الذهبية للخرسانة الجاهزة", home: "الرئيسية", current: "المشاريع", breadcrumb: "مسار التنقل", kicker: "سجل المشاريع", heading: "مشاريعنا المنفذة", lead: "سجل مختار من مشاريع توريد الخرسانة الجاهزة، يوضح نطاق الأعمال وكميات التوريد وآلية التنفيذ في كل مشروع.", all: "جميع المشاريع", results: (n) => `عرض ${n} مشاريع`, details: "عرض التفاصيل", close: "إغلاق التفاصيل", overview: "نطاق المشروع", related: "مشاريع أخرى" },
    en: { title: "Our Projects | Golden Western Ready-Mix", home: "Home", current: "Projects", breadcrumb: "Breadcrumb", kicker: "Project Record", heading: "Completed Projects", lead: "A selected record of ready-mix concrete projects outlining the scope, supplied volumes and delivery approach for each assignment.", all: "All Projects", results: (n) => `Showing ${n} projects`, details: "View Details", close: "Close details", overview: "Project Scope", related: "Other Projects" }
  };
  let activeFilter = "all";
  let activeProjectId = null;
  let projectOpener = null;
  const lang = () => html.lang === "en" ? "en" : "ar";
  const asset = (path) => !path || /^(https?:)?\/\//.test(path) ? path : `${basePath}${path}`;
  const projectUrl = (id) => `/projects/?project=${encodeURIComponent(id)}`;

  function renderShell() {
    const text = copy[lang()];
    document.title = text.title;
    renderSiteShell({ basePath, activePage: "projects", quoteTarget: "/#contact", backToTopTarget: "#page-top", lang: lang() });
    document.getElementById("main-content").innerHTML = `<section class="page-hero projects-page-hero"><div class="container page-hero-shell"><nav class="page-breadcrumbs" aria-label="${text.breadcrumb}"><a href="/">${text.home}</a><span>•</span><span>${text.current}</span></nav><div class="page-hero-content"><span class="page-kicker"><i class="fas fa-building"></i>${text.kicker}</span><h1 class="page-title">${text.heading}</h1><p class="page-lead">${text.lead}</p></div></div></section><section class="page-section projects-directory-section"><div class="container"><div class="projects-directory-toolbar"><div class="filter-group" id="project-filters"></div><p class="page-results" id="project-results"></p></div><div class="project-directory-grid" id="projects-directory"></div></div></section><div class="project-detail-overlay" id="project-detail-overlay" aria-hidden="true"><div class="project-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="project-detail-title"><button class="project-detail-close" type="button" aria-label="${text.close}"><i class="fas fa-times"></i></button><div id="project-detail-content"></div></div></div>`;
  }

  function renderFilters() {
    const text = copy[lang()];
    const categories = [...new Map(api.all().map((project) => [project.category, lang() === "en" ? project.category_en : project.category_ar])).entries()];
    document.getElementById("project-filters").innerHTML = [{ id: "all", label: text.all }, ...categories.map(([id, label]) => ({ id, label }))].map((item) => `<button class="filter-chip ${item.id === activeFilter ? "active" : ""}" type="button" data-filter="${item.id}">${item.label}</button>`).join("");
  }

  function cardMarkup(project, related) {
    const item = api.localize(project, lang());
    return `<article class="directory-project-card ${related ? "directory-project-card--related" : ""}"><a class="directory-project-media" href="${projectUrl(item.id)}" data-project-link="${item.id}" aria-label="${copy[lang()].details}: ${item.title}"><img src="${asset(item.image)}" alt="${item.title}" width="800" height="520" loading="lazy" decoding="async"></a><div class="directory-project-content"><span class="directory-project-category">${item.categoryLabel}</span><h2 class="directory-project-title">${item.title}</h2>${related ? "" : `<p class="directory-project-description">${item.description}</p>`}<a class="directory-project-cta" href="${projectUrl(item.id)}" data-project-link="${item.id}" aria-label="${copy[lang()].details}: ${item.title}"><span>${copy[lang()].details}</span><i class="fas fa-arrow-left" aria-hidden="true"></i></a></div></article>`;
  }

  function renderCards() {
    const visible = api.all().filter((project) => activeFilter === "all" || project.category === activeFilter);
    document.getElementById("project-results").textContent = copy[lang()].results(visible.length);
    document.getElementById("projects-directory").innerHTML = visible.map((project) => cardMarkup(project, false)).join("");
  }

  function mediaMarkup(project, item) {
    const match = project.video && project.video.match(/[?&]v=([^&]+)/);
    if (match) {
      const orientation = project.video_orientation === "portrait" ? "portrait" : "landscape";
      return `<div class="project-detail-media project-detail-media--${orientation}"><iframe title="${item.title}" src="https://www.youtube.com/embed/${match[1]}?playsinline=1&rel=0" loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    }
    return `<div class="project-detail-media project-detail-media--image"><img src="${asset(project.image)}" alt="${item.title}"></div>`;
  }

  function openDetails(id, historyMode) {
    const project = api.get(id);
    if (!project) { closeDetails("replace"); return; }
    activeProjectId = project.id;
    const item = api.localize(project, lang());
    const related = (project.related_projects || []).map(api.get).filter(Boolean);
    document.getElementById("project-detail-content").innerHTML = `${mediaMarkup(project, item)}<div class="project-detail-body"><header class="project-detail-title-row"><div><span class="project-detail-kicker">${item.categoryLabel}</span><h2 id="project-detail-title">${item.title}</h2></div></header>${item.metrics.length ? `<div class="project-detail-stats">${item.metrics.map((metric) => `<div class="project-detail-stat"><strong>${metric.value}</strong><span>${metric.label}</span></div>`).join("")}</div>` : ""}<section class="project-detail-copy"><h3>${copy[lang()].overview}</h3>${item.subtitle ? `<strong>${item.subtitle}</strong>` : ""}<p>${item.description}</p><div class="project-detail-tags">${item.tags.map((tag) => `<span class="project-detail-tag">${tag}</span>`).join("")}</div></section>${related.length ? `<section class="project-related-directory"><h3>${copy[lang()].related}</h3><div class="project-related-grid">${related.map((entry) => cardMarkup(entry, true)).join("")}</div></section>` : ""}</div>`;
    const overlay = document.getElementById("project-detail-overlay");
    overlay.classList.add("active"); overlay.setAttribute("aria-hidden", "false"); document.body.classList.add("project-detail-open");
    document.querySelectorAll("body > *:not(.project-detail-overlay)").forEach((node) => {
      if (!node.contains(overlay)) node.inert = true;
    });
    Array.from(document.getElementById("main-content").children).forEach((node) => {
      if (node !== overlay) node.inert = true;
    });
    if (historyMode !== "none") history[historyMode === "replace" ? "replaceState" : "pushState"]({ project: project.id }, "", projectUrl(project.id));
    overlay.querySelector(".project-detail-close").focus();
  }

  function closeDetails(historyMode) {
    const overlay = document.getElementById("project-detail-overlay");
    if (!overlay) return;
    activeProjectId = null; overlay.classList.remove("active"); overlay.setAttribute("aria-hidden", "true"); document.body.classList.remove("project-detail-open");
    document.querySelectorAll("[inert]").forEach((node) => { node.inert = false; });
    if (historyMode !== "none") history[historyMode === "replace" ? "replaceState" : "pushState"]({}, "", "/projects/");
    if (projectOpener?.isConnected) projectOpener.focus();
    projectOpener = null;
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const projectLink = event.target.closest("[data-project-link]");
      if (projectLink) { event.preventDefault(); if (!activeProjectId) projectOpener = projectLink; openDetails(projectLink.dataset.projectLink, "push"); return; }
      const filter = event.target.closest("[data-filter]");
      if (filter) { activeFilter = filter.dataset.filter; renderFilters(); renderCards(); return; }
      if (event.target.closest(".project-detail-close") || event.target.id === "project-detail-overlay") closeDetails("push");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && activeProjectId) { closeDetails("push"); return; }
      if (event.key !== "Tab" || !activeProjectId) return;
      const dialog = document.querySelector(".project-detail-dialog");
      const focusable = dialog ? Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')).filter((node) => !node.hidden) : [];
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.addEventListener("popstate", () => { const id = new URLSearchParams(location.search).get("project"); id ? openDetails(id, "none") : closeDetails("none"); });
  }

  function bindLanguage() {
    bindLanguageSwitcher((nextLang) => {
      applyLanguageState(nextLang);
      renderShell(); renderFilters(); renderCards(); bindLanguage();
      if (activeProjectId) openDetails(activeProjectId, "none");
    });
  }

  function init() {
    if (!api) return;
    applyLanguageState(getStoredLanguage());
    renderShell(); renderFilters(); renderCards(); bind(); bindLanguage();
    const requested = new URLSearchParams(location.search).get("project");
    if (requested && api.get(requested)) openDetails(requested, "replace");
    else if (requested) history.replaceState({}, "", "/projects/");
  }
  document.addEventListener("DOMContentLoaded", init);
})();

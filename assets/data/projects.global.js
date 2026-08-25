(function (global) {
  "use strict";

  const projects = [
    {
      id: "2",
      slug: "burj-motayara-villa",
      title_ar: "مشروع برج موتيارا فيلا",
      title_en: "Burj Motayara Villa",
      description_ar: "بتنفيذ متواصل لأكثر من 15 ساعة مع تنسيق دقيق لعمليات الصب باستخدام عدة مضخات لضمان الجودة والكفاءة في التنفيذ.",
      description_en: "Carried out continuously for over 15 hours, with precise coordination of concrete pouring operations using multiple pumps to ensure high quality and efficient execution.",
      category: "residential",
      category_ar: "سكني",
      category_en: "Residential",
      image: "assets/images/projects/burj-motayara-villa-thumbnail.png",
      poster: "assets/images/projects/burj-motayara-villa-thumbnail.png",
      video: "https://www.youtube.com/watch?v=DxPvE_5fVyU",
      metrics: [
        { value: "4,000 م³", label_ar: "كمية الخرسانة", label_en: "Concrete Volume" },
        { value: "2 م", label_ar: "عمق اللبشة", label_en: "Raft Depth" }
      ],
      tags_ar: ["سكني", "توريد مرحلي", "إسكان"],
      tags_en: ["Residential", "Phased Supply", "Housing"],
      related_projects: ["3", "4", "5"],
      display_order: 1,
      featured: true,
      show_on_homepage: true,
      status: "published"
    },
    {
      id: "5",
      slug: "al-qaswa-company-project",
      title_ar: "مشروع شركة القصواء",
      title_en: "Al-Qaswa Company Project",
      description_ar: "توريد وصب 4,000 متر مكعب من الخرسانة الجاهزة ضمن عملية تنفيذ واسعة، مع تنسيق عدة مضخات وخلاطات لضمان استمرارية الصب وكفاءة التشغيل.",
      description_en: "Supply and placement of 4,000 cubic meters of ready-mix concrete through a large-scale operation coordinated across multiple pumps and mixer trucks.",
      category: "commercial",
      category_ar: "تجاري",
      category_en: "Commercial",
      image: "assets/images/projects/al-qaswa-company-thumbnail.png",
      poster: "assets/images/projects/al-qaswa-company-thumbnail.png",
      video: "https://www.youtube.com/watch?v=X7aD5_u-Tq8",
      metrics: [{ value: "4,000 م³", label_ar: "كمية الخرسانة", label_en: "Concrete Volume" }],
      tags_ar: ["تجاري", "صب متواصل"],
      tags_en: ["Commercial", "Continuous Pour"],
      related_projects: ["2", "3", "4"],
      display_order: 2,
      featured: true,
      show_on_homepage: true,
      status: "published"
    },
    {
      id: "4",
      slug: "darco-company-project",
      title_ar: "مشروع شركة داركو",
      title_en: "Darco Company Project",
      description_ar: "توريد منظم لـ 4,000 متر مكعب من الخرسانة الجاهزة ضمن برنامج صب ليلي، مع إدارة حركة الخلاطات واستمرارية الإمداد بكفاءة عالية.",
      description_en: "Organized delivery of 4,000 cubic meters of ready-mix concrete during a night pour, with efficient mixer-truck logistics and uninterrupted supply.",
      category: "commercial",
      category_ar: "تجاري",
      category_en: "Commercial",
      image: "assets/images/projects/darco-company-thumbnail.png",
      poster: "assets/images/projects/darco-company-thumbnail.png",
      video: "https://www.youtube.com/watch?v=uqxxwzS07Kk",
      metrics: [
        { value: "4,000 م³", label_ar: "كمية الخرسانة", label_en: "Concrete Volume" },
        { value: "صب ليلي", value_en: "Night Pour", label_ar: "نمط التنفيذ", label_en: "Execution Mode" },
        { value: "توريد متواصل", value_en: "Continuous Supply", label_ar: "خطة التوريد", label_en: "Supply Plan" }
      ],
      tags_ar: ["تجاري", "صب ليلي"],
      tags_en: ["Commercial", "Night Pour"],
      related_projects: ["2", "3", "5"],
      display_order: 3,
      featured: true,
      show_on_homepage: true,
      status: "published"
    },
    {
      id: "3",
      slug: "wahaj-real-estate",
      title_ar: "مشروع وهج العقارية",
      title_en: "Wahaj Real Estate Project",
      description_ar: "تنفيذ أعمال الخرسانة لمشروع سكني باستخدام خلطات عالية الجودة لضمان القوة والمتانة وجودة التنفيذ.",
      description_en: "Concrete works for a residential project using high-quality mixes to ensure strength, durability, and execution quality.",
      category: "infrastructure",
      category_ar: "بنية تحتية",
      category_en: "Infrastructure",
      image: "assets/images/projects/briman-water-plant.webp",
      poster: "assets/images/projects/briman-water-plant.webp",
      metrics: [
        { value: "40 MPA", label_ar: "نوع الخرسانة", label_en: "Concrete Type" },
        { value: "60,000 م³", label_ar: "متر مكعب", label_en: "Cubic Meters" },
        { value: "500,000", label_ar: "الطاقة (م³/يوم)", label_en: "Capacity (m³/day)" }
      ],
      tags_ar: ["40MPA", "بنية تحتية", "سكني"],
      tags_en: ["Specialized Mix", "Infrastructure", "Residential"],
      related_projects: ["2", "4", "5"],
      display_order: 4,
      featured: false,
      show_on_homepage: false,
      status: "published"
    }
  ];

  global.GW_PROJECTS = Object.freeze(projects.map((project) => Object.freeze(project)));
  global.GW_PROJECTS_API = Object.freeze({
    all: () => global.GW_PROJECTS.filter((project) => project.status === "published").sort((a, b) => a.display_order - b.display_order),
    get: (idOrSlug) => global.GW_PROJECTS.find((project) => project.id === String(idOrSlug) || project.slug === String(idOrSlug)),
    localize: (project, lang) => ({
      ...project,
      title: lang === "en" ? project.title_en : project.title_ar,
      subtitle: lang === "en" ? project.subtitle_en : project.subtitle_ar,
      description: lang === "en" ? project.description_en : project.description_ar,
      categoryLabel: lang === "en" ? project.category_en : project.category_ar,
      tags: lang === "en" ? project.tags_en : project.tags_ar,
      metrics: (project.metrics || []).map((metric) => ({ value: lang === "en" && metric.value_en ? metric.value_en : metric.value, label: lang === "en" ? metric.label_en : metric.label_ar }))
    })
  });
})(window);

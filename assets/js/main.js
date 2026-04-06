// --- START 3D CONCRETE BACKGROUND - Updated colors ---
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

  // Materials - Updated to blue and gold colors
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

  // 1. Create Transit Mixers (Trucks)
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

  // 2. Create Cement Blocks
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

  // 3. Create Concrete Pumps
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

  // 4. Create Steel Rebards
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

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  const pointLight = new THREE.PointLight(vibrantSecondaryColor, 10, 50); // Changed to gold
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);

  // Animation
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
// --- END 3D CONCRETE BACKGROUND ---

// Counter animation logic
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  function updateCounter() {
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const start = performance.now();

      function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        counter.textContent = current + "+";

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target + "+";
        }
      }
      requestAnimationFrame(step);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

// --- Project Data Initialization ---
const projectData = {
  project2: { m3: "35,000", units: "19" }, // Al Sadeem Residential District
  project3: { year: 2026, m3: "60,000", units: "500,000" }, // Buraiman Water Plant
  project4: { year: 2025, m3: "22,000", units: "8" }, // Al Andalus Education Campus
  project5: { year: 2025, m3: "18,000", units: "6" }, // Al Fal Education Campuses
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
// --- END Project Data Initialization ---

// --- NEW: Project Modal Functionality ---
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

// Mock project links for each project
const mockProjects = {
  1: [
    { title: "برج الواجهة البحرية", desc: "إجمالي 80,000 م³", url: "#" },
    { title: "كورنيش جدة السكني", desc: "إجمالي 62,000 م³", url: "#" },
    { title: "منتجع ساحلي خاص", desc: "إجمالي 25,000 م³", url: "#" },
  ],
  2: [
    { title: "مجمع فلل الشمال", desc: "40 مبنى منفذ", url: "#" },
    { title: "كمباوند حدائق البحر", desc: "35 مبنى منفذ", url: "#" },
    { title: "حي النرجس السكني", desc: "28 مبنى منفذ", url: "#" },
  ],
  3: [
    { title: "محطة مياه مركزية", desc: "إجمالي 250,000 م³/سنة", url: "#" },
    { title: "شبكة صرف رئيسية", desc: "إجمالي 150,000 م³/سنة", url: "#" },
    { title: "خزان إستراتيجي", desc: "إجمالي 100,000 م³", url: "#" },
  ],
  4: [
    { title: "مستودعات لوجستية", desc: "10 مستودعات منفذة", url: "#" },
    { title: "مراكز توزيع باردة", desc: "15 موقع منفذ", url: "#" },
    { title: "مصانع غذائية", desc: "8 مصانع منفذة", url: "#" },
  ],
  5: [
    { title: "كباري حديثة التنفيذ", desc: "6 كباري منفذة", url: "#" },
    { title: "عبارات تصريف سيول", desc: "4 مواقع منفذة", url: "#" },
    { title: "ممرات مشاة وجسور", desc: "12 مشروع منفذ", url: "#" },
  ],
};

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

function renderProjectFallbackImage(projectTitle) {
  videoContainer.innerHTML = `
    <img
      src="assets/images/hero/hero-1.webp"
      alt="${projectTitle}"
      loading="lazy"
      decoding="async"
      style="width:100%;height:auto;border-radius:16px;display:block;"
    >
  `;
}

function openProjectModal(projectId) {
  const projectTitle =
    document.getElementById(`project${projectId}-title`)?.textContent?.trim() ||
    "مشروع";
  const projects = mockProjects[projectId] || [];

  // فيديو خاص فقط بمشروع العروض الماسية
  const projectSpecificVideos = {
    2: "https://www.youtube.com/watch?v=knVEpLS09RM",
  };

  // فقط مشروع 2 يستخدم الفيديو
  const showcaseVideoPath = projectSpecificVideos[projectId] || "";

  modalProjectTitle.textContent = projectTitle;

  videoContainer.innerHTML = `
    <div
      class="video-loading-state"
      style="display:grid;place-items:center;min-height:240px;background:#111827;border-radius:16px;color:#cbd5e1;"
    >
      جاري تجهيز العرض...
    </div>
  `;

  if (!showcaseVideoPath) {
    renderProjectFallbackImage(projectTitle);
  } else {
    const youtubeEmbedUrl = buildYouTubeEmbedUrl(showcaseVideoPath, {
      autoplay: true,
      mute: true,
      controls: true,
      loop: false,
    });

    if (youtubeEmbedUrl) {
      videoContainer.innerHTML = `
        <div style="position:relative;width:100%;padding-top:56.25%;border-radius:16px;overflow:hidden;background:#111827;">
          <iframe
            src="${youtubeEmbedUrl}"
            title="${projectTitle}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            style="position:absolute;inset:0;width:100%;height:100%;border:0;"
          ></iframe>
        </div>
      `;
    } else {
      videoContainer.innerHTML = `
        <video controls autoplay muted loop playsinline poster="assets/images/hero/hero-1.webp">
          <source src="${showcaseVideoPath}" type="video/mp4">
        </video>
      `;

      const showcaseVideo = videoContainer.querySelector("video");
      showcaseVideo?.addEventListener(
        "error",
        () => {
          renderProjectFallbackImage(projectTitle);
        },
        { once: true },
      );
    }
  }

  mockProjectsGrid.innerHTML = "";
  projects.forEach((project) => {
    const projectLink = document.createElement("a");
    projectLink.className = "mock-project-link";
    projectLink.href = project.url;
    projectLink.target = "_blank";
    projectLink.rel = "noopener";
    projectLink.innerHTML = `
      <i class="fas fa-external-link-alt"></i>
      <div class="mock-project-info">
        <h4>${project.title}</h4>
        <p>${project.desc}</p>
      </div>
    `;
    mockProjectsGrid.appendChild(projectLink);
  });

  projectModal.classList.add("active");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  projectModal.classList.remove("active");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
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
// --- END Project Modal Functionality ---

// --- NEW: Gallery Slider Functions with Autoplay & Pause ---
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
// --- END Gallery Slider Functions ---

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

// --- UPDATED: Concrete Calculation Logic ---
function setupConcreteCalculation() {
  const quantityInput = document.getElementById("quantity");
  const quantityDisplay = document.getElementById("quantityDisplay");

  // Update display when quantity is manually entered
  quantityInput.addEventListener("input", function () {
    const quantity = parseFloat(this.value) || 0;
    if (quantity > 0) {
      quantityDisplay.textContent = `${quantity.toFixed(2)} م³`;
      quantityDisplay.classList.add("show");
    } else {
      quantityDisplay.classList.remove("show");
    }
  });

  // Show display if there's already a value
  if (quantityInput.value) {
    const quantity = parseFloat(quantityInput.value) || 0;
    if (quantity > 0) {
      quantityDisplay.textContent = `${quantity.toFixed(2)} م³`;
      quantityDisplay.classList.add("show");
    }
  }
}
// --- END Concrete Calculation Logic ---

// --- NEW: Google Sheets Integration ---
// Replace with your Google Apps Script URL

async function submitToGoogleSheets(formData) {
  try {
    const response = await fetch("./api/newsletter.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        lang: document.documentElement.lang || "ar",
        page_url: window.location.href,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || "Newsletter request failed");
    }

    return payload;
  } catch (error) {
    console.error("Newsletter submission failed:", formData, error);
    throw error;
  }
}
// --- END Google Sheets Integration ---

// Language translations
const translations = {
  en: {
    // Company Name & Tagline
    companyName: "Golden Western",
    companyTagline: "Ready-Mix Concrete & Contracting",

    // Navigation
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
    // Mobile Menu
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
    // Hero
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
    // Stats
    stat1: "Years Experience",
    stat2: "Batching Plants",
    "stat-stations": "Stations",
    stat3: "Transit Mixers",
    stat4: "Mobile Pumps",

    // About Section Translation
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

    // Why Choose Us
    whyTitle: "Why Choose Golden Western",
    whyDesc:
      "Documented quality, operating readiness, and disciplined delivery for time-sensitive projects.",
    // NEW: NRMCA Certificate
    "feature-nrmca-title": "NRMCA Certified",
    "feature-nrmca-desc":
      "An internationally recognized credential that reflects disciplined ready-mix production and consistent quality practices.",
    // NEW: Saudi Code Compliance
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
    // Products
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
    // Projects
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
    project5Tag1: "Education",
    project5Tag2: "Temperature Control",
    // Project 2
    project2Title: "Tower of Diamond Offers",
    project2Desc:
      "Carried out continuously for over 15 hours, with precise coordination of concrete pouring operations using multiple pumps to ensure high quality and efficient execution.",
    project2Meta2Label: "Cubic Meters",
    project2Meta3Label: "Floor",
    // Project 3
    project3Title: "Buraiman Water Plant",
    project3Desc:
      "Concrete works for a critical water infrastructure facility requiring specialized mixes and strong durability under moisture exposure.",
    project3Meta1Label: "Completion Year",
    project3Meta2Label: "Cubic Meters",
    project3Meta3Label: "Capacity (m³/day)",
    // Project 4
    project4Title: "Al Andalus Education Campus",
    project4Desc:
      "Controlled concrete supply for multiple education buildings with strict schedule demands and reliable structural performance.",
    project4Meta1Label: "Completion Year",
    project4Meta2Label: "Cubic Meters",
    project4Meta3Label: "Buildings Constructed",
    // Project 5
    project5Title: "Al Fal Education Campuses",
    project5Desc:
      "Temperature-controlled ready-mix supply for large educational campuses that require stable performance across long pour windows.",
    project5Meta1Label: "Completion Year",
    project5Meta2Label: "Cubic Meters",
    project5Meta3Label: "Campuses Developed",
    // Modal
    mockProjectsTitle: "Similar Projects",

    // Partners
    partnersTitle: "Our Trusted Partners",
    partnersDesc:
      "We collaborate with the region's leading real estate and construction companies to build excellence.",
    partnersNote:
      "A selection from our network of development and construction partners across ongoing and completed projects.",
    partner1: "Iqnaa Real Estate",
    partner2: "Afaq Real Estate Development",
    partner3: "Darco Development",
    partner4: "Al Moayyed Group",
    partner5: "RAZ Real Estate",
    partner6: "Rawabet Development",
    partner7: "Etmam Arabia",

    // Blog
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

    // NEW: Certificates Section
    certificatesTitle: "Certifications",
    certificatesDesc:
      "Our accreditations that reflect our commitment to quality, safety, and sustainability",
    certificatesNote:
      "A reference set of quality, safety, calibration, and compliance certificates supporting plant and supply operations.",

    // NEW: Approvals Section (formerly Tests)
    approvalsTitle: "Project Approvals",
    approvalsDesc:
      "Reference approval files that demonstrate technical readiness, supplier qualification, and documented supply acceptance for major projects",
    approvalsNote:
      "Reference approval files covering supplier prequalification, technical approvals, and project-side supply acceptance.",

    // Newsletter
    newsletterTitle: "Stay Updated",
    newsletterDesc:
      "Subscribe to our newsletter for the latest updates, industry insights, and project highlights.",
    newsletterPlaceholder: "Enter your email address",
    newsletterLabel: "Email address",
    subscribeBtn: "Subscribe",
    // Contact
    contactTitle: "Get In Touch",
    contactDesc:
      "Talk to our team to review mix requirements, pour scheduling, and a commercial quotation for your project.",
    locationTitle: "Our Location",
    locationText:
      "Building 9054, Abu Wajahah Al-Murshidi, Al-Murrah District, Jeddah, Saudi Arabia",
    phoneTitle: "Phone Numbers",
    phoneText: "0 5 44 58 44 58<br>05 04 100 55 4",
    emailTitle: "Email Address",
    emailText: "info@golden-western.sa<br>info@golden-western.com",
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

    // NEW: Form Fields
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
    // Payment
    paymentMethodLabel: "Payment Method",
    paymentOptionTamara: "Tamara (Installments)",
    paymentOptionCash: "Cash (Full Payment)",
    paymentOptionBank: "Bank Transfer",
    paymentNote1:
      "Choosing a payment method is a preference only, not an actual payment or binding agreement.",
    paymentNote2:
      "We will contact you to confirm the request and share the final quote.",
    paymentNote3:
      "Tamara installments are subject to eligibility and final approval.",
    paymentError: "Please choose a payment method.",
    // Consent
    consentPrefix: "I confirm the accuracy of the data and agree to the",
    consentPrivacy: "Privacy Policy",
    consentTerms: "Terms & Conditions",
    consentRefund: "Refund & Cancellation Policy",
    consentAnd: "and",
    consentError: "Please agree to the policies to continue.",

    // Footer
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
    "tamara-link": "Tamara Payment Info",
    footerPoliciesTitle: "Site Policies",
    footerPolicyMainPrivacy: "Privacy Policy",
    footerPolicyMainTerms: "Terms & Conditions",
    footerPolicyMainRefund: "Refund & Cancellation Policy",
    footerPolicyMainTamara: "Tamara Payment Info",
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
    // Top bar
    topBarLocation: "Jeddah, Saudi Arabia",
    topBarHours: "Sat - Thu: 7:00 AM - 5:00 PM",
    topBarPhone: "+966 5 44 58 44 58",
    topBarEmail: "info@golden-western.sa",
  },
  ar: {
    // Company Name & Tagline
    companyName: "مصنع الغربية الذهبية",
    companyTagline: "للخرسانة الجاهزة",

    // Navigation
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
    // Mobile Menu
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
    // Hero
    heroBadge: "توريد خرسانة جاهزة موثوق في جدة منذ 2012",
    heroTitle: "خرسانة جاهزة موثوقة",
    heroSubtitle: "لأداء صب يمكن التنبؤ به",
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
    // Stats
    stat1: "سنوات خبرة",
    stat2: "محطات خلط",
    "stat-stations": "محطات",
    stat3: "شاحنات خلاطة",
    stat4: "مضخات متحركة",

    // About Section Translation
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

    // Why Choose Us
    whyTitle: "لماذا تختار مصنع الغربية الذهبية",
    whyDesc:
      "جودة موثقة، وجاهزية تشغيلية، وتسليم منضبط للمشاريع الحساسة زمنياً.",
    // NEW: NRMCA Certificate
    "feature-nrmca-title": "اعتماد NRMCA",
    "feature-nrmca-desc":
      "اعتماد دولي يعكس انضباط إنتاج الخرسانة الجاهزة واستقرار ممارسات الجودة التشغيلية.",
    // NEW: Saudi Code Compliance
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
    // Products
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
    // Projects
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
    // Project 2
    project2Title: "مشروع العروض الماسية ",
    project2Desc:
      " بتنفيذ متواصل لأكثر من 15 ساعة مع تنسيق دقيق لعمليات الصب باستخدام عدة مضخات لضمان الجودة والكفاءة في التنفيذ.",
    project2Meta2Label: "متر مكعب",
    project2Meta3Label: "طابق",
    // Project 3
    project3Title: "محطة بريمان للمياه",
    project3Desc:
      "أعمال خرسانية لمرفق مائي حيوي تتطلب خلطات متخصصة ومقاومة تشغيلية عالية في بيئات الرطوبة.",
    project3Meta1Label: "سنة الانتهاء",
    project3Meta2Label: "متر مكعب",
    project3Meta3Label: "الطاقة (م³/يوم)",
    // Project 4
    project4Title: "حرم مدارس الأندلس التعليمية",
    project4Desc:
      "توريد خرسانة منضبط لمبانٍ تعليمية متعددة مع مراعاة الجداول الزمنية الصارمة ومتطلبات التشطيب والسلامة.",
    project4Meta1Label: "سنة الانتهاء",
    project4Meta2Label: "متر مكعب",
    project4Meta3Label: "مبنى مشيد",
    // Project 5
    project5Title: "مجمعات الآفال التعليمية",
    project5Desc:
      "توريد خرسانة جاهزة متحكم في حرارتها لمجمعات تعليمية كبيرة تحتاج إلى ثبات الأداء خلال فترات صب طويلة.",
    project5Meta1Label: "سنة الانتهاء",
    project5Meta2Label: "متر مكعب",
    project5Meta3Label: "مجمع مطور",
    // Modal
    mockProjectsTitle: "مشاريع مماثلة",

    // Partners
    partnersTitle: "عملاؤنا وشركاؤنا",
    partnersDesc: "ثقة كبرى الشركات والمقاولين في جودة منتجاتنا ودقة مواعيدنا.",
    partnersNote:
      "نماذج من شبكة شركائنا وعملائنا في التطوير والتنفيذ عبر مشاريع قائمة ومنجزة.",
    partner1: "شركة إقناع العقارية",
    partner2: "شركة آفاق للتطوير العقاري",
    partner3: "داركو للتطوير",
    partner4: "مجموعة المؤيد",
    partner5: "شركة راز العقارية",
    partner6: "روابط للتطوير العقاري",
    partner7: "إتمام العربية",

    // Blog
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

    // NEW: Certificates Section
    certificatesTitle: "الشهادات",
    certificatesDesc:
      "اعتماداتنا التي تعكس التزامنا بالجودة والسلامة والاستدامة",
    certificatesNote:
      "مجموعة مرجعية من شهادات الجودة والسلامة والمعايرة والامتثال الداعمة لتشغيل المصنع والتوريد.",

    // NEW: Approvals Section (formerly Tests)
    approvalsTitle: "اعتمادات المشاريع",
    approvalsDesc:
      "ملفات اعتماد مرجعية توضح الجاهزية الفنية، تأهيل المورد، واعتمادات التوريد للمشاريع والاستشاريين",
    approvalsNote:
      "ملفات اعتماد مرجعية تشمل التأهيل الفني، اعتماد الخلطات، وجدولة التوريد وقبول المورد بالمشروع.",

    // Newsletter
    newsletterTitle: "اشترك في النشرة",
    newsletterDesc:
      "استقبل آخر أخبار الخرسانة والعروض والتحديثات مباشرة إلى بريدك.",
    newsletterPlaceholder: "اكتب بريدك الإلكتروني",
    newsletterLabel: "البريد الإلكتروني",
    subscribeBtn: "اشترك الآن",
    // Contact
    contactTitle: "اتصل بنا",
    contactDesc:
      "تواصل مع فريقنا لمراجعة متطلبات الخلطة، وجدولة الصب، وإعداد عرض سعر مناسب لمشروعك.",
    locationTitle: "الموقع",
    locationText:
      "9054 مبنى أبو واجهة المرشدي، حي المروة، جدة، المملكة العربية السعودية",
    phoneTitle: "هاتف",
    phoneText: "0 5 44 58 44 58<br>05 04 100 55 4",
    emailTitle: "البريد الإلكتروني",
    emailText: "info@golden-western.sa<br>info@golden-western.com",
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

    // NEW: Form Fields
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
    // Consent
    consentPrefix: "أقرّ بصحة البيانات وأوافق على",
    consentPrivacy: "سياسة الخصوصية",
    consentTerms: "الشروط والأحكام",
    consentRefund: "سياسة الاسترجاع والإلغاء",
    consentAnd: "و",
    consentError: "فضلاً وافق على السياسات للمتابعة.",

    // Footer
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
    "tamara-link": "معلومات تمارا (الدفع)",
    footerPoliciesTitle: "سياسات الموقع",
    footerPolicyMainPrivacy: "سياسة الخصوصية",
    footerPolicyMainTerms: "الشروط والأحكام",
    footerPolicyMainRefund: "سياسة الاسترجاع والإلغاء",
    footerPolicyMainTamara: "معلومات تمارا (الدفع)",
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
    // Top bar
    topBarLocation: "جدة، المملكة العربية السعودية",
    topBarHours: "من السبت إلى الخميس: ٧ ص - ٥ م",
    topBarPhone: "+966 5 44 58 44 58",
    topBarEmail: "info@golden-western.sa",
  },
};

// Theme switcher
function toggleTheme(theme, persist = true) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  document
    .querySelectorAll(".theme-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(`.theme-btn[data-theme="${theme}"]`)
    .forEach((btn) => btn.classList.add("active"));
  if (persist) {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore storage failures.
    }
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

// Update content based on language
function updateContent(lang) {
  const content = translations[lang];
  const isRTL = lang === "ar";
  const setFooterLink = (id, label) => {
    const link = document.getElementById(id);
    if (link) link.innerHTML = `<i class="fas fa-chevron-left"></i> ${label}`;
  };

  // Update body direction
  document.body.classList.toggle("rtl", isRTL);
  document.body.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = isRTL ? "ar" : "en";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  const skipLink = document.getElementById("skip-link");
  if (skipLink) skipLink.textContent = content.skipLink;

  // Fix Marquee Direction in RTL
  const marquee = document.querySelector(".partners-marquee-container");
  if (marquee) marquee.dir = "ltr";

  // Update Company Name & Tagline
  document.getElementById("company-name").textContent = content.companyName;
  document.getElementById("company-tagline").textContent =
    content.companyTagline;
  document
    .querySelectorAll(".mobile-company-name, .footer-company-name")
    .forEach((el) => (el.textContent = content.companyName));
  document
    .querySelectorAll(".footer-company-tagline")
    .forEach((el) => (el.textContent = content.companyTagline));

  // Update desktop navigation
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link, index) => {
    if (content.nav[index]) {
      link.textContent = content.nav[index];
    }
  });

  // Update mobile navigation
  document.getElementById("mobile-home").textContent = content["mobile-home"];
  document.getElementById("mobile-about").textContent = content["mobile-about"];
  document.getElementById("mobile-why").textContent = content["mobile-why"];
  document.getElementById("mobile-products").textContent =
    content["mobile-products"];
  document.getElementById("mobile-projects").textContent =
    content["mobile-projects"];
  document.getElementById("mobile-partners").textContent =
    content["mobile-partners"];
  document.getElementById("mobile-blog").textContent = content["mobile-blog"];
  document.getElementById("mobile-certificates").textContent =
    content["mobile-certificates"];
  document.getElementById("mobile-approvals").textContent =
    content["mobile-approvals"];
  document.getElementById("mobile-contact").textContent =
    content["mobile-contact"];

  // Update quote button
  document.getElementById("quoteBtnText").textContent = content.quoteBtn;

  // Update hero section
  document.getElementById("hero-badge").textContent = content.heroBadge;
  document.getElementById("hero-title").innerHTML =
    `${content.heroTitle}<br><span>${content.heroSubtitle}</span>`;
  document.getElementById("hero-subtitle").textContent = content.heroDesc;
  document.getElementById("explore-btn").textContent = content.exploreBtn;
  document.getElementById("contact-btn").textContent = content.contactBtn;
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

  // Update stats
  document.getElementById("stat1").textContent = content.stat1;
  document.getElementById("stat2").textContent = content.stat2;
  document.getElementById("stat-stations").textContent =
    content["stat-stations"];
  document.getElementById("stat3").textContent = content.stat3;
  document.getElementById("stat4").textContent = content.stat4;

  // Update About Section
  document.getElementById("about-title").textContent = content.aboutTitle;
  document.getElementById("about-desc").textContent = content.aboutDesc;
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

  // Update Why Choose Us
  document.getElementById("why-title").textContent = content.whyTitle;
  document.getElementById("why-desc").textContent = content.whyDesc;

  // NEW: Update NRMCA Certificate Card
  document.getElementById("feature-nrmca-title").textContent =
    content["feature-nrmca-title"];
  document.getElementById("feature-nrmca-desc").textContent =
    content["feature-nrmca-desc"];

  // NEW: Update Saudi Code Compliance Card
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

  // Update Products
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

  // Update Projects
  document.getElementById("projects-title").textContent = content.projectsTitle;
  document.getElementById("projects-desc").textContent = content.projectsDesc;
  const projectsNote = document.getElementById("projects-note");
  if (projectsNote) projectsNote.textContent = content.projectsNote;

  // Project 2
  document.getElementById("project2-title").textContent = content.project2Title;
  document.getElementById("project2-desc").textContent = content.project2Desc;
  const project2Meta1Label = document.getElementById("project2-meta1-label");
  if (project2Meta1Label)
    project2Meta1Label.textContent = content.project2Meta1Label;
  document.getElementById("project2-meta2-label").textContent =
    content.project2Meta2Label;
  document.getElementById("project2-meta3-label").textContent =
    content.project2Meta3Label;
  // Project 3
  document.getElementById("project3-title").textContent = content.project3Title;
  document.getElementById("project3-desc").textContent = content.project3Desc;
  document.getElementById("project3-meta1-label").textContent =
    content.project3Meta1Label;
  document.getElementById("project3-meta2-label").textContent =
    content.project3Meta2Label;
  document.getElementById("project3-meta3-label").textContent =
    content.project3Meta3Label;
  // Project 4
  document.getElementById("project4-title").textContent = content.project4Title;
  document.getElementById("project4-desc").textContent = content.project4Desc;
  document.getElementById("project4-meta1-label").textContent =
    content.project4Meta1Label;
  document.getElementById("project4-meta2-label").textContent =
    content.project4Meta2Label;
  document.getElementById("project4-meta3-label").textContent =
    content.project4Meta3Label;
  // Project 5
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

  // Update Modal
  document.getElementById("mockProjectsTitle").textContent =
    content.mockProjectsTitle;

  // Partners
  document.getElementById("partners-title").textContent = content.partnersTitle;
  document.getElementById("partners-desc").textContent = content.partnersDesc;
  const partnersNote = document.getElementById("partners-note");
  if (partnersNote) partnersNote.textContent = content.partnersNote;

  // Update Partner Names
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

  // Payment block
  const pmLabel = document.getElementById("payment-method-label");
  if (pmLabel) pmLabel.textContent = content.paymentMethodLabel;
  const pmTamara = document.getElementById("payment-option-tamara");
  if (pmTamara) pmTamara.textContent = content.paymentOptionTamara;
  const pmCash = document.getElementById("payment-option-cash");
  if (pmCash) pmCash.textContent = content.paymentOptionCash;
  const pmBank = document.getElementById("payment-option-bank");
  if (pmBank) pmBank.textContent = content.paymentOptionBank;
  const pn1 = document.getElementById("payment-note1");
  const pn2 = document.getElementById("payment-note2");
  const pn3 = document.getElementById("payment-note3");
  if (pn1) pn1.textContent = content.paymentNote1;
  if (pn2) pn2.textContent = content.paymentNote2;
  if (pn3) pn3.textContent = content.paymentNote3;
  const pmError = document.getElementById("paymentMethodError");
  if (pmError) pmError.textContent = content.paymentError;

  // Consent text
  const consent = document.getElementById("consent-text");
  if (consent) {
    consent.innerHTML = `${content.consentPrefix} <a id="consent-privacy" href="privacy-policy.html">${content.consentPrivacy}</a> ${content.consentAnd} <a id="consent-terms" href="terms.html">${content.consentTerms}</a> ${content.consentAnd} <a id="consent-refund" href="refund-policy.html">${content.consentRefund}</a>.`;
  }
  const termsConsentError = document.getElementById("termsConsentError");
  if (termsConsentError) termsConsentError.textContent = content.consentError;

  // Footer policy links
  const privacyLink = document.getElementById("privacy-policy-link");
  const termsLink = document.getElementById("terms-link");
  const refundLink = document.getElementById("refund-link");
  const tamaraLink = document.getElementById("tamara-link");
  if (privacyLink) privacyLink.textContent = content["privacy-policy-link"];
  if (termsLink) termsLink.textContent = content["terms-link"];
  if (refundLink) refundLink.textContent = content["refund-link"];
  if (tamaraLink) tamaraLink.textContent = content["tamara-link"];

  // Update Blog
  document.getElementById("blog-title").textContent = content.blogTitle;
  document.getElementById("blog-desc").textContent = content.blogDesc;
  const blogNote = document.getElementById("blog-note");
  if (blogNote) blogNote.textContent = content.blogNote;
  document.getElementById("blog1-date").textContent = content.blog1Date;
  document.getElementById("blog1-category").textContent = content.blog1Category;
  document.getElementById("blog1-read").textContent = content.blog1Read;
  const blog1Badge = document.getElementById("blog1-badge");
  if (blog1Badge) blog1Badge.textContent = content.blog1Badge;
  document.getElementById("blog1-title").textContent = content.blog1Title;
  document.getElementById("blog1-excerpt").textContent = content.blog1Excerpt;
  document.getElementById("read-more1").textContent = content.readMore1;
  document.getElementById("blog2-date").textContent = content.blog2Date;
  document.getElementById("blog2-category").textContent = content.blog2Category;
  document.getElementById("blog2-read").textContent = content.blog2Read;
  const blog2Badge = document.getElementById("blog2-badge");
  if (blog2Badge) blog2Badge.textContent = content.blog2Badge;
  document.getElementById("blog2-title").textContent = content.blog2Title;
  document.getElementById("blog2-excerpt").textContent = content.blog2Excerpt;
  document.getElementById("read-more2").textContent = content.readMore2;
  document.getElementById("blog3-date").textContent = content.blog3Date;
  document.getElementById("blog3-category").textContent = content.blog3Category;
  document.getElementById("blog3-read").textContent = content.blog3Read;
  const blog3Badge = document.getElementById("blog3-badge");
  if (blog3Badge) blog3Badge.textContent = content.blog3Badge;
  document.getElementById("blog3-title").textContent = content.blog3Title;
  document.getElementById("blog3-excerpt").textContent = content.blog3Excerpt;
  document.getElementById("read-more3").textContent = content.readMore3;
  const blogViewAll = document.getElementById("blog-view-all");
  if (blogViewAll) blogViewAll.textContent = content.blogViewAll;

  // NEW: Update Certificates Section
  document.getElementById("certificates-title").textContent =
    content.certificatesTitle;
  document.getElementById("certificates-desc").textContent =
    content.certificatesDesc;
  const certificatesNote = document.getElementById("certificates-note");
  if (certificatesNote) certificatesNote.textContent = content.certificatesNote;

  // NEW: Update Approvals Section (formerly Tests)
  document.getElementById("approvals-title").textContent =
    content.approvalsTitle;
  document.getElementById("approvals-desc").textContent = content.approvalsDesc;
  const approvalsNote = document.getElementById("approvals-note");
  if (approvalsNote) approvalsNote.textContent = content.approvalsNote;

  // Update Newsletter
  document.getElementById("newsletter-title").textContent =
    content.newsletterTitle;
  document.getElementById("newsletter-desc").textContent =
    content.newsletterDesc;
  document.getElementById("newsletter-input").placeholder =
    content.newsletterPlaceholder;
  const newsletterLabel = document.getElementById("newsletter-label");
  if (newsletterLabel) newsletterLabel.textContent = content.newsletterLabel;
  document.getElementById("subscribe-btn").textContent = content.subscribeBtn;

  // Update Contact
  document.getElementById("contact-title").textContent = content.contactTitle;
  document.getElementById("contact-desc").textContent = content.contactDesc;
  document.getElementById("location-title").textContent = content.locationTitle;
  document.getElementById("location-text").textContent = content.locationText;
  document.getElementById("phone-title").textContent = content.phoneTitle;
  document.getElementById("phone-text").innerHTML = content.phoneText;
  document.getElementById("email-title").textContent = content.emailTitle;
  document.getElementById("email-text").innerHTML = content.emailText;
  document.getElementById("submit-btn").textContent = content.submitBtn;

  // Update form placeholders
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

  // NEW: Update contact form fields
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

  // Update Footer
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

  // Localize Footer Links
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
  setFooterLink("footer-policy-main-tamara", content.footerPolicyMainTamara);
  document.getElementById("privacy-policy-link").textContent =
    content["privacy-policy-link"];
  const termsFooterLink = document.getElementById("terms-link");
  if (termsFooterLink) termsFooterLink.textContent = content["terms-link"];
  const refundFooterLink = document.getElementById("refund-link");
  if (refundFooterLink) refundFooterLink.textContent = content["refund-link"];
  const tamaraFooterLink = document.getElementById("tamara-link");
  if (tamaraFooterLink) tamaraFooterLink.textContent = content["tamara-link"];

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

  // Update Top Bar
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

// Language switcher
const langBtns = document.querySelectorAll(".lang-btn");
const themeBtns = document.querySelectorAll(".theme-btn");

// Initialize language & theme with persistence
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
document.querySelectorAll(".lang-btn").forEach((b) => {
  b.classList.toggle("active", b.dataset.lang === savedLang);
});
toggleTheme(savedTheme, false);
syncNavOffset();
window.addEventListener("resize", syncNavOffset);
setupConcreteCalculation();

// Language switch event listeners
langBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang || "ar";
    document
      .querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(`.lang-btn[data-lang="${lang}"]`)
      .forEach((b) => b.classList.add("active"));
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // Ignore storage failures.
    }
    setupGalleries(lang);
    updateContent(lang);
  });
});

// Theme switch event listeners
themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme || "light";
    toggleTheme(theme, true);
  });
});

// Toggle Mobile Menu
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const menuOverlay = document.getElementById("menuOverlay");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

function toggleMobileMenu() {
  const isOpen = !mobileMenu.classList.contains("active");
  mobileMenu.classList.toggle("active", isOpen);
  menuOverlay.classList.toggle("active", isOpen);
  mobileMenu.setAttribute("aria-hidden", (!isOpen).toString());
  menuOverlay.setAttribute("aria-hidden", (!isOpen).toString());
  mobileMenuToggle.setAttribute("aria-expanded", isOpen.toString());
}

mobileMenuToggle.addEventListener("click", toggleMobileMenu);
mobileCloseBtn.addEventListener("click", toggleMobileMenu);
menuOverlay.addEventListener("click", toggleMobileMenu);

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileMenu.classList.contains("active")) {
      toggleMobileMenu();
    }
  });
});

// Navbar Scroll and Active Link
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    backToTop.classList.add("show");
  } else {
    navbar.classList.remove("scrolled");
    backToTop.classList.remove("show");
  }

  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-links a",
  );

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

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

// Video fallback
const video = document.querySelector("video");
if (video) {
  video.addEventListener("error", function () {
    this.style.display = "none";
  });
  video.preload = "auto";
}

// Harden target=_blank links
document.querySelectorAll('a[target=\"_blank\"]').forEach((link) => {
  if (!link.rel || !link.rel.includes("noopener")) {
    link.rel = "noopener";
  }
});

// Set current year
document.getElementById("current-year").textContent = new Date().getFullYear();

// Form submission (Secure: CSRF + honeypot + rate limit on server)
(function () {
  const form = document.getElementById("projectInquiryForm");
  if (!form) return;

  const statusEl = document.getElementById("formStatus");
  const paymentError = document.getElementById("paymentMethodError");
  const termsError = document.getElementById("termsConsentError");

  const setStatus = (msg, ok = true) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.display = "block";
    statusEl.style.background = ok
      ? "rgba(13,110,253,0.08)"
      : "rgba(229,57,53,0.08)";
    statusEl.style.color = ok ? "#0d47a1" : "#b71c1c";
  };

  async function getCsrfToken() {
    const res = await fetch("./api/csrf.php", { credentials: "same-origin" });
    if (!res.ok) throw new Error("CSRF fetch failed");
    const data = await res.json();
    if (!data.csrf) throw new Error("Missing CSRF");
    return data.csrf;
  }

  function collectFormData() {
    const concreteTypeEl = form.querySelector(
      'input[name="concreteType"]:checked',
    );
    const paymentMethodEl = form.querySelector(
      'input[name="paymentMethod"]:checked',
    );
    const termsConsentEl = document.getElementById("termsConsent");
    return {
      fullName: (document.getElementById("fullName")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      phone: (document.getElementById("phone")?.value || "").trim(),
      productType: (document.getElementById("productType")?.value || "").trim(),
      concreteType: concreteTypeEl ? concreteTypeEl.value : "",
      quantity: (document.getElementById("quantity")?.value || "").trim(),
      projectLocation: (
        document.getElementById("projectLocation")?.value || ""
      ).trim(),
      message: (document.getElementById("message")?.value || "").trim(),
      paymentMethod: paymentMethodEl ? paymentMethodEl.value : "",
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

    if (statusEl) statusEl.style.display = "none";
    if (paymentError) paymentError.style.display = "none";
    if (termsError) termsError.style.display = "none";

    // Required validation (client-side only; server also validates)
    if (
      !payload.fullName ||
      !payload.email ||
      !payload.phone ||
      !payload.message
    ) {
      setStatus(
        "يرجى تعبئة الحقول المطلوبة: الاسم، البريد، الهاتف، الرسالة",
        false,
      );
      return;
    }

    if (!payload.paymentMethod) {
      if (paymentError) paymentError.style.display = "block";
      setStatus("فضلاً اختر طريقة الدفع.", false);
      return;
    }

    if (!payload.termsAccepted) {
      if (termsError) termsError.style.display = "block";
      setStatus("فضلاً وافق على السياسات للمتابعة.", false);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtn = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class=\"fas fa-spinner fa-spin\"></i> جاري الإرسال...';
    }

    try {
      const csrf = await getCsrfToken();

      const res = await fetch("./api/contact.php", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        const msg = data.error || "تعذر إرسال الطلب الآن. حاول لاحقًا.";
        setStatus(msg, false);
        return;
      }

      setStatus(
        "تم استلام طلبك بنجاح ✅ سنقوم بالرد عليك في أقرب وقت ممكن.",
        true,
      );
      form.reset();
      if (paymentError) paymentError.style.display = "none";
      if (termsError) termsError.style.display = "none";

      // Reset quantity UI if exists
      const qd = document.getElementById("quantityDisplay");
      if (qd) {
        qd.textContent = "0 م³";
        qd.classList.remove("show");
      }
    } catch (err) {
      console.error(err);
      setStatus(
        "حدث خطأ أثناء الإرسال. تعذر الوصول إلى خدمة الطلبات الآن. حاول مرة أخرى بعد قليل.",
        false,
      );
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
  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("newsletter-input").value;

    if (email) {
      const formData = {
        email: email,
        type: "newsletter",
        timestamp: new Date().toISOString(),
      };

      try {
        await submitToGoogleSheets(formData);
        alert("تم الاشتراك في النشرة بنجاح!");
        this.reset();
      } catch (error) {
        console.error("Newsletter subscription failed:", email, error);
        alert("تعذر الاشتراك الآن. حاول مرة أخرى بعد قليل.");
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
  const configuredHeroPosterUrl = window.GW_SITE_CONFIG?.heroPosterUrl || "";
  const configuredHeroPosterMode = !!window.GW_SITE_CONFIG?.heroUsePosterModal;
  const videoSrc = configuredHeroVideoUrl || source?.getAttribute("src") || "";
  const youtubeVideoId = extractYouTubeId(configuredHeroVideoUrl);
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
    if (playBtn && configuredHeroVideoUrl) {
      playBtn.hidden = false;
      playBtn.classList.add("visible");
      playBtn.onclick = () => openHeroVideoModal(configuredHeroVideoUrl);
    }
  };

  if (configuredHeroPosterMode && configuredHeroVideoUrl) {
    if (!videoBackground) return;

    if (configuredHeroPosterUrl) {
      applyHeroPosterImage(videoBackground, configuredHeroPosterUrl);
    } else if (youtubeVideoId) {
      applyYouTubeHeroPoster(videoBackground, configuredHeroVideoUrl);
    }

    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");
    if (playBtn) {
      playBtn.hidden = false;
      playBtn.classList.add("visible");
      playBtn.onclick = () => openHeroVideoModal(configuredHeroVideoUrl);
    }
    return;
  }

  if (youtubeVideoId) {
    if (!videoBackground) return;
    applyYouTubeHeroPoster(videoBackground, configuredHeroVideoUrl);
    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");
    if (playBtn) {
      playBtn.hidden = false;
      playBtn.classList.add("visible");
      playBtn.onclick = () => openHeroVideoModal(configuredHeroVideoUrl);
    }
    return;
  }

  // For direct MP4 playback, let the native <video autoplay> flow handle startup.
  // This matches the production site behavior more closely and avoids JS-induced fallback.
  if (videoSrc) {
    let sourceUpdated = false;
    if (source && source.getAttribute("src") !== videoSrc) {
      source.src = videoSrc;
      sourceUpdated = true;
    } else if (!source && video.getAttribute("src") !== videoSrc) {
      video.src = videoSrc;
      sourceUpdated = true;
    }
    video.style.display = "block";
    video.removeAttribute("aria-hidden");
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    if (playBtn) {
      playBtn.hidden = true;
      playBtn.classList.remove("visible");
      playBtn.onclick = null;
    }
    if (sourceUpdated) {
      video.load();
    }
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
    video.preload = "auto";
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
        if (playBtn) playBtn.classList.remove("visible");
      })
      .catch(() => {
        if (playBtn) playBtn.classList.add("visible");
        if (userInitiated) video.pause();
      });
  };

  if (playBtn) {
    playBtn.classList.toggle("visible", videoAvailable);
    playBtn.addEventListener("click", () => {
      if (!videoAvailable) return;
      hydrate();
      attemptPlay(true);
    });
  }

  video.addEventListener(
    "error",
    () => {
      videoAvailable = false;
      fallbackToPoster();
    },
    { once: true },
  );

  if (!videoAvailable) return;

  hydrate();
  attemptPlay(false);
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
  loadHeroVideo();
  syncNavOffset();
});

// Initialize animations and lazy resources
window.addEventListener("load", () => {
  animateCounters();
  enableThreeIfNeeded();
  setUtmFields();
  syncNavOffset();
});

// --- Dynamic content fetch with graceful fallback ---
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

function applyHomeBlogCardContent(card, post, lang) {
  const localizedPost =
    typeof window.getLocalizedPost === "function"
      ? window.getLocalizedPost(post, lang)
      : post;
  const tags = card.querySelectorAll(".project-tags .project-tag");
  const metaItems = card.querySelectorAll(".project-meta-item");
  const image = card.querySelector("img");
  const title = card.querySelector(".project-title");
  const excerpt = card.querySelector(".project-desc");
  const readMoreLabel = lang === "en" ? "Read More" : "اقرأ المزيد";
  const featuredLabel = lang === "en" ? "Featured Article" : "مقال مميز";
  const arrowClass = lang === "en" ? "fa-arrow-right" : "fa-arrow-left";

  card.href =
    typeof window.buildArticleHref === "function"
      ? window.buildArticleHref("", localizedPost.slug)
      : `blog/${localizedPost.slug}/index.html`;
  card.setAttribute("aria-label", localizedPost.title || "");

  if (image && localizedPost.image) image.src = localizedPost.image;
  if (image)
    image.alt = localizedPost.imageAlt || localizedPost.title || image.alt;
  if (title && localizedPost.title) title.textContent = localizedPost.title;
  if (excerpt && localizedPost.excerpt)
    excerpt.textContent = localizedPost.excerpt;

  if (tags[0]) {
    tags[0].textContent = localizedPost.category || tags[0].textContent;
    tags[0].style.display = localizedPost.category ? "" : "none";
  }

  if (tags[1]) {
    tags[1].textContent = featuredLabel;
    tags[1].style.display = localizedPost.featured ? "" : "none";
  }

  if (
    metaItems[0] &&
    metaItems[0].lastElementChild &&
    typeof window.formatLocalizedDate === "function"
  ) {
    metaItems[0].lastElementChild.textContent = window.formatLocalizedDate(
      localizedPost.date,
      lang,
    );
  }

  if (metaItems[1] && metaItems[1].lastElementChild) {
    metaItems[1].lastElementChild.textContent =
      localizedPost.readTime || metaItems[1].lastElementChild.textContent;
  }

  if (metaItems[2]) {
    const icon = metaItems[2].querySelector(".project-meta-value i");
    if (icon) icon.className = `fas ${arrowClass}`;
    if (metaItems[2].lastElementChild)
      metaItems[2].lastElementChild.textContent = readMoreLabel;
  }
}

async function hydrateDynamic(preferredLang) {
  const currentLang = resolveDynamicLanguage(preferredLang);
  try {
    const [projRes, posts, partners, certificates, galleryItems] =
      await Promise.all([
        fetch("./api/projects.php")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        typeof window.loadPublicBlogPosts === "function"
          ? window.loadPublicBlogPosts("")
          : fetch("./assets/data/projects.json")
              .then((r) => r.json())
              .then((payload) => payload.data || [])
              .catch(() => []),
        fetchPublicCollection("./api/partners.php"),
        fetchPublicCollection("./api/certificates.php"),
        fetchPublicCollection("./api/gallery.php"),
      ]);
    // Projects -> fill existing cards
    const projects = projRes.data || [];
    const cards = document.querySelectorAll("#projects .project-card");
    projects.slice(0, cards.length).forEach((project, idx) => {
      applyProjectCardContent(cards[idx], project, currentLang);
    });

    const blogCards = document.querySelectorAll(
      "#blog .project-card.content-card",
    );
    posts.slice(0, blogCards.length).forEach((post, idx) => {
      applyHomeBlogCardContent(blogCards[idx], post, currentLang);
    });

    renderPartnersMarquee(partners, currentLang);
    renderCertificatesFromApi(certificates, currentLang);
    renderApprovalsFromApi(galleryItems, currentLang);
  } catch (e) {
    console.warn("Dynamic content fallback", e);
  }
}

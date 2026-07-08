import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const version = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 12);
const today = new Date().toISOString().slice(0, 10);
const siteDomain = "golden-western.sa";
const siteOrigin = `https://${siteDomain}`;
const legacySiteOrigin = "https://gw-readymix.com";
const gtmId = "GTM-N83CTP4P";
const gtmHeadSnippet = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>`;
const gtmBodySnippet = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

function resolvePath(relativePath) {
  return path.join(rootDir, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(resolvePath(relativePath), "utf8");
}

function write(relativePath, content) {
  const target = resolvePath(relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function updateCname() {
  write("CNAME", `${siteDomain}\n`);
}

function loadWindowProperty(relativePath, property) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(relativePath), sandbox, { filename: relativePath });
  return sandbox.window[property];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line ? `${pad}${line}` : line))
    .join("\n");
}

function cleanHtml(source) {
  return ensureJsonLdSchema(
    ensureTwitterMetaTags(
      ensureOpenGraphMetaTags(
        injectGoogleTagManager(
          source
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/[ \t]+\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim(),
        ),
      ),
    ),
  )
    .concat("\n");
}

function injectGoogleTagManager(source) {
  let html = source
    .replace(
      /<script>\(function\(w,d,s,l,i\)\{[\s\S]*?GTM-N83CTP4P[\s\S]*?<\/script>\s*/g,
      "",
    )
    .replace(
      /<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-N83CTP4P"[\s\S]*?<\/iframe><\/noscript>\s*/g,
      "",
    );

  const viewportMetaPattern =
    /(<meta\s+name=["']viewport["'][^>]*>\s*)/i;
  const charsetMetaPattern = /(<meta\s+charset=["'][^"']+["'][^>]*>\s*)/i;

  if (viewportMetaPattern.test(html)) {
    html = html.replace(viewportMetaPattern, `$1${gtmHeadSnippet}\n`);
  } else if (charsetMetaPattern.test(html)) {
    html = html.replace(charsetMetaPattern, `$1${gtmHeadSnippet}\n`);
  } else {
    html = html.replace(/(<head[^>]*>\s*)/i, `$1${gtmHeadSnippet}\n`);
  }

  html = html.replace(/(<body[^>]*>\s*)/i, `$1${gtmBodySnippet}\n`);
  return html;
}

function readMetaContent(source, selector) {
  const match = source.match(selector);
  return match ? match[1].trim() : "";
}

function readCanonicalUrl(source) {
  return (
    readMetaContent(
      source,
      /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/i,
    ) ||
    readMetaContent(
      source,
      /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["'][^>]*>/i,
    )
  );
}

function ensureOpenGraphMetaTags(source) {
  const robots = readMetaContent(
    source,
    /<meta\s+name=["']robots["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  if (/noindex/i.test(robots)) {
    return source;
  }

  const title = readMetaContent(source, /<title[^>]*>([\s\S]*?)<\/title>/i)
    .replace(/\s+/g, " ")
    .trim();
  const description = readMetaContent(
    source,
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  const canonical = readCanonicalUrl(source);
  const existingImage = readMetaContent(
    source,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  const image = existingImage || `${siteOrigin}/assets/images/og-default.webp`;

  if (!title || !description || !canonical) {
    return source;
  }

  const type = /\/blog\/[^/]+\/?$/.test(canonical) ? "article" : "website";
  const missingTags = [];
  if (!/property=["']og:type["']/i.test(source)) {
    missingTags.push(`<meta property="og:type" content="${type}">`);
  }
  if (!/property=["']og:title["']/i.test(source)) {
    missingTags.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
  }
  if (!/property=["']og:description["']/i.test(source)) {
    missingTags.push(
      `<meta property="og:description" content="${escapeHtml(description)}">`,
    );
  }
  if (!/property=["']og:url["']/i.test(source)) {
    missingTags.push(`<meta property="og:url" content="${escapeHtml(canonical)}">`);
  }
  if (!/property=["']og:image["']/i.test(source)) {
    missingTags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
  }

  if (!missingTags.length) {
    return source;
  }

  return source.replace(
    /(<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["'][^"']+["'])[^>]*>\s*)/i,
    `$1${missingTags.join("\n")}\n`,
  );
}

function ensureTwitterMetaTags(source) {
  const robots = readMetaContent(
    source,
    /<meta\s+name=["']robots["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  if (/noindex/i.test(robots)) {
    return source;
  }

  const title = readMetaContent(source, /<title[^>]*>([\s\S]*?)<\/title>/i)
    .replace(/\s+/g, " ")
    .trim();
  const description = readMetaContent(
    source,
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  const image = readMetaContent(
    source,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["'][^>]*>/i,
  );

  if (!title || !description) {
    return source;
  }

  const missingTags = [];
  if (!/name=["']twitter:card["']/i.test(source)) {
    missingTags.push('<meta name="twitter:card" content="summary_large_image">');
  }
  if (!/name=["']twitter:title["']/i.test(source)) {
    missingTags.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
  }
  if (!/name=["']twitter:description["']/i.test(source)) {
    missingTags.push(
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    );
  }
  if (image && !/name=["']twitter:image["']/i.test(source)) {
    missingTags.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`);
  }

  if (!missingTags.length) {
    return source;
  }

  const tags = missingTags.join("\n");

  if (/<meta\s+property=["']og:image["'][^>]*>\s*/i.test(source)) {
    return source.replace(
      /(<meta\s+property=["']og:image["'][^>]*>\s*)/i,
      `$1${tags}\n`,
    );
  }

  return source.replace(
    /(<meta\s+name=["']description["'][^>]*>\s*)/i,
    `$1${tags}\n`,
  );
}

function ensureJsonLdSchema(source) {
  if (/<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(source)) {
    return source;
  }

  const robots = readMetaContent(
    source,
    /<meta\s+name=["']robots["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  if (/noindex/i.test(robots)) {
    return source;
  }

  const title = readMetaContent(source, /<title[^>]*>([\s\S]*?)<\/title>/i)
    .replace(/\s+/g, " ")
    .trim();
  const description = readMetaContent(
    source,
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  const canonical = readCanonicalUrl(source);
  const image = readMetaContent(
    source,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["'][^>]*>/i,
  );

  if (!title || !description || !canonical) {
    return source;
  }

  let type = "WebPage";
  if (/\/blog\/[^/]+\/?$/.test(canonical)) {
    type = "Article";
  } else if (/\/blog\/?$/.test(canonical)) {
    type = "Blog";
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${canonical.replace(/\/?$/, "/")}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: "ar-SA",
    isPartOf: {
      "@type": "WebSite",
      name: "Golden Western Ready Mix",
      url: siteOrigin,
    },
  };

  if (type === "Article") {
    schema.headline = title;
    schema.publisher = {
      "@type": "Organization",
      name: "Golden Western Ready Mix",
      url: siteOrigin,
    };
  }

  if (image) {
    schema.image = image;
  }

  const json = JSON.stringify(schema, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
  const tag = `<script type="application/ld+json">\n${indent(json, 6)}\n    </script>`;

  return source.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function formatArabicDate(value) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function uniqueTags(post) {
  return Array.from(new Set([post.category_ar, ...(post.tags_ar || [])]))
    .filter(Boolean)
    .slice(0, 3);
}

function renderHomeCard(post, index) {
  const tags = uniqueTags(post)
    .map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`)
    .join("");
  const badge = post.featured
    ? '<span class="project-tag"><i class="fas fa-star"></i>مقال مميز</span>'
    : "";
  return [
    `<a class="project-card content-card article-card" href="/blog/${post.slug}/" aria-label="${escapeHtml(post.title_ar)}">`,
    `  <div class="project-image">`,
    `    <img loading="lazy" decoding="async" fetchpriority="auto" src="${escapeHtml(post.image_ar || post.image)}" alt="${escapeHtml(post.image_alt_ar || post.title_ar)}" width="1200" height="800" />`,
    `  </div>`,
    `  <div class="project-content">`,
    `    <div class="project-tags">`,
    `      ${badge}${tags}`,
    `    </div>`,
    `    <h3 class="project-title">${escapeHtml(post.title_ar)}</h3>`,
    `    <p class="project-desc">${escapeHtml(post.excerpt_ar)}</p>`,
    `    <div class="project-meta-grid">`,
    `      <div class="project-meta-item">`,
    `        <div class="project-meta-value"><i class="far fa-calendar"></i></div>`,
    `        <div>${escapeHtml(formatArabicDate(post.date))}</div>`,
    `      </div>`,
    `      <div class="project-meta-item">`,
    `        <div class="project-meta-value"><i class="far fa-clock"></i></div>`,
    `        <div>${escapeHtml(post.read_time_ar || "")}</div>`,
    `      </div>`,
    `      <div class="project-meta-item">`,
    `        <div class="project-meta-value"><i class="fas fa-arrow-left"></i></div>`,
    `        <div>اقرأ المزيد</div>`,
    `      </div>`,
    `    </div>`,
    `  </div>`,
    `</a>`,
  ].join("\n");
}

function updateHomeCards(posts) {
  const cards = [...posts]
    .filter((post) => post.slug !== "ready-mix-order-steps-jeddah")
    .slice(0, 3)
    .map(renderHomeCard)
    .join("\n");
  const pattern =
    /(\s*<div class="projects-grid home-article-grid">)([\s\S]*?)(\s*<\/div>\s*<div class="blog-actions">)/;
  const source = read("index.html");
  const updated = source
    .replace(pattern, `$1\n${indent(cards, 12)}\n$3`)
    .replace(
      /\s*<a href="#" class="social-link" target="_blank" rel="noopener"[\s\S]*?<i class="fab fa-google"><\/i[\s\S]*?<\/a>/,
      "",
    );
  write("index.html", cleanHtml(updated));
}

function updateArticlePage(relativePath, post) {
  const articleUrl = `${siteOrigin}/blog/${post.slug}/`;
  const page = read(relativePath)
    .replace(new RegExp(legacySiteOrigin, "g"), siteOrigin)
    .replace(
      /<link rel="stylesheet" href="\.\.\/\.\.\/(?:styles\/site\.css|assets\/css\/site\.bundle\.min\.css)[^"]*"\s*\/?>/,
      `<link rel="stylesheet" href="../../assets/css/site.bundle.min.css?v=${version}">`,
    )
    .replace(
      /(?:<script src="\.\.\/\.\.\/assets\/js\/site-shell\.global\.js"><\/script>\s*<script src="\.\.\/\.\.\/assets\/js\/content-card\.global\.js"><\/script>\s*<script src="\.\.\/\.\.\/assets\/data\/blog-posts\.global\.js[^"]*"><\/script>\s*<script src="\.\.\/\.\.\/assets\/data\/article-content\.global\.js"><\/script>\s*<script src="\.\.\/\.\.\/assets\/js\/article-details\.page\.js"><\/script>|<script src="\.\.\/\.\.\/assets\/js\/article\.bundle\.min\.js[^"]*" defer><\/script>)/,
      `<script src="../../assets/js/article.bundle.min.js?v=${version}" defer></script>`,
    )
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(post.meta_title_ar || post.title_ar)}</title>`,
    )
    .replace(
      /<meta name="description" content="[\s\S]*?">/,
      `<meta name="description" content="${escapeHtml(post.meta_description_ar || post.excerpt_ar)}">`,
    )
    .replace(
      /<link rel="canonical" href="[\s\S]*?">/,
      `<link rel="canonical" href="${articleUrl}">`,
    )
    .replace(
      /<meta property="og:url" content="[\s\S]*?">/,
      `<meta property="og:url" content="${articleUrl}">`,
    )
    .replace(
      /<meta property="og:title" content="[\s\S]*?">/,
      `<meta property="og:title" content="${escapeHtml(post.meta_title_ar || post.title_ar)}">`,
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?">/,
      `<meta property="og:description" content="${escapeHtml(post.meta_description_ar || post.excerpt_ar)}">`,
    )
    .replace(
      /<meta property="og:image" content="[\s\S]*?">/,
      `<meta property="og:image" content="${siteOrigin}/${escapeHtml(post.image_ar || post.image)}">`,
    )
    .replace(
      /<meta name="twitter:title" content="[\s\S]*?">/,
      `<meta name="twitter:title" content="${escapeHtml(post.meta_title_ar || post.title_ar)}">`,
    )
    .replace(
      /<meta name="twitter:description" content="[\s\S]*?">/,
      `<meta name="twitter:description" content="${escapeHtml(post.meta_description_ar || post.excerpt_ar)}">`,
    )
    .replace(
      /<meta name="twitter:image" content="[\s\S]*?">/,
      `<meta name="twitter:image" content="${siteOrigin}/${escapeHtml(post.image_ar || post.image)}">`,
    );

  write(relativePath, cleanHtml(page));
}

function updatePageRefs() {
  const indexPage = read("index.html")
    .replace(
      /<link rel="stylesheet" href="(?:styles\/site\.css|assets\/css\/site\.bundle\.min\.css)[^"]*"\s*\/?>/,
      `<link rel="stylesheet" href="assets/css/site.bundle.min.css?v=${version}" />`,
    )
    .replace(
      /(?:<script src="assets\/js\/site-config\.js[^"]*"><\/script>\s*<script src="assets\/js\/content-card\.global\.js[^"]*" defer><\/script>\s*<script src="assets\/data\/blog-posts\.global\.js[^"]*" defer><\/script>\s*<script src="assets\/js\/main\.js[^"]*" defer><\/script>|<script src="assets\/js\/home\.bundle\.min\.js[^"]*" defer><\/script>)/,
      `<script src="assets/js/home.bundle.min.js?v=${version}" defer></script>`,
    );
  write("index.html", cleanHtml(indexPage));

  const blogIndex = read("blog/index.html")
    .replace(
      /<link rel="stylesheet" href="\.\.\/(?:styles\/site\.css|assets\/css\/site\.bundle\.min\.css)[^"]*"\s*\/?>/,
      `<link rel="stylesheet" href="../assets/css/site.bundle.min.css?v=${version}" />`,
    )
    .replace(
      /(?:<script src="\.\.\/assets\/js\/site-shell\.global\.js"><\/script>\s*<script src="\.\.\/assets\/js\/content-card\.global\.js"><\/script>\s*<script src="\.\.\/assets\/data\/blog-posts\.global\.js"><\/script>\s*<script src="\.\.\/assets\/js\/blog-list\.page\.js"><\/script>|<script src="\.\.\/assets\/js\/blog\.bundle\.min\.js[^"]*" defer><\/script>)/,
      `<script src="../assets/js/blog.bundle.min.js?v=${version}" defer></script>`,
    );
  write("blog/index.html", cleanHtml(blogIndex));

  for (const file of [
    "privacy-policy.html",
  ]) {
    const page = read(file)
      .replace(
        /<link rel="stylesheet" href="(?:styles\/site\.css|assets\/css\/site\.bundle\.min\.css)[^"]*">/,
        `<link rel="stylesheet" href="assets/css/site.bundle.min.css?v=${version}">`,
      )
      .replace(
        /(?:<script src="assets\/js\/site-shell\.global\.js"><\/script>\s*<script src="assets\/js\/legal\.page\.js"><\/script>|<script src="assets\/js\/legal\.bundle\.min\.js[^"]*" defer><\/script>)/,
        `<script src="assets/js/legal.bundle.min.js?v=${version}" defer></script>`,
      );
    write(file, cleanHtml(page));
  }
}

function updateSitemap(posts) {
  const staticUrls = [
    "privacy-policy",
    "ready-mix-concrete-jeddah/",
    "standard-concrete-mixes-jeddah/",
    "high-strength-concrete-jeddah/",
    "special-concrete-mixes-jeddah/",
    "hot-weather-concrete-jeddah/",
    "ready-mix-concrete-price-factors-jeddah/",
    "blog/",
  ];
  const activeUrls = [
    ...staticUrls.map((urlPath) => `${siteOrigin}/${urlPath}`),
    ...posts.map((post) => `${siteOrigin}/blog/${post.slug}/`),
  ]
    .map((url) => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
${activeUrls}
</urlset>
`;
  write("sitemap.xml", xml);
}

function updateRobots() {
  write(
    "robots.txt",
    `User-agent: *
Allow: /
Sitemap: ${siteOrigin}/sitemap.xml
`,
  );
}

function listHtmlFiles(dir = rootDir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        return [];
      }
      return listHtmlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function updateAllHtmlMetadata() {
  for (const filePath of listHtmlFiles()) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
    if (
      relativePath === "404.html" ||
      relativePath === "google7798bb1042ba7cca.html"
    ) {
      continue;
    }
    write(relativePath, cleanHtml(read(relativePath)));
  }
}

function create404Page() {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,follow">
  <title>404 | الصفحة غير موجودة</title>
  <link rel="icon" href="assets/images/logo.png">
  <link rel="stylesheet" href="assets/css/site.bundle.min.css?v=${version}">
</head>
<body class="rtl light-mode">
  <main class="page-main">
    <section class="page-section">
      <div class="container">
        <div class="page-panel content-card-empty" style="text-align:center;padding:48px 32px;">
          <h1 class="page-title" style="margin-bottom:16px;">الصفحة غير موجودة</h1>
          <p class="page-lead" style="margin-bottom:24px;">الرابط المطلوب غير متاح حاليًا أو تم نقله إلى مسار آخر.</p>
          <p><a class="btn btn-primary" href="/">العودة إلى الرئيسية</a></p>
          <p style="margin-top:12px;"><a href="/blog/">الانتقال إلى المدونة</a></p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
`;
  write("404.html", cleanHtml(html));
}

function compactCss(source) {
  return source
    .replace(/@charset\s+["'][^"']+["'];?/gi, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function compactJs(source) {
  return source
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .filter(
      (line, index, lines) =>
        line.trim() || (index > 0 && lines[index - 1].trim()),
    )
    .join("\n")
    .trim();
}

function bundleCss(outputPath, files) {
  const content = files.map((file) => compactCss(read(file))).join("");
  write(outputPath, `${content}\n`);
}

function bundleJs(outputPath, files) {
  const content = files.map((file) => compactJs(read(file))).join(";\n");
  write(outputPath, `${content};\n`);
}

function buildBundles() {
  bundleCss("assets/css/site.bundle.min.css", [
    "assets/css/all.min.css",
    "assets/css/fonts.css",
    "assets/css/style.css",
    "styles/components.css",
    "styles/pages.css",
  ]);

  bundleJs("assets/js/home.bundle.min.js", [
    "assets/js/site-config.js",
    "assets/js/content-card.global.js",
    "assets/data/blog-posts.global.js",
    "assets/js/main.js",
  ]);

  bundleJs("assets/js/blog.bundle.min.js", [
    "assets/js/site-shell.global.js",
    "assets/js/content-card.global.js",
    "assets/data/blog-posts.global.js",
    "assets/js/blog-list.page.js",
  ]);

  bundleJs("assets/js/article.bundle.min.js", [
    "assets/js/site-shell.global.js",
    "assets/js/content-card.global.js",
    "assets/data/blog-posts.global.js",
    "assets/data/article-content.global.js",
    "assets/js/article-details.page.js",
  ]);

  bundleJs("assets/js/legal.bundle.min.js", [
    "assets/js/site-shell.global.js",
    "assets/js/legal.page.js",
  ]);
}

function main() {
  const posts = loadWindowProperty(
    "assets/data/blog-posts.global.js",
    "BLOG_POSTS",
  );

  updateCname();
  updateHomeCards(posts);
  updatePageRefs();

  for (const post of posts) {
    updateArticlePage(`blog/${post.slug}/index.html`, post);
  }

  updateAllHtmlMetadata();
  updateSitemap(posts);
  updateRobots();
  create404Page();
  buildBundles();
}

main();

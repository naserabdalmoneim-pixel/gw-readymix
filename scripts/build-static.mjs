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
  return source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .concat("\n");
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
  const loading = index === 0 ? "eager" : "lazy";
  const priority = index === 0 ? "high" : "auto";

  return [
    `<a class="project-card content-card article-card" href="blog/${post.slug}/index.html" aria-label="${escapeHtml(post.title_ar)}">`,
    `  <div class="project-image">`,
    `    <img loading="${loading}" decoding="async" fetchpriority="${priority}" src="${escapeHtml(post.image_ar || post.image)}" alt="${escapeHtml(post.image_alt_ar || post.title_ar)}" width="1200" height="800" />`,
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
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const cards = sortedPosts.slice(0, 3).map(renderHomeCard).join("\n");
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

function writeLegacyRedirect(relativePath, title) {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,follow">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${siteOrigin}/blog/">
</head>
<body>
  <main style="font-family: sans-serif; text-align: center; padding: 48px 24px">
    <h1>تم نقل هذا المقال</h1>
    <p>هذه الصفحة غير مخصصة للفهرسة. انتقل إلى <a href="${siteOrigin}/blog/">صفحة المدونة الرئيسية</a>.</p>
    <p>إذا كنت تشاهد هذا المحتوى لأنك استخدمت رابطًا قديمًا، فاضغط على الرابط السابق للوصول إلى المحتوى الأحدث.</p>
  </main>
</body>
</html>
`;
  write(relativePath, cleanHtml(html));
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
    "refund-policy.html",
    "terms.html",
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
  const activeUrls = posts
    .map(
      (post) =>
        `  <url><loc>${siteOrigin}/blog/${post.slug}/</loc><lastmod>${today}</lastmod></url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url><loc>${siteOrigin}/privacy-policy.html</loc><lastmod>${today}</lastmod></url>
  <url><loc>${siteOrigin}/terms.html</loc><lastmod>${today}</lastmod></url>
  <url><loc>${siteOrigin}/refund-policy.html</loc><lastmod>${today}</lastmod></url>
  <url><loc>${siteOrigin}/blog/</loc><lastmod>${today}</lastmod></url>
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
          <p><a class="btn btn-primary" href="index.html">العودة إلى الرئيسية</a></p>
          <p style="margin-top:12px;"><a href="blog/index.html">الانتقال إلى المدونة</a></p>
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

  writeLegacyRedirect(
    "blog/ready-mix-concrete-jeddah-guide/index.html",
    "تم نقل هذا المقال",
  );
  writeLegacyRedirect(
    "blog/concrete-quality-tests-guide/index.html",
    "تم نقل هذا المقال",
  );

  updateSitemap(posts);
  updateRobots();
  create404Page();
  buildBundles();
}

main();

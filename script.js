const GITHUB_USERNAME = "iamkenos";
const heroContent = document.querySelector("#hero-content");
const projectsGrid = document.querySelector("#projects-grid");
const projectsCount = document.querySelector("#projects-count");
const profileLink = document.querySelector("#profile-link");
const blogList = document.querySelector("#blog-list");
const blogCount = document.querySelector("#blog-count");
const blogPostView = document.querySelector("#blog-post-view");
const contactContent = document.querySelector("#contact-content");
const contactAvailability = document.querySelector("#contact-availability");
const themeToggle = document.querySelector("#theme-toggle");
const heroMark = document.querySelector("#hero-mark");

const LATEST_POSTS_COUNT = 5;
const DEFAULT_ERROR_STATE_HTML = `<div class="error-state">D'oh! That's ironic...<br/><br/><strong>Something broke.</strong><br/><br/><em>It works on my machine, I swear. Try again, perhaps?</em></div>`;
let cachedPosts = [];

window.addEventListener("hashchange", handleBlogRoute);

function setTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
  localStorage.setItem("theme", isLight ? "light" : "dark");
  if (heroMark.contentDocument) {
    heroMark.contentDocument.documentElement.dataset.theme = isLight ? "light" : "dark";
  }
  themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
  themeToggle.title = themeToggle.getAttribute("aria-label");
  themeToggle.innerHTML = `<span aria-hidden="true">${isLight ? "&#9790;" : "&#9788;"}</span>`;
}

setTheme(document.documentElement.dataset.theme);

heroMark.addEventListener("load", () => setTheme(document.documentElement.dataset.theme));
themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
});

function renderMarkdown(markdown) {
  return typeof marked !== "undefined" ? marked.parse(markdown) : markdown;
}

function renderEmphasis(text, emphasized) {
  const safeText = String(text || "").replaceAll("\\n", "<br/>");
  const safeEmphasis = String(emphasized || "");
  if (!safeEmphasis) return safeText;
  const emphasisStart = safeText.indexOf(safeEmphasis);
  if (emphasisStart === -1) return safeText;
  return `${safeText.slice(0, emphasisStart)}<em>${safeEmphasis}</em>${safeText.slice(emphasisStart + safeEmphasis.length)}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHero(hero) {
  if (hero.error) {
    heroContent.innerHTML = DEFAULT_ERROR_STATE_HTML;
    return;
  }

  const { data } = hero;
  const eyebrow = data.eyebrow
    ? `<p class="eyebrow">${data.eyebrow}</p>`
    : "";
  heroContent.innerHTML = `
    ${eyebrow}
    <h1 id="hero-title">${renderEmphasis(data.title, data["title-em"])}</h1>
    <h2 class="hero-subtitle">${renderEmphasis(data.subtitle, data["subtitle-em"])}</h2>
    <p class="hero-lede">${renderEmphasis(data.lede, data["lede-em"])}</p>
    <p class="section-kicker">${data.kicker || ""}</p>
  `;
}

function renderPortfolio({
  repositories = [],
  otherProjects = [],
  error = false,
  waiting = false,
}) {
  const totalCount = repositories.length + otherProjects.length;
  projectsCount.textContent =
    totalCount > 0
      ? `${totalCount} featured projects`
      : waiting
        ? "Waiting for a username"
        : error
          ? "Could not connect"
          : "0 featured projects";
  const githubMessage = waiting
    ? `Add your GitHub username in <strong>script.js</strong> to load repositories.`
    : error
      ? `Repositories could not be loaded. Visit the <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noreferrer">GitHub profile</a> instead.`
      : "";

  const cards = [
    ...repositories.map((repo) => ({ type: "repository", item: repo })),
    ...otherProjects.map((project) => ({ type: "project", item: project })),
  ]
    .map(({ type, item }, index) => {
      const number = String(index + 1).padStart(2, "0");
      if (type === "repository") {
        return `
          <a class="projects-card" href="${item.html_url}" target="_blank" rel="noreferrer" style="animation-delay: ${index * 70}ms">
            <div>
              <div class="projects-top"><span class="projects-index">${number}</span><span class="projects-arrow chevron-icon" aria-hidden="true"></span></div>
              <h3 class="projects-name">${item.name}</h3>
              <p class="projects-description">${item.description || "A project from the workshop."}</p>
            </div>
            <div class="projects-meta">
              ${item.language ? `<span class="language">${item.language}</span>` : ""}
              <span>&#9733; ${formatNumber(item.stargazers_count)}</span>
              ${typeof item.npmDownloads === "number" ? `<span title="npm downloads, last month">&#8681; ${formatNumber(item.npmDownloads)}</span>` : ""}
            </div>
          </a>
        `;
      }
      return `
        <a class="projects-card" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer" style="animation-delay: ${index * 70}ms">
          <div>
            <div class="projects-top"><span class="projects-index">${number}</span><span class="projects-arrow chevron-icon" aria-hidden="true"></span></div>
            <h3 class="projects-name">${escapeHtml(item.name)}</h3>
            <p class="projects-description">${escapeHtml(item.description || "A project from the workshop.")}</p>
          </div>
          ${item.language ? `<div class="projects-meta"><span class="language">${escapeHtml(item.language)}</span></div>` : ""}
        </a>
      `;
    })
    .join("");

  projectsGrid.innerHTML = `
    ${githubMessage ? `<div class="error-state projects-error">${githubMessage}</div>` : ""}
    ${cards}
  `;
}

function renderBlogPostView(slug) {
  const post = cachedPosts.find((candidate) => candidate.slug === slug);
  if (!post) return showBlogList();

  const tags = (post.data.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const date = post.data.date
    ? new Date(post.data.date).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  blogPostView.innerHTML = `
    <a class="blog-back" href="#blog/all"><span class="back-arrow chevron-icon" aria-hidden="true"></span>All posts</a>
    <span class="blog-date">${date}</span>
    <h3 class="blog-title">${post.data.title}</h3>
    ${tags.length ? `<div class="blog-tags">${tags.join(" &middot; ")}</div>` : ""}
    <div class="blog-body">${renderMarkdown(post.body)}</div>
  `;
  blogList.hidden = true;
  blogPostView.hidden = false;
  document.body.classList.remove("blog-focus");
  document.body.classList.add("reading-mode");
  blogPostView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildBlogPostsMarkup(posts) {
  return posts
    .map((post) => {
      const tags = (post.data.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const date = post.data.date
        ? new Date(post.data.date).toLocaleDateString("en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      const excerpt = post.body.split(/\n\s*\n/)[0] || "";
      const href = post.data.url || `#blog/${post.slug}`;
      const linkAttrs = post.data.url ? `target="_blank" rel="noreferrer"` : "";
      return `
      <a class="blog-preview-card" href="${href}" ${linkAttrs}>
        <div class="blog-preview-top">
          <span class="blog-date">${date}</span>
          <span class="blog-arrow chevron-icon sm-up" aria-hidden="true"></span>
        </div>
        <span>
          <h3 class="blog-title">${post.data.title}</h3>
          <div class="blog-summary">${renderMarkdown(excerpt)}</div>
          ${tags.length ? `<div class="blog-tags">${tags.join(" &middot; ")}</div>` : ""}
        </span>
        <span class="blog-arrow chevron-icon" aria-hidden="true"></span>
      </a>
    `;
    })
    .join("");
}

function renderBlogList(showAll) {
  const posts = showAll
    ? cachedPosts
    : cachedPosts.slice(0, LATEST_POSTS_COUNT);
  const postsMarkup = buildBlogPostsMarkup(posts);
  const hasMore = cachedPosts.length > LATEST_POSTS_COUNT;

  if (showAll) {
    blogList.innerHTML = `<a class="blog-back" href="#blog"><span class="back-arrow chevron-icon" aria-hidden="true"></span>Latest posts</a>${postsMarkup}`;
  } else {
    blogList.innerHTML = hasMore
      ? `${postsMarkup}<a class="blog-view-all" href="#blog/all">View all posts<span class="blog-view-all-arrow chevron-icon" aria-hidden="true"></span></a>`
      : postsMarkup;
  }
}

function renderBlog({ posts = [], error = false }) {
  if (error) {
    blogCount.textContent = "Could not load posts";
    blogList.innerHTML = DEFAULT_ERROR_STATE_HTML;
    return;
  }

  cachedPosts = posts;
  blogCount.textContent = `${posts.length} posts`;
  handleBlogRoute();
}

function renderContact(contact) {
  if (contact.error) {
    contactContent.innerHTML = DEFAULT_ERROR_STATE_HTML;
    return;
  }

  const { data, body } = contact;
  const links = data.email
    ? [["Email", `mailto:${data.email}`], ...Object.entries(data.links || {})]
    : Object.entries(data.links || {});
  contactAvailability.innerHTML = data.availability ? `<span class="contact-availability-dot" aria-hidden="true"></span>${data.availability}` : "";
  contactContent.innerHTML = `
    <div class="contact-body">${renderMarkdown(body)}</div>
    <ul class="contact-links">
      ${links
        .map(([label, href]) => {
          const isExternal = href.startsWith("http");
          const isEmail = href.startsWith("mailto:");
          return `<li><a href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${label} <span>${isEmail ? data.email : "View"}</span></a></li>`;
        })
        .join("")}
      ${data.location ? `<li class="contact-location">${data.location}</li>` : ""}
    </ul>
  `;
}

async function loadHero() {
  try {
    const response = await fetch("content/hero.md");
    if (!response.ok) throw new Error("Hero content request failed");
    const raw = await response.text();
    renderHero(parseFrontMatter(raw));
  } catch (error) {
    renderHero({ error: true });
  }
}

/** Returns last month's download count for @<scope>/<repoName> on npm, or null if it isn't published there. */
async function fetchNpmDownloads(repoName) {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/@${GITHUB_USERNAME}/${encodeURIComponent(repoName)}`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.downloads === "number" ? data.downloads : null;
  } catch (error) {
    return null;
  }
}

/**
 * The GitHub REST API has no unauthenticated way to read pinned status,
 * so pinned repo names are kept here and matched against the fetched repository list below.
 */
async function loadProjectConfig() {
  try {
    const response = await fetch("content/projects.md");
    if (!response.ok) return { github: [], others: [] };
    const raw = await response.text();
    const { data } = parseFrontMatter(raw);
    const names = data.github || data.pinned || [];
    const github = Array.isArray(names) ? names : [];
    const others = parseOtherProjects(raw);

    return { github, others };
  } catch (error) {
    return { github: [], others: [] };
  }
}

function parseOtherProjects(raw) {
  const match = raw.trim().match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return [];

  const lines = match[1].split("\n");
  const projects = [];
  let inOthers = false;
  let current = null;

  lines.forEach((line) => {
    if (/^others:\s*(?:\[\s*\])?\s*$/.test(line.trim())) {
      inOthers = true;
      return;
    }
    if (inOthers && /^[a-z][\w-]*:\s*/.test(line)) {
      inOthers = false;
    }
    if (!inOthers) return;

    const itemMatch = line.match(/^\s{2}-\s*(.*?)\s*$/);
    if (itemMatch) {
      const item = itemMatch[1].replace(/^["']|["']$/g, "");
      const fieldMatch = item.match(/^(name|url|description|language):\s*(.*?)\s*$/);
      if (fieldMatch) {
        current = { [fieldMatch[1]]: fieldMatch[2].replace(/^["']|["']$/g, "") };
      } else {
        current = { url: item };
      }
      projects.push(current);
      return;
    }
    if (!current) return;

    const fieldMatch = line.match(/^\s{4}(name|description|url|language|meta):\s*(.*?)\s*$/);
    if (fieldMatch) {
      const key = fieldMatch[1] === "meta" ? "language" : fieldMatch[1];
      current[key] = fieldMatch[2].replace(/^["']|["']$/g, "");
    }
  });

  return projects
    .map((project) => {
      if (!project.url) return null;
      const candidateUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(project.url)
        ? project.url
        : `https://${project.url}`;
      try {
        const url = new URL(candidateUrl);
        if (!["http:", "https:"].includes(url.protocol)) return null;
        return {
          ...project,
          url: url.href,
          name: project.name || url.hostname.replace(/^www\./, ""),
        };
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
}

async function fetchProjectDescription(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return "";
    const html = await response.text();
    const document = new DOMParser().parseFromString(html, "text/html");
    const description =
      document.querySelector('meta[name="description"]')?.content ||
      document.querySelector('meta[property="og:description"]')?.content ||
      document.querySelector('meta[name="twitter:description"]')?.content;
    return description?.trim() || "";
  } catch (error) {
    // Cross-origin sites that do not allow browser access fall back to the default card text.
    return "";
  }
}

async function resolveProjectDescriptions(projects) {
  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      description:
        project.description || (await fetchProjectDescription(project.url)),
    })),
  );
}

async function loadRepositories() {
  const projectConfig = await loadProjectConfig();
  const otherProjectsPromise = resolveProjectDescriptions(projectConfig.others);

  if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
    renderPortfolio({
      waiting: true,
      otherProjects: await otherProjectsPromise,
    });
    return;
  }

  profileLink.href = `https://github.com/${GITHUB_USERNAME}`;
  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?type=owner&sort=updated&per_page=100`,
    );
    const otherProjects = await otherProjectsPromise;
    if (!response.ok) throw new Error("GitHub request failed");
    const repositories = await response.json();

    let selected;
    if (projectConfig.github.length) {
      const byName = new Map(repositories.map((repo) => [repo.name, repo]));
      selected = projectConfig.github.map((name) => byName.get(name)).filter(Boolean);
    } else {
      repositories.sort(
        (first, second) =>
          second.stargazers_count - first.stargazers_count ||
          new Date(second.updated_at) - new Date(first.updated_at),
      );
      selected = repositories.slice(0, 6);
    }

    const npmDownloads = await Promise.all(
      selected.map((repo) => fetchNpmDownloads(repo.name)),
    );
    selected.forEach((repo, index) => {
      repo.npmDownloads = npmDownloads[index];
    });

    renderPortfolio({
      repositories: selected,
      otherProjects,
    });
  } catch (error) {
    renderPortfolio({
      error: true,
      otherProjects: await otherProjectsPromise,
    });
  }
}

/**
 * Splits frontmatter into { data, body }. Supports scalar values, inline lists
 * indented lists, and one level of indented key/value pairs for the links map.
 * @returns {{ data: Record<string, any>, body: string }}
 */
function parseFrontMatter(block) {
  const match = block.trim().match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: block.trim() };
  const [, frontMatter, body] = match;
  const data = {};
  let lastKey = null;
  frontMatter.split("\n").forEach((line) => {
    if (!line.trim()) return;
    const separatorIndex = line.indexOf(":");
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("- ") && lastKey) {
      if (!Array.isArray(data[lastKey])) data[lastKey] = [];
      data[lastKey].push(trimmedLine.slice(2).trim());
      return;
    }
    if (separatorIndex === -1) return;
    const isNested = /^\s/.test(line);
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (isNested && lastKey) {
      if (typeof data[lastKey] !== "object" || data[lastKey] === null)
        data[lastKey] = {};
      data[lastKey][key] = value;
    } else {
      data[key] = /^\[.*\]$/.test(value)
        ? value
            .slice(1, -1)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : value;
      lastKey = key;
    }
  });
  return { data, body: body.trim() };
}

function slugify(title, usedSlugs) {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post";
  let slug = base;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);
  return slug;
}

async function loadBlogPosts() {
  try {
    const response = await fetch("content/blog.md");
    if (!response.ok) throw new Error("Blog content request failed");
    const raw = await response.text();
    const usedSlugs = new Set();
    const posts = raw
      .split(/\n\+\+\+\n/)
      .map(parseFrontMatter)
      .filter((post) => post.data.title)
      .map((post) => ({ ...post, slug: slugify(post.data.title, usedSlugs) }));

    posts.sort(
      (first, second) =>
        new Date(second.data.date || 0) - new Date(first.data.date || 0),
    );
    renderBlog({ posts });
  } catch (error) {
    renderBlog({ error: true });
  }
}

function showBlogList(showAll) {
  blogPostView.hidden = true;
  blogPostView.innerHTML = "";
  blogList.hidden = false;
  document.body.classList.remove("reading-mode");
  document.body.classList.toggle("blog-focus", showAll);
  renderBlogList(showAll);
}

function handleBlogRoute() {
  const hash = window.location.hash;
  if (hash === "#blog/all") return showBlogList(true);
  const match = hash.match(/^#blog\/(.+)$/);
  if (match) renderBlogPostView(decodeURIComponent(match[1]));
  else showBlogList(false);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

async function loadContact() {
  try {
    const response = await fetch("content/contact.md");
    if (!response.ok) throw new Error("Contact content request failed");
    const raw = await response.text();
    const { data, body } = parseFrontMatter(raw);
    renderContact({ data, body });
  } catch (error) {
    renderContact({ error: true });
  }
}

loadHero();
loadRepositories();
loadBlogPosts();
loadContact();

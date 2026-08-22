const GITHUB_USERNAME = "iamkenos";
const heroContent = document.querySelector("#hero-content");
const repositoryGrid = document.querySelector("#repository-grid");
const repositoryCount = document.querySelector("#repository-count");
const profileLink = document.querySelector("#profile-link");
const blogList = document.querySelector("#blog-list");
const blogCount = document.querySelector("#blog-count");
const blogPostView = document.querySelector("#blog-post-view");
const contactContent = document.querySelector("#contact-content");
const contactAvailability = document.querySelector("#contact-availability");

const LATEST_POSTS_COUNT = 5;
let cachedPosts = [];

document.querySelector("#footer-year").textContent = new Date().getFullYear();
window.addEventListener("hashchange", handleBlogRoute);

function renderMarkdown(markdown) {
  return typeof marked !== "undefined" ? marked.parse(markdown) : markdown;
}

function renderEmphasis(text, emphasized) {
  const safeText = String(text || "");
  const safeEmphasis = String(emphasized || "");
  if (!safeEmphasis) return safeText;
  const emphasisStart = safeText.indexOf(safeEmphasis);
  if (emphasisStart === -1) return safeText;
  return `${safeText.slice(0, emphasisStart)}<em>${safeEmphasis}</em>${safeText.slice(emphasisStart + safeEmphasis.length)}`;
}

function renderHero(hero) {
  if (hero.error) {
    heroContent.innerHTML = `<div class="error-state">Add hero content to <strong>content/hero.md</strong>.</div>`;
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

function renderRepositories({
  repositories = [],
  error = false,
  waiting = false,
}) {
  if (waiting) {
    repositoryCount.textContent = "Waiting for a username";
    repositoryGrid.innerHTML = `<div class="error-state">Add your GitHub username in <strong>script.js</strong> to load repositories.</div>`;
    return;
  }
  if (error) {
    repositoryCount.textContent = "Could not connect";
    repositoryGrid.innerHTML = `<div class="error-state">Repositories could not be loaded. Visit the <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noreferrer">GitHub profile</a> instead.</div>`;
    return;
  }
  repositoryCount.textContent = `${repositories.length} featured repositories`;
  repositoryGrid.innerHTML = repositories
    .map(
      (repo, index) => `
    <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noreferrer" style="animation-delay: ${index * 70}ms">
      <div>
        <div class="repo-top"><span class="repo-index">0${index + 1}</span><img class="repo-arrow" src="./assets/chevron.svg" alt="" aria-hidden="true"></div>
        <h3 class="repo-name">${repo.name}</h3>
        <p class="repo-description">${repo.description || "A project from the workshop."}</p>
      </div>
      <div class="repo-meta">
        ${repo.language ? `<span class="language">${repo.language}</span>` : ""}
        <span>&#9733; ${formatNumber(repo.stargazers_count)}</span>
        ${typeof repo.npmDownloads === "number" ? `<span title="npm downloads, last month">&#8681; ${formatNumber(repo.npmDownloads)}</span>` : ""}
      </div>
    </a>
  `,
    )
    .join("");
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
    <a class="blog-back" href="#blog"><img class="back-arrow" src="./assets/chevron.svg" alt="" aria-hidden="true">All posts</a>
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
      <a class="blog-post" href="${href}" ${linkAttrs}>
        <span class="blog-date">${date}</span>
        <span>
          <h3 class="blog-title">${post.data.title}</h3>
          <div class="blog-summary">${renderMarkdown(excerpt)}</div>
          ${tags.length ? `<div class="blog-tags">${tags.join(" &middot; ")}</div>` : ""}
        </span>
        <img class="blog-arrow" src="./assets/chevron.svg" alt="" aria-hidden="true">
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
    blogList.innerHTML = `<a class="blog-back" href="#blog"><img class="back-arrow" src="./assets/chevron.svg" alt="" aria-hidden="true">Latest posts</a>${postsMarkup}`;
  } else {
    blogList.innerHTML = hasMore
      ? `${postsMarkup}<a class="blog-view-all" href="#blog/all">View all posts<img class="blog-view-all-arrow" src="./assets/chevron.svg" alt="" aria-hidden="true"></a>`
      : postsMarkup;
  }
}

function renderBlog({ posts = [], error = false }) {
  if (error) {
    blogCount.textContent = "Could not load posts";
    blogList.innerHTML = `<div class="error-state">Add posts to <strong>content/blog.md</strong> to populate this section.</div>`;
    return;
  }

  cachedPosts = posts;
  blogCount.textContent = `${posts.length} posts`;
  handleBlogRoute();
}

function renderContact(contact) {
  if (contact.error) {
    contactContent.innerHTML = `<div class="error-state">Add your details to <strong>content/contact.md</strong> to populate this section.</div>`;
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
async function loadPinnedRepositoryNames() {
  try {
    const response = await fetch("content/repositories.md");
    if (!response.ok) return [];
    const raw = await response.text();
    const { data } = parseFrontMatter(raw);
    const names = data.pinned || [];

    return Array.isArray(names) ? names : [];
  } catch (error) {
    return [];
  }
}

async function loadRepositories() {
  if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
    renderRepositories({ waiting: true });
    return;
  }

  profileLink.href = `https://github.com/${GITHUB_USERNAME}`;
  try {
    const [response, pinnedNames] = await Promise.all([
      fetch(
        `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?type=owner&sort=updated&per_page=100`,
      ),
      loadPinnedRepositoryNames(),
    ]);
    if (!response.ok) throw new Error("GitHub request failed");
    const repositories = await response.json();

    let selected;
    if (pinnedNames.length) {
      const byName = new Map(repositories.map((repo) => [repo.name, repo]));
      selected = pinnedNames.map((name) => byName.get(name)).filter(Boolean);
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

    renderRepositories({ repositories: selected });
  } catch (error) {
    renderRepositories({ error: true });
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

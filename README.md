# Personal site

A static personal site with a hero, pinned GitHub repositories, a blog list, and a contact section. Colors follow the [Nord palette](https://www.nordtheme.com). No build step, no framework.

## Customize

1. Open `script.js` and replace `YOUR_GITHUB_USERNAME` with your GitHub username. This section pulls your public repositories live from the GitHub REST API.
   - The GitHub REST API has no public, unauthenticated way to read your actual "pinned" repositories (that requires an authenticated GraphQL call, which would expose a token in client-side code on a public site). Instead, `content/pinned.json` lists the repo names you've pinned on your profile; the script fetches your repos, then filters and orders them to match this list.
   - Update `content/pinned.json` whenever you change your pinned repositories on GitHub. If the file is empty or missing, the section falls back to your top starred/updated repositories.
2. Edit `index.html` for the hero placeholder text, name, and image (an inline SVG placeholder is used so no external image is required).
3. Edit content in Markdown, no HTML required:
   - `content/blog.md`: one post per block, separated by a line containing only `+++`. Each block starts with `---` frontmatter (`title`, `date`, `tags`, `url`) followed by a short Markdown summary.
   - `content/contact.md`: `---` frontmatter (`heading`, `email`, , `availability`) followed by a short Markdown intro paragraph. `email` (if supplied) is rendered as a link automatically. Add any other links under an indented `links:` block, one `Label: url` pair per line — each becomes a rendered link, labeled with its key.
4. Markdown bodies are rendered client-side with [marked](https://github.com/markedjs/marked), loaded from a CDN in `index.html`.

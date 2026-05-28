document.getElementById("year").textContent = new Date().getFullYear();

async function loadPosts() {
  const list = document.getElementById("post-list");
  try {
    const res = await fetch("posts/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load posts/index.json");
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      list.innerHTML = `<p class="muted">No posts yet — drop an HTML file into <code>posts/</code> and add an entry to <code>posts/index.json</code>.</p>`;
      return;
    }

    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    list.innerHTML = posts.map(p => {
      const tags = (p.tags || []).map(t => `<span class="tag">${escape(t)}</span>`).join("");
      const date = p.date ? new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
      return `
        <a class="post-card" href="posts/${escape(p.file)}">
          <h3>${escape(p.title)}</h3>
          <div class="meta">${date ? `<span>${date}</span>` : ""}${tags}</div>
          <p>${escape(p.summary || "")}</p>
        </a>
      `;
    }).join("");
  } catch (err) {
    list.innerHTML = `<p class="muted">Could not load posts list: ${err.message}</p>`;
  }
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadPosts();

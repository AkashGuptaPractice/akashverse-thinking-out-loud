document.getElementById("year").textContent = new Date().getFullYear();

/* ─────────── Posts loader (with reading-time estimate) ─────────── */
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
      const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
      const date = p.date
        ? new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "";
      const minutes = p.readMinutes ? `<span>· ${p.readMinutes} min read</span>` : "";
      return `
        <a class="post-card tilt" href="posts/${esc(p.file)}">
          <h3>${esc(p.title)}</h3>
          <div class="meta">${date ? `<span>${date}</span>` : ""}${minutes}${tags}</div>
          <p>${esc(p.summary || "")}</p>
        </a>
      `;
    }).join("");

    attachTilt(document.querySelectorAll(".post-card.tilt"));
  } catch (err) {
    list.innerHTML = `<p class="muted">Could not load posts list: ${err.message}</p>`;
  }
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─────────── 3D Tilt on cards (mousemove-driven, perf-friendly) ─────────── */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;

function attachTilt(nodes) {
  if (reduceMotion || !isFinePointer) return;
  nodes.forEach(card => {
    let raf = 0;
    const max = 8; // max tilt degrees
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform =
          `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateZ(0)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });
}

/* ─────────── Hero parallax (mouse + scroll on the gradient blobs + avatar) ─────────── */
function initHeroParallax() {
  if (reduceMotion) return;
  const hero = document.querySelector(".hero");
  const avatar = document.querySelector(".avatar");
  if (!hero) return;

  if (isFinePointer) {
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      hero.style.setProperty("--mx", x.toFixed(3));
      hero.style.setProperty("--my", y.toFixed(3));
      if (avatar) {
        avatar.style.transform =
          `perspective(600px) rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
      }
    });
    hero.addEventListener("mouseleave", () => {
      hero.style.setProperty("--mx", 0);
      hero.style.setProperty("--my", 0);
      if (avatar) avatar.style.transform = "";
    });
  }
}

/* ─────────── Tilt for journey items + skill chips (lighter, optional) ─────────── */
function initJourneyTilt() {
  if (reduceMotion || !isFinePointer) return;
  attachTilt(document.querySelectorAll(".timeline li"));
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroParallax();
  initJourneyTilt();
  initThemeToggle();
});

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const effective = current || (systemLight ? "light" : "dark");
    const next = effective === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

loadPosts();

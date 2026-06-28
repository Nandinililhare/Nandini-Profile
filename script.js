// ---- Mobile nav toggle ----
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ---- Scroll reveal animations ----
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

// ---- Active nav link highlighting ----
const sections = document.querySelectorAll("main section[id]");
const navAnchorMap = new Map();

document.querySelectorAll(".nav-links a[data-section]").forEach((a) => {
  navAnchorMap.set(a.getAttribute("data-section"), a);
});

if ("IntersectionObserver" in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navAnchorMap.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchorMap.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { threshold: 0.4, rootMargin: "-72px 0px -40% 0px" }
  );

  sections.forEach((s) => navObserver.observe(s));
}

// ---- Resume HTML download ----
function buildResumeDocument() {
  const resumeNode = document.getElementById("resumeDoc");
  if (!resumeNode) return null;

  const styles = `
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 760px; margin: 40px auto; padding: 0 24px; color: #1c1f1d; background: #fbfbf9; line-height: 1.55; }
    .r-head { text-align: center; margin-bottom: 26px; padding-bottom: 18px; border-bottom: 2px solid #16201c; }
    .r-head h3 { margin: 0; font-size: 1.7rem; letter-spacing: 0.04em; color: #16201c; font-family: Arial, sans-serif; }
    .r-head p { margin: 6px 0 0; color: #555; font-size: 0.95rem; }
    .r-block { margin-bottom: 26px; }
    .r-block h4 { margin: 0 0 10px; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #0f6d5f; border-bottom: 1px solid #ddd; padding-bottom: 6px; font-family: Arial, sans-serif; }
    .r-block p { margin: 0; color: #2b2f2d; }
    .r-job { margin-bottom: 20px; }
    .r-job-head { display: flex; justify-content: space-between; gap: 12px; font-size: 1rem; color: #16201c; font-family: Arial, sans-serif; }
    .r-role { margin: 3px 0 4px; font-style: italic; color: #555; font-size: 0.9rem; }
    .r-stack { margin: 0 0 8px; color: #a14a1e; font-size: 0.86rem; font-weight: 700; font-family: Arial, sans-serif; }
    ul { margin: 0; padding-left: 22px; }
    li + li { margin-top: 5px; }
    @media print {
      body { margin: 0; padding: 24px; }
    }
  `;

  const doc = document.implementation.createHTMLDocument("Nandini Lilhare - Resume");
  const styleTag = doc.createElement("style");
  styleTag.textContent = styles;
  doc.head.appendChild(styleTag);

  const metaCharset = doc.createElement("meta");
  metaCharset.setAttribute("charset", "UTF-8");
  doc.head.prepend(metaCharset);

  const metaViewport = doc.createElement("meta");
  metaViewport.setAttribute("name", "viewport");
  metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
  doc.head.appendChild(metaViewport);

  doc.body.innerHTML = resumeNode.outerHTML;

  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
}

function downloadResume() {
  const html = buildResumeDocument();
  if (!html) return;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Nandini_Lilhare_Resume.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const downloadBtn1 = document.getElementById("downloadResumeBtn");
const downloadBtn2 = document.getElementById("downloadResumeBtn2");

if (downloadBtn1) downloadBtn1.addEventListener("click", downloadResume);
if (downloadBtn2) downloadBtn2.addEventListener("click", downloadResume);
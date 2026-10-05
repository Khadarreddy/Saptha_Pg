const CONFIG = {
  whatsapp: "919492443362",
  maps: "https://www.google.com/maps/place/Saptha+Srinivasa+PG/@12.837651,77.6500047,19z/data=!4m15!1m8!3m7!1s0x3bae6b7ee4b069f1:0x1d6b5a3d3b499cde!2s707,+4th+Cross+Road,+Neeladri+Nagar,+Electronic+City+Phase+I,+Electronic+City,+Bengaluru,+Maragondanahalli,+Karnataka+560100,+India!3b1!8m2!3d12.8375146!4d77.6499936!16s%2Fg%2F11zcw19761!3m5!1s0x3bae6b005d475b93:0xe6bdd1c32c719e2d!8m2!3d12.8375146!4d77.6499936!16s%2Fg%2F11x613yfkp?hl=en-US&entry=ttu"
};

const intro =
  "Hi Saptha Srinivasa PG, I found you while searching for PG in Electronic City / PG near me in Bangalore.";

const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

const hasWhatsappNumber = () => /^91[6-9]\d{9}$/.test(CONFIG.whatsapp);

const toast = (message) => {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => {
    el.hidden = true;
  }, 3200);
};

document.getElementById("year").textContent = new Date().getFullYear();
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("saptha-theme");
const setTheme = (isDark) => {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.querySelector(".theme-label").textContent = isDark ? "Light" : "Dark";
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "○" : "◐";
};
setTheme(savedTheme === "dark");
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme !== "dark";
  setTheme(isDark);
  localStorage.setItem("saptha-theme", isDark ? "dark" : "light");
});
const waFloat = document.getElementById("waFloat");
if (hasWhatsappNumber()) {
  waFloat.href = waLink(intro);
} else {
  waFloat.addEventListener("click", (event) => {
    event.preventDefault();
    toast("Add your WhatsApp number in js/main.js before receiving enquiries.");
  });
}

const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");
const siteMenu = document.getElementById("siteMenu");

menuToggle.addEventListener("click", () => {
  const open = siteMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
siteMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => siteMenu.classList.remove("open"));
});
document.addEventListener("click", (event) => {
  if (!siteMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    siteMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

document.querySelectorAll("[data-room]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.room) document.getElementById("roomSelect").value = btn.dataset.room;
  });
});

document.getElementById("leadForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!hasWhatsappNumber()) {
    toast("Add your WhatsApp number in js/main.js before receiving enquiries.");
    return;
  }
  const data = Object.fromEntries(new FormData(event.target));
  const message = [
    intro,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Looking for: ${data.audience}`,
    `Room: ${data.room}`,
    data.work ? `Work/College: ${data.work}` : "",
    data.date ? `Move-in: ${data.date}` : "",
    data.message ? `Message: ${data.message}` : ""
  ]
    .filter(Boolean)
    .join("\n");
  window.open(waLink(message), "_blank", "noopener");
});

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCaption = document.getElementById("lbCaption");
const closeLightbox = () => {
  lightbox.hidden = true;
  lbImage.src = "";
};

document.querySelectorAll(".room-open").forEach((btn) => {
  btn.addEventListener("click", () => {
    lbImage.src = btn.dataset.src;
    lbImage.alt = btn.querySelector("img").alt;
    lbCaption.textContent = btn.dataset.caption;
    lightbox.hidden = false;
    document.getElementById("lbClose").focus();
  });
});
document.getElementById("lbClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    siteMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (!lightbox.hidden) closeLightbox();
  }
});

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll("[data-nav]")];
const revealItems = [...document.querySelectorAll(".reveal")];
if (reduce) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
}
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px" });
sections.forEach((section) => spy.observe(section));

const tilt = document.querySelector("[data-tilt]");
if (tilt && window.matchMedia("(pointer:fine)").matches && !reduce) {
  tilt.addEventListener("mousemove", (event) => {
    const r = tilt.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -9}deg)`;
  });
  tilt.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateY(0) rotateX(0)";
  });
}

if (!reduce) {
  document.addEventListener("mousemove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    document.querySelectorAll("[data-depth]").forEach((node) => {
      const d = Number(node.dataset.depth) || 10;
      node.style.translate = `${x * d}px ${y * d}px`;
    });
  });
}

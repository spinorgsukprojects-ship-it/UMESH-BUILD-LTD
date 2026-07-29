const SITE = {
  phone: "07502 223489",
  phoneHref: "tel:+447502223489",
  whatsapp: "https://wa.me/447502223489?text=Hello%20UMESH%20BUILD%20LTD%2C%20I%20would%20like%20to%20discuss%20a%20construction%20project.",
  email: "umeshchandrayathagiri921@gmail.com"
};

const header = document.querySelector(".site-header");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

function onScroll() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;
document.querySelectorAll(".reveal").forEach((el) => {
  if (revealObserver) revealObserver.observe(el);
  else el.classList.add("visible");
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("[data-project-category]").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.projectCategory !== filter;
    });
  });
});

const cookie = document.querySelector("[data-cookie]");
if (cookie && localStorage.getItem("umesh-cookie-choice") === null) cookie.classList.add("show");
document.querySelectorAll("[data-cookie-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem("umesh-cookie-choice", button.dataset.cookieChoice);
    cookie?.classList.remove("show");
  });
});

document.querySelectorAll("[data-quote-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const wrapper = field.closest(".field") || field.closest(".consent");
      const fieldValid = field.type === "checkbox" ? field.checked : Boolean(field.value.trim());
      wrapper?.classList.toggle("invalid", !fieldValid);
      if (!fieldValid) valid = false;
    });

    const upload = form.querySelector('input[type="file"]');
    if (upload?.files?.length) {
      const allowed = ["image/jpeg", "image/png", "application/pdf"];
      const oversized = [...upload.files].some((file) => file.size > 8 * 1024 * 1024 || !allowed.includes(file.type));
      if (oversized) {
        upload.closest(".field")?.classList.add("invalid");
        valid = false;
      }
    }

    const trap = form.querySelector('[name="company_website"]');
    const lastSubmit = Number(localStorage.getItem("umesh-form-submit") || 0);
    if (trap?.value || Date.now() - lastSubmit < 30000) valid = false;
    if (!valid) {
      if (status) status.textContent = "Please check the highlighted fields and try again.";
      return;
    }

    localStorage.setItem("umesh-form-submit", String(Date.now()));
    if (status) status.textContent = "Sending your enquiry...";

    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      try {
        const response = await fetch(endpoint, { method: "POST", body: new FormData(form) });
        if (!response.ok) throw new Error("Form submission failed");
      } catch {
        if (status) status.textContent = "We could not send the form online. Please call, WhatsApp, or email UMESH BUILD LTD.";
        return;
      }
    }

    form.reset();
    if (status) status.textContent = "Thank you for contacting UMESH BUILD LTD. We have received your enquiry and will contact you shortly.";
  });
});

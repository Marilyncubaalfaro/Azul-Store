const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const newsletter = document.querySelector(".newsletter");
const message = document.querySelector(".form-message");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.querySelectorAll("a").forEach((link) => link.classList.remove("active"));
    event.target.classList.add("active");
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

newsletter.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletter.querySelector("input").value.trim();
  message.textContent = email ? "Gracias por suscribirte a Azul Store." : "";
  newsletter.reset();
});

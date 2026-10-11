const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.textContent = isOpen ? "×" : "☰";
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  }));
}
const newsletterForm = document.querySelector("#newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.querySelector("#form-note");
    note.textContent = "Thank you — newsletter signup will be connected when the backend is built.";
    newsletterForm.reset();
  });
}
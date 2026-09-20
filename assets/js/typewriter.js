(() => {
  const target = document.querySelector("[data-typewriter]");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const text = target.textContent.trim();
  let index = 0;
  target.textContent = "";
  target.classList.add("is-typing");

  const type = () => {
    index += 1;
    target.textContent = text.slice(0, index);
    if (index < text.length) {
      window.setTimeout(type, 90);
    } else {
      window.setTimeout(() => target.classList.remove("is-typing"), 700);
    }
  };

  window.setTimeout(type, 220);
})();

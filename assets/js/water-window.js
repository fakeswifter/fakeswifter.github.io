(function () {
  const stage = document.querySelector("#window");
  const home = document.querySelector("#homepage");
  const siteChrome = Array.from(document.querySelectorAll(".site-header, .site-footer"));
  const body = document.body;
  if (!stage || !home) return;

  let isOpen = false;

  function setHidden(element, hidden) {
    element.setAttribute("aria-hidden", hidden ? "true" : "false");
    element.inert = hidden;
  }

  function enterHomepage() {
    if (isOpen) return;
    isOpen = true;

    stage.classList.add("is-open");
    body.classList.remove("is-closed");
    body.classList.add("is-open");
    setHidden(stage, true);
    setHidden(home, false);
    siteChrome.forEach(function (element) { setHidden(element, false); });

    window.setTimeout(function () {
      const heading = document.querySelector("#hero-title");
      if (heading) heading.focus({ preventScroll: true });
    }, 650);
  }

  body.classList.add("is-closed");
  setHidden(stage, false);
  setHidden(home, true);
  siteChrome.forEach(function (element) { setHidden(element, true); });

  stage.addEventListener("click", function (event) {
    if (event.target.closest("a, button, input")) return;
    enterHomepage();
  });

  stage.addEventListener("keydown", function (event) {
    if (event.target.closest("a, button, input")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enterHomepage();
    }
  });
})();

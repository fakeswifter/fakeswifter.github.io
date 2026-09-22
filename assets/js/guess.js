(() => {
  const form = document.querySelector(".guess-form");
  if (!form) return;

  const inputs = [...form.querySelectorAll("[data-answer]")];
  const progress = document.querySelector(".guess-progress");
  const result = document.querySelector(".guess-result");

  const update = () => {
    let solved = 0;

    inputs.forEach((input) => {
      const answer = input.dataset.answer;
      const letter = input.dataset.letter;
      const cell = document.querySelector(`[data-cell="${letter}"]`);
      const correct = input.value.trim().toLowerCase() === answer;

      input.classList.toggle("is-correct", correct);
      cell.classList.toggle("is-revealed", correct);
      cell.textContent = correct ? letter.toUpperCase() : "·";
      cell.setAttribute("aria-label", correct ? `字母 ${letter.toUpperCase()}` : "未解开的字母");
      if (correct) solved += 1;
    });

    progress.textContent = `${solved} / ${inputs.length}`;
    result.hidden = solved !== inputs.length;
  };

  form.addEventListener("input", update);
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("reset", () => window.setTimeout(update, 0));
})();

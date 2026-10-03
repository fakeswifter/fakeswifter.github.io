(() => {
  const grid = document.querySelector("[data-crossword]");
  const form = document.querySelector(".crossword-form");
  if (!grid || !form) return;

  const rows = 8;
  const columns = 11;
  const entries = [
    { id: "galaxy", number: 1, answer: "GALAXY", row: 0, column: 6, direction: "down", meta: "g" },
    { id: "yellow", number: 2, answer: "YELLOW", row: 1, column: 1, direction: "down", meta: "y" },
    { id: "aurora", number: 3, answer: "AURORA", row: 1, column: 3, direction: "down", meta: "a" },
    { id: "nature", number: 4, answer: "NATURE", row: 1, column: 5, direction: "across", meta: "n" },
    { id: "harbor", number: 5, answer: "HARBOR", row: 3, column: 5, direction: "across", meta: "h" },
    { id: "ocean", number: 6, answer: "OCEAN", row: 3, column: 9, direction: "down", meta: "o" },
    { id: "journey", number: 7, answer: "JOURNEY", row: 5, column: 0, direction: "across", meta: "j" },
    { id: "island", number: 8, answer: "ISLAND", row: 7, column: 5, direction: "across", meta: "i" },
  ];

  const cells = new Map();
  const inputs = new Map();
  let activeEntry = entries[0];

  const keyFor = (row, column) => `${row}-${column}`;
  const positionsFor = (entry) =>
    [...entry.answer].map((letter, index) => ({
      key: keyFor(
        entry.row + (entry.direction === "down" ? index : 0),
        entry.column + (entry.direction === "across" ? index : 0)
      ),
      letter,
    }));

  entries.forEach((entry) => {
    positionsFor(entry).forEach(({ key, letter }) => {
      const cell = cells.get(key) || { letter, entries: [], number: null };
      if (cell.letter !== letter) throw new Error(`Crossword conflict at ${key}`);
      cell.entries.push(entry.id);
      if (key === keyFor(entry.row, entry.column)) cell.number = entry.number;
      cells.set(key, cell);
    });
  });

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const key = keyFor(row, column);
      const data = cells.get(key);
      if (!data) {
        const block = document.createElement("span");
        block.className = "crossword-block";
        block.setAttribute("aria-hidden", "true");
        grid.append(block);
        continue;
      }

      const cell = document.createElement("label");
      cell.className = "crossword-cell";
      cell.dataset.key = key;
      cell.dataset.entries = data.entries.join(" ");

      if (data.number) {
        const number = document.createElement("span");
        number.className = "crossword-number";
        number.textContent = data.number;
        cell.append(number);
      }

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.inputMode = "text";
      input.autocapitalize = "characters";
      input.spellcheck = false;
      input.dataset.key = key;
      input.setAttribute("aria-label", `第 ${row + 1} 行，第 ${column + 1} 列`);
      cell.append(input);
      grid.append(cell);
      inputs.set(key, input);
    }
  }

  const entryById = (id) => entries.find((entry) => entry.id === id);
  const includesKey = (entry, key) => positionsFor(entry).some((position) => position.key === key);

  const selectEntry = (entry, focus = true) => {
    activeEntry = entry;
    document.querySelectorAll("[data-entry]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.entry === entry.id);
    });
    document.querySelectorAll(".crossword-cell").forEach((cell) => {
      cell.classList.toggle("is-active", includesKey(entry, cell.dataset.key));
    });
    if (focus) inputs.get(positionsFor(entry)[0].key)?.focus();
  };

  const selectEntryForCell = (key, cycle = false) => {
    const ids = cells.get(key).entries;
    let id = ids[0];
    if (cycle && ids.length > 1 && ids.includes(activeEntry.id)) {
      id = ids[(ids.indexOf(activeEntry.id) + 1) % ids.length];
    } else if (ids.includes(activeEntry.id)) {
      id = activeEntry.id;
    }
    selectEntry(entryById(id), false);
  };

  const moveWithinEntry = (key, step) => {
    const positions = positionsFor(activeEntry);
    const index = positions.findIndex((position) => position.key === key);
    const next = positions[index + step];
    if (next) inputs.get(next.key)?.focus();
  };

  const moveByArrow = (key, keyName) => {
    const [row, column] = key.split("-").map(Number);
    const delta = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    }[keyName];
    const target = inputs.get(keyFor(row + delta[0], column + delta[1]));
    if (target) target.focus();
  };

  const update = () => {
    let solved = 0;

    entries.forEach((entry) => {
      const answer = positionsFor(entry)
        .map((position) => inputs.get(position.key).value)
        .join("");
      const correct = answer === entry.answer;
      const clue = document.querySelector(`[data-entry="${entry.id}"]`);
      const metaCell = document.querySelector(`[data-cell="${entry.meta}"]`);

      clue?.classList.toggle("is-solved", correct);
      metaCell?.classList.toggle("is-revealed", correct);
      if (metaCell) {
        metaCell.textContent = correct ? entry.meta.toUpperCase() : "·";
        metaCell.setAttribute("aria-label", correct ? `字母 ${entry.meta.toUpperCase()}` : "未解开的字母");
      }
      if (correct) solved += 1;
    });

    document.querySelector(".guess-progress").textContent = `${solved} / ${entries.length}`;
    document.querySelector(".guess-result").hidden = solved !== entries.length;
    grid.classList.toggle("is-complete", solved === entries.length);
  };

  document.querySelectorAll("[data-entry]").forEach((button) => {
    button.addEventListener("click", () => selectEntry(entryById(button.dataset.entry)));
  });

  inputs.forEach((input, key) => {
    input.addEventListener("focus", () => selectEntryForCell(key));
    input.addEventListener("click", () => selectEntryForCell(key, true));
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^a-z]/gi, "").slice(-1).toUpperCase();
      update();
      if (input.value) moveWithinEntry(key, 1);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value) {
        event.preventDefault();
        moveWithinEntry(key, -1);
      }
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        moveByArrow(key, event.key);
      }
      if (event.key === " " && cells.get(key).entries.length > 1) {
        event.preventDefault();
        selectEntryForCell(key, true);
      }
    });
  });

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("reset", () => window.setTimeout(update, 0));
  selectEntry(activeEntry, false);
  update();
})();

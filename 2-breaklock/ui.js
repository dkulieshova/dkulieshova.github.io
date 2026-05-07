export function createUI() {
  const board = document.getElementById("board");
  const pathLayer = document.getElementById("pathLayer");
  const feedback = document.getElementById("feedback");
  const history = document.getElementById("history");

  function renderHistory(items) {
    history.replaceChildren();

    items.forEach((entry) => {
      const line = document.createElement("li");

      const chain = document.createElement("div");
      chain.className = "history-chain";
      chain.setAttribute(
        "aria-label",
        `Результат: ${entry.correctPosition} на правильному місці, ${entry.correctWrongPlace} на неправильному місці.`,
      );

      const cells = entry.cellStatuses ?? [];

      for (let i = 0; i < cells.length; i += 1) {
        const status = cells[i];
        if (status !== "exact" && status !== "misplaced") {
          continue;
        }

        const dot = document.createElement("span");
        dot.className = "history-dot";

        if (status === "exact") {
          dot.classList.add("exact");
        } else if (status === "misplaced") {
          dot.classList.add("misplaced");
        }

        chain.appendChild(dot);
      }

      line.appendChild(chain);
      history.appendChild(line);
    });
  }

  function setFeedback(message, tone = "") {
    feedback.textContent = message;
    feedback.classList.remove("success", "error");
    if (tone) {
      feedback.classList.add(tone);
    }
  }

  return {
    nodes: {
      board,
      pathLayer,
    },
    renderHistory,
    setFeedback,
  };
}


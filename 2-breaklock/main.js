import { createGrid } from "./grid.js";
import { bindPatternInput } from "./input.js";
import { createGame } from "./game.js";
import { createUI } from "./ui.js";

const ui = createUI();
const game = createGame();

let currentPattern = [];
let grid = null;
let pointerPreview = null;
let unbindInput = null;
let isErrorPath = false;
let wrongResetTimer = null;

function syncPatternView() {
  grid.setActivePath(currentPattern);
  grid.drawPath(currentPattern, pointerPreview, { isError: isErrorPath });
}

function resetCurrentPattern() {
  if (wrongResetTimer) {
    clearTimeout(wrongResetTimer);
    wrongResetTimer = null;
  }
  currentPattern = [];
  pointerPreview = null;
  isErrorPath = false;
  grid.setActivePath([]);
  grid.setHoverPoint(null);
  grid.drawPath([], null, { isError: false });
  syncPatternView();
}

function updateFromState(message = "Проведи по точках і відпусти, щоб перевірити код.", tone = "") {
  const state = game.getPublicState();
  ui.renderHistory(state.history);
  if (state.finished) {
    ui.setFeedback("Усі набори завершено.", "success");
    return;
  }
  const prefix = `Набір ${state.currentSetNumber}/${state.totalSets}.`;
  ui.setFeedback(`${prefix} ${message}`, tone);
}

function submitCurrentPatternOnRelease() {
  const state = game.getPublicState();
  if (state.finished || currentPattern.length === 0) {
    return;
  }

  if (currentPattern.length !== state.targetLength) {
    ui.setFeedback(`Неповний код: ${currentPattern.length}/${state.targetLength}.`, "error");
    resetCurrentPattern();
    return;
  }

  const result = game.submitGuess(currentPattern);
  if (!result) {
    return;
  }

  const message = `Зворотний зв'язок: ${result.correctPosition} на правильному місці, ${result.correctWrongPlace} на неправильному.`;
  const stateAfterSubmit = game.getPublicState();

  if (result.completedCampaign) {
    resetCurrentPattern();
    updateFromState("Останній набір правильний. Перенаправлення...", "success");
    if (stateAfterSubmit.finalRedirectUrl) {
      setTimeout(() => {
        window.location.href = stateAfterSubmit.finalRedirectUrl;
      }, 450);
    }
    return;
  }

  if (result.advancedToNextSet) {
    resetCurrentPattern();
    updateFromState(`Набір ${result.setNumber} успішний. Переходимо далі.`, "success");
    return;
  }

  isErrorPath = true;
  syncPatternView();
  updateFromState(message, "error");

  wrongResetTimer = setTimeout(() => {
    wrongResetTimer = null;
    resetCurrentPattern();
  }, 420);
}

function handlePointAdd(pointId) {
  const state = game.getPublicState();
  if (state.finished) {
    return;
  }
  if (currentPattern.includes(pointId)) {
    return;
  }
  if (currentPattern.length >= state.targetLength) {
    return;
  }
  currentPattern.push(pointId);
  syncPatternView();
}

function setupGrid() {
  const state = game.getPublicState();
  grid = createGrid(ui.nodes.board, ui.nodes.pathLayer, state.gridSize);

  if (unbindInput) {
    unbindInput();
  }

  unbindInput = bindPatternInput(ui.nodes.board, {
    isInputLocked: () => game.getPublicState().finished || Boolean(wrongResetTimer),
    getPointId: (x, y) => grid.getPointIdFromClientPosition(x, y),
    onStart: ({ x, y }) => {
      pointerPreview = { x, y };
      isErrorPath = false;
      grid.setHoverPoint(grid.getPointIdFromClientPosition(x, y));
      syncPatternView();
    },
    onPoint: (pointId) => {
      handlePointAdd(pointId);
    },
    onMove: (pos) => {
      pointerPreview = pos;
      const hoveredPoint = pos ? grid.getPointIdFromClientPosition(pos.x, pos.y) : null;
      grid.setHoverPoint(hoveredPoint);
      syncPatternView();
    },
    onEnd: () => {
      pointerPreview = null;
      grid.setHoverPoint(null);
      syncPatternView();
      submitCurrentPatternOnRelease();
    },
  });
}

function startGame() {
  game.reset();
  setupGrid();
  resetCurrentPattern();
  updateFromState("Проведи по точках і відпусти, щоб перевірити код.");
}

window.addEventListener("resize", () => {
  syncPatternView();
});

startGame();


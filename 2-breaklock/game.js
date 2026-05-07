import { LOCK_GAME_CONFIG } from "./lock-config.js";

export function evaluateGuess(guess, solution) {
  const guessCopy = [...guess];
  const solutionCopy = [...solution];
  let correctPosition = 0;
  let correctWrongPlace = 0;
  const cellStatuses = Array.from({ length: guess.length }, () => "empty");

  for (let i = 0; i < guessCopy.length; i += 1) {
    if (guessCopy[i] === solutionCopy[i]) {
      correctPosition += 1;
      guessCopy[i] = null;
      solutionCopy[i] = null;
      cellStatuses[i] = "exact";
    }
  }

  for (let i = 0; i < guessCopy.length; i += 1) {
    const value = guessCopy[i];
    if (value === null) {
      continue;
    }
    const foundAt = solutionCopy.indexOf(value);
    if (foundAt !== -1) {
      correctWrongPlace += 1;
      solutionCopy[foundAt] = null;
      guessCopy[i] = null;
      cellStatuses[i] = "misplaced";
    }
  }

  return { correctPosition, correctWrongPlace, cellStatuses };
}

export function createGame(config = LOCK_GAME_CONFIG) {
  let currentSetIndex = 0;
  let history = [];
  let finished = false;

  function reset() {
    currentSetIndex = 0;
    history = [];
    finished = false;
  }

  function getCurrentSolution() {
    return config.sets[currentSetIndex] ?? null;
  }

  function submitGuess(guess) {
    if (finished) {
      return null;
    }

    const solution = getCurrentSolution();
    if (!solution) {
      return null;
    }

    const feedback = evaluateGuess(guess, solution);

    const entry = {
      guess: [...guess],
      correctPosition: feedback.correctPosition,
      correctWrongPlace: feedback.correctWrongPlace,
      cellStatuses: feedback.cellStatuses,
      setNumber: currentSetIndex + 1,
    };

    history = [entry, ...history];

    const wonSet = feedback.correctPosition === config.targetLength;
    let advancedToNextSet = false;
    let completedCampaign = false;

    if (wonSet) {
      if (currentSetIndex < config.sets.length - 1) {
        currentSetIndex += 1;
        advancedToNextSet = true;
        history = [];
      } else {
        finished = true;
        completedCampaign = true;
      }
    }

    return {
      ...entry,
      wonSet,
      advancedToNextSet,
      completedCampaign,
      nextSetNumber: currentSetIndex + 1,
    };
  }

  function getPublicState() {
    return {
      targetLength: config.targetLength,
      gridSize: config.gridSize,
      currentSetNumber: currentSetIndex + 1,
      totalSets: config.sets.length,
      history: [...history],
      finished,
      finalRedirectUrl: config.finalRedirectUrl,
    };
  }

  function getSolutionForReveal() {
    const solution = getCurrentSolution();
    return solution ? [...solution] : [];
  }

  return {
    reset,
    submitGuess,
    getPublicState,
    getSolutionForReveal,
  };
}


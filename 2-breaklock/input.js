export function bindPatternInput(board, handlers) {
  let pointerActive = false;

  const onPointerDown = (event) => {
    if (typeof handlers.isInputLocked === "function" && handlers.isInputLocked()) {
      return;
    }

    const pointId = handlers.getPointId(event.clientX, event.clientY);
    if (!pointId) {
      return;
    }

    pointerActive = true;
    board.setPointerCapture?.(event.pointerId);
    handlers.onStart?.({ x: event.clientX, y: event.clientY });
    handlers.onPoint?.(pointId);
    handlers.onMove?.({ x: event.clientX, y: event.clientY });
  };

  const onPointerMove = (event) => {
    if (!pointerActive) {
      return;
    }

    handlers.onMove?.({ x: event.clientX, y: event.clientY });
    const pointId = handlers.getPointId(event.clientX, event.clientY);
    if (pointId) {
      handlers.onPoint?.(pointId);
    }
  };

  const finish = () => {
    if (!pointerActive) {
      return;
    }
    pointerActive = false;
    handlers.onEnd?.();
  };

  board.addEventListener("pointerdown", onPointerDown);
  board.addEventListener("pointermove", onPointerMove);
  board.addEventListener("pointerup", finish);
  board.addEventListener("pointercancel", finish);
  board.addEventListener("pointerleave", () => {
    handlers.onMove?.(null);
  });

  return () => {
    board.removeEventListener("pointerdown", onPointerDown);
    board.removeEventListener("pointermove", onPointerMove);
    board.removeEventListener("pointerup", finish);
    board.removeEventListener("pointercancel", finish);
  };
}


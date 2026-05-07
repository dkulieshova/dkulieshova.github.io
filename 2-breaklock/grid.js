function createSvgLine(x1, y1, x2, y2, isError = false) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", String(x1));
  line.setAttribute("y1", String(y1));
  line.setAttribute("x2", String(x2));
  line.setAttribute("y2", String(y2));
  line.setAttribute("class", isError ? "path-line error" : "path-line");
  return line;
}

export function createGrid(container, svgLayer, size = 3) {
  const points = [];
  const total = size * size;

  container.querySelectorAll(".dot").forEach((n) => n.remove());
  svgLayer.replaceChildren();

  for (let index = 0; index < total; index += 1) {
    const id = index + 1;
    const row = Math.floor(index / size);
    const col = index % size;
    const xPct = ((col + 1) / (size + 1)) * 100;
    const yPct = ((row + 1) / (size + 1)) * 100;

    const point = document.createElement("button");
    point.type = "button";
    point.className = "dot";
    point.dataset.id = String(id);
    point.style.left = `${xPct}%`;
    point.style.top = `${yPct}%`;
    point.setAttribute("aria-label", `Точка ${id}`);

    container.appendChild(point);
    points.push(point);
  }

  function getPointCenterById(id) {
    const el = points.find((p) => Number(p.dataset.id) === id);
    if (!el) {
      return null;
    }
    const boardRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      x: ((rect.left + rect.width / 2 - boardRect.left) / boardRect.width) * 100,
      y: ((rect.top + rect.height / 2 - boardRect.top) / boardRect.height) * 100,
    };
  }

  function getPointIdFromClientPosition(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY);
    const dot = target?.closest?.(".dot");
    return dot ? Number(dot.dataset.id) : null;
  }

  function setActivePath(path) {
    const set = new Set(path);
    points.forEach((point) => {
      point.classList.toggle("active", set.has(Number(point.dataset.id)));
    });
  }

  function setHoverPoint(pointId) {
    points.forEach((point) => {
      point.classList.toggle("hover", Number(point.dataset.id) === pointId);
    });
  }

  function drawPath(path, pointer, options = {}) {
    const { isError = false } = options;
    svgLayer.replaceChildren();
    const centers = path.map(getPointCenterById).filter(Boolean);

    for (let i = 0; i < centers.length - 1; i += 1) {
      const from = centers[i];
      const to = centers[i + 1];
      svgLayer.appendChild(createSvgLine(from.x, from.y, to.x, to.y, isError));
    }

    if (pointer && centers.length > 0) {
      const boardRect = container.getBoundingClientRect();
      const x = ((pointer.x - boardRect.left) / boardRect.width) * 100;
      const y = ((pointer.y - boardRect.top) / boardRect.height) * 100;
      const last = centers[centers.length - 1];
      svgLayer.appendChild(createSvgLine(last.x, last.y, x, y, isError));
    }
  }

  return {
    size,
    points,
    getPointIdFromClientPosition,
    setActivePath,
    setHoverPoint,
    drawPath,
  };
}


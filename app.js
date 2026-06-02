const points = [
  {
    title: "什麼是平行線",
    tag: "概念建立",
    type: "definition",
    idea: "兩條線方向相同、距離固定，延長也不相交。",
    action: "調整距離，觀察兩線是否始終保持同樣間隔。",
    key: "同一平面、不相交、距離固定",
    question: "只看起來不相交，能不能直接說它們平行？",
    brief: "看見距離固定"
  },
  {
    title: "截線切出八個角",
    tag: "命名工具",
    type: "eightAngles",
    idea: "一條截線切過兩條直線，會在兩個交點附近產生八個角。",
    action: "調整截線角度，讓八個角一起改變。",
    key: "截線、內角、外角、角 1 到角 8",
    question: "哪些角在兩條線中間？哪些角在線的外側？",
    brief: "先會找角"
  },
  {
    title: "同位角相等",
    tag: "平行性質 1",
    type: "corresponding",
    idea: "平行線被截線所截，同位角位置相同，角度相等。",
    action: "改變截線角度，觀察同位角永遠同步。",
    key: "同位角相等",
    question: "為什麼角 1 改變時，角 5 也跟著一樣變？",
    brief: "相同位置相等"
  },
  {
    title: "內錯角相等",
    tag: "平行性質 2",
    type: "alternate",
    idea: "兩條平行線中間、截線兩側的內錯角會相等。",
    action: "觀察被標出的 Z 字形，追蹤兩個內錯角。",
    key: "內錯角相等、Z 字形",
    question: "你能在圖上指出另一組內錯角嗎？",
    brief: "Z 字形相等"
  },
  {
    title: "同側內角互補",
    tag: "平行性質 3",
    type: "sameSide",
    idea: "兩條平行線中間、截線同一側的兩角相加是 180°。",
    action: "拖動截線角度，觀察兩角一大一小但總和固定。",
    key: "同側內角互補、和為 180°",
    question: "一個角變大時，另一個角為什麼一定變小？",
    brief: "同側內角合成平角"
  },
  {
    title: "反過來判斷平行",
    tag: "平行判別",
    type: "converse",
    idea: "如果同位角相等、內錯角相等，或同側內角互補，就能判斷兩線平行。",
    action: "關閉保持平行，再調整角度，觀察判別條件何時失效。",
    key: "性質反用、判別平行",
    question: "當角度條件不成立，兩條線還一定平行嗎？",
    brief: "從角度反推平行"
  },
  {
    title: "求未知角",
    tag: "解題應用",
    type: "solve",
    idea: "先找平行線，再選對角度關係，就能把已知角搬到未知角。",
    action: "用高亮路徑看角度如何被搬移與補角。",
    key: "先標平行、再找同位角或內錯角",
    question: "這題應該用相等，還是用互補？",
    brief: "把角度搬到目標"
  },
  {
    title: "平行推理地圖",
    tag: "總整理",
    type: "map",
    idea: "看到平行線與截線，就先問：同位、內錯、同側內角是哪一組？",
    action: "快速切換重點，整理成課堂口訣。",
    key: "同位相等、內錯相等、同側互補",
    question: "你能用一句話說明 4-1 平行的核心嗎？",
    brief: "三句話收束"
  }
];

let currentIndex = 0;

const els = {
  lessonList: document.getElementById("lessonList"),
  stageKicker: document.getElementById("stageKicker"),
  stageTitle: document.getElementById("stageTitle"),
  pointIndex: document.getElementById("pointIndex"),
  pointTotal: document.getElementById("pointTotal"),
  bigIdea: document.getElementById("bigIdea"),
  actionText: document.getElementById("actionText"),
  keyText: document.getElementById("keyText"),
  questionText: document.getElementById("questionText"),
  angleSlider: document.getElementById("angleSlider"),
  angleValue: document.getElementById("angleValue"),
  gapSlider: document.getElementById("gapSlider"),
  gapValue: document.getElementById("gapValue"),
  parallelToggle: document.getElementById("parallelToggle"),
  visualSvg: document.getElementById("visualSvg"),
  dropZone: document.getElementById("dropZone"),
  progressDots: document.getElementById("progressDots"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn")
};

function init() {
  els.pointTotal.textContent = String(points.length).padStart(2, "0");
  renderCards();
  renderDots();
  bindEvents();
  setPoint(0);
}

function bindEvents() {
  els.prevBtn.addEventListener("click", () => setPoint(Math.max(0, currentIndex - 1)));
  els.nextBtn.addEventListener("click", () => setPoint(Math.min(points.length - 1, currentIndex + 1)));
  [els.angleSlider, els.gapSlider, els.parallelToggle].forEach((control) => {
    control.addEventListener("input", drawCurrent);
    control.addEventListener("change", drawCurrent);
  });

  els.dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.dropZone.classList.add("drag-over");
  });
  els.dropZone.addEventListener("dragleave", () => els.dropZone.classList.remove("drag-over"));
  els.dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    els.dropZone.classList.remove("drag-over");
    const idx = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(idx)) setPoint(idx);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") els.nextBtn.click();
    if (event.key === "ArrowLeft") els.prevBtn.click();
  });
}

function renderCards() {
  els.lessonList.innerHTML = points.map((point, idx) => `
    <article class="lesson-card" draggable="true" data-index="${idx}">
      <div class="lesson-chip">${idx + 1}</div>
      <div>
        <span>${point.tag}</span>
        <h3>${point.title}</h3>
        <p>${point.brief}</p>
      </div>
    </article>
  `).join("");

  els.lessonList.querySelectorAll(".lesson-card").forEach((card) => {
    card.addEventListener("click", () => setPoint(Number(card.dataset.index)));
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.index);
    });
  });
}

function renderDots() {
  els.progressDots.innerHTML = points.map((_, idx) => (
    `<button class="dot" data-index="${idx}" aria-label="前往重點 ${idx + 1}"></button>`
  )).join("");
  els.progressDots.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => setPoint(Number(dot.dataset.index)));
  });
}

function setPoint(idx) {
  currentIndex = idx;
  const point = points[idx];
  els.stageKicker.textContent = `重點 ${idx + 1}｜${point.tag}`;
  els.stageTitle.textContent = point.title;
  els.pointIndex.textContent = String(idx + 1).padStart(2, "0");
  els.bigIdea.textContent = point.idea;
  els.actionText.textContent = point.action;
  els.keyText.textContent = point.key;
  els.questionText.textContent = point.question;
  els.prevBtn.disabled = idx === 0;
  els.nextBtn.disabled = idx === points.length - 1;

  document.querySelectorAll(".lesson-card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.index) === idx);
  });
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.classList.toggle("active", Number(dot.dataset.index) === idx);
  });

  drawCurrent();
}

function drawCurrent() {
  els.angleValue.textContent = `${els.angleSlider.value}°`;
  els.gapValue.textContent = els.gapSlider.value;
  const point = points[currentIndex];
  const state = getState();
  els.visualSvg.innerHTML = defs();
  const drawer = {
    definition: drawDefinition,
    eightAngles: drawEightAngles,
    corresponding: drawCorresponding,
    alternate: drawAlternate,
    sameSide: drawSameSide,
    converse: drawConverse,
    solve: drawSolve,
    map: drawMap
  }[point.type];
  drawer(state);
}

function getState() {
  const angle = Number(els.angleSlider.value);
  const gap = Number(els.gapSlider.value);
  const keepParallel = els.parallelToggle.checked;
  const topY = 230 - gap / 2;
  const bottomY = 230 + gap / 2;
  const tilt = keepParallel ? 0 : 16;
  return { angle, gap, keepParallel, topY, bottomY, tilt };
}

function defs() {
  return `
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#2563eb"></path>
      </marker>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#172033" flood-opacity="0.14"/>
      </filter>
    </defs>
  `;
}

function line(x1, y1, x2, y2, cls = "line-main") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"></line>`;
}

function label(x, y, content, cls = "svg-label") {
  return `<text x="${x}" y="${y}" class="${cls}">${content}</text>`;
}

function pill(x, y, content, color = "#2563eb") {
  return `<rect x="${x}" y="${y}" width="150" height="42" rx="8" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="2"></rect>${label(x + 18, y + 27, content)}`;
}

function baseParallel(state, options = {}) {
  const topEnd = state.keepParallel ? 810 : 810;
  const bottomEndY = state.bottomY + state.tilt;
  const top = line(90, state.topY, topEnd, state.topY, "parallel-line");
  const bottom = line(90, state.bottomY, 810, bottomEndY, state.keepParallel ? "parallel-line" : "warning-line");
  const rad = state.angle * Math.PI / 180;
  const cx = 455;
  const x1 = cx - Math.cos(rad) * 245;
  const y1 = state.topY - Math.sin(rad) * 245;
  const x2 = cx + Math.cos(rad) * 245;
  const y2 = state.bottomY + Math.sin(rad) * 245;
  const transversal = line(x1, y1, x2, y2, "transversal-line");
  const badge = state.keepParallel
    ? pill(690, 54, "兩線保持平行", "#079669")
    : pill(690, 54, "下方線已偏斜", "#df3454");
  return `${top}${bottom}${transversal}${badge}${label(110, state.topY - 14, "l", "svg-note")}${label(110, state.bottomY + 28, "m", "svg-note")}${label(x2 - 22, y2 + 32, "截線 t", "svg-note")}`;
}

function intersectionPoints(state) {
  const rad = state.angle * Math.PI / 180;
  const cx = 455;
  const top = { x: cx, y: state.topY };
  const bottom = { x: cx + (state.bottomY - state.topY) / Math.tan(rad), y: state.bottomY };
  return { top, bottom };
}

function arc(cx, cy, r, start, end, color, textValue, tx, ty) {
  const startRad = start * Math.PI / 180;
  const endRad = end * Math.PI / 180;
  const large = Math.abs(end - start) > 180 ? 1 : 0;
  const sweep = end > start ? 1 : 0;
  const x1 = cx + Math.cos(startRad) * r;
  const y1 = cy + Math.sin(startRad) * r;
  const x2 = cx + Math.cos(endRad) * r;
  const y2 = cy + Math.sin(endRad) * r;
  return `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}" class="angle-arc" stroke="${color}"></path>${label(tx, ty, textValue, "angle-label")}`;
}

function drawDefinition(state) {
  els.visualSvg.innerHTML += `
    ${label(70, 62, "平行線：同一平面內，兩條直線不相交", "svg-title")}
    ${label(70, 96, "拖動「平行距離」：不管距離變大或變小，只要方向相同，延長後仍不相交。", "svg-note")}
    ${baseParallel(state)}
    ${line(160, state.topY, 160, state.bottomY, "measure-line")}
    ${line(710, state.topY, 710, state.keepParallel ? state.bottomY : state.bottomY + state.tilt * 0.86, "measure-line")}
    ${label(176, (state.topY + state.bottomY) / 2, "距離固定", "svg-label")}
    ${state.keepParallel ? label(334, 438, "延長、再延長，仍然不會相交", "result-good") : label(318, 438, "距離開始改變，不能直接判定平行", "result-bad")}
  `;
}

function drawEightAngles(state) {
  const p = intersectionPoints(state);
  els.visualSvg.innerHTML += `
    ${label(70, 62, "截線與八個角：先把位置看清楚", "svg-title")}
    ${label(70, 96, "上交點 1-4，下交點 5-8；兩線中間的是內角，外側的是外角。", "svg-note")}
    ${baseParallel(state)}
    ${numberAngles(p.top.x, p.top.y, 1)}
    ${numberAngles(p.bottom.x, p.bottom.y, 5)}
    ${pill(90, 438, "外角：1、2、7、8", "#7c3aed")}
    ${pill(272, 438, "內角：3、4、5、6", "#d88600")}
  `;
}

function numberAngles(x, y, start) {
  return `
    <circle cx="${x - 48}" cy="${y - 38}" r="19" class="num-circle"></circle>${label(x - 54, y - 31, start, "num-text")}
    <circle cx="${x + 36}" cy="${y - 42}" r="19" class="num-circle"></circle>${label(x + 30, y - 35, start + 1, "num-text")}
    <circle cx="${x + 42}" cy="${y + 39}" r="19" class="num-circle"></circle>${label(x + 36, y + 46, start + 2, "num-text")}
    <circle cx="${x - 43}" cy="${y + 42}" r="19" class="num-circle"></circle>${label(x - 49, y + 49, start + 3, "num-text")}
  `;
}

function drawCorresponding(state) {
  const p = intersectionPoints(state);
  const a = state.angle;
  els.visualSvg.innerHTML += `
    ${label(70, 62, "同位角：站在相同位置的角", "svg-title")}
    ${label(70, 96, "角 1 與角 5 都在「左上位置」，平行時角度相等。", "svg-note")}
    ${baseParallel(state)}
    ${arc(p.top.x, p.top.y, 62, 180, 180 + a, "#2563eb", `∠1=${a}°`, p.top.x - 120, p.top.y - 54)}
    ${arc(p.bottom.x, p.bottom.y, 62, 180, 180 + a, "#2563eb", `∠5=${state.keepParallel ? a : a + 12}°`, p.bottom.x - 120, p.bottom.y - 54)}
    ${line(p.top.x - 86, p.top.y - 92, p.bottom.x - 86, p.bottom.y - 92, "guide-line")}
    ${state.keepParallel ? label(314, 438, "同位角相等：∠1 = ∠5", "result-good") : label(292, 438, "兩線不平行時，同位角不一定相等", "result-bad")}
  `;
}

function drawAlternate(state) {
  const p = intersectionPoints(state);
  const a = 180 - state.angle;
  els.visualSvg.innerHTML += `
    ${label(70, 62, "內錯角：Z 字形裡的兩個內角", "svg-title")}
    ${label(70, 96, "角 4 與角 6 在兩條線中間、截線兩側；平行時角度相等。", "svg-note")}
    ${baseParallel(state)}
    ${line(p.top.x - 92, p.top.y + 42, p.bottom.x + 92, p.bottom.y - 42, "z-line")}
    ${arc(p.top.x, p.top.y, 58, 0, 180 - state.angle, "#7c3aed", `∠4=${a}°`, p.top.x - 116, p.top.y + 70)}
    ${arc(p.bottom.x, p.bottom.y, 58, 180, 360 - state.angle, "#7c3aed", `∠6=${state.keepParallel ? a : a - 14}°`, p.bottom.x + 50, p.bottom.y - 56)}
    ${state.keepParallel ? label(314, 438, "內錯角相等：∠4 = ∠6", "result-good") : label(286, 438, "Z 字形不再穩定，內錯角不一定相等", "result-bad")}
  `;
}

function drawSameSide(state) {
  const p = intersectionPoints(state);
  const a = 180 - state.angle;
  const b = state.angle;
  const sum = state.keepParallel ? 180 : 166;
  els.visualSvg.innerHTML += `
    ${label(70, 62, "同側內角：同一側，合起來是平角", "svg-title")}
    ${label(70, 96, "角 3 與角 6 在截線同側、兩條線中間；平行時相加 180°。", "svg-note")}
    ${baseParallel(state)}
    ${arc(p.top.x, p.top.y, 58, 180 - state.angle, 0, "#d88600", `∠3=${a}°`, p.top.x + 52, p.top.y + 72)}
    ${arc(p.bottom.x, p.bottom.y, 58, 180, 180 + state.angle, "#d88600", `∠6=${b}°`, p.bottom.x + 52, p.bottom.y - 52)}
    ${line(p.top.x + 104, p.top.y + 48, p.bottom.x + 104, p.bottom.y - 48, "same-side-line")}
    ${state.keepParallel ? label(284, 438, `${a}° + ${b}° = 180°，同側內角互補`, "result-good") : label(300, 438, `目前約 ${sum}°，不符合互補條件`, "result-bad")}
  `;
}

function drawConverse(state) {
  const p = intersectionPoints(state);
  const a = state.angle;
  els.visualSvg.innerHTML += `
    ${label(70, 62, "判別平行：把性質反過來用", "svg-title")}
    ${label(70, 96, "只要能證明同位角相等、內錯角相等，或同側內角互補，就能判斷兩線平行。", "svg-note")}
    ${baseParallel(state)}
    ${arc(p.top.x, p.top.y, 58, 180, 180 + a, "#2563eb", `已知 ${a}°`, p.top.x - 120, p.top.y - 54)}
    ${arc(p.bottom.x, p.bottom.y, 58, 180, 180 + a + (state.keepParallel ? 0 : 12), "#2563eb", state.keepParallel ? `${a}°` : `${a + 12}°`, p.bottom.x - 120, p.bottom.y - 54)}
    ${state.keepParallel ? label(244, 438, "同位角相等，所以 l ∥ m", "result-good") : label(246, 438, "角度條件不成立，不能判斷 l ∥ m", "result-bad")}
  `;
}

function drawSolve(state) {
  const p = intersectionPoints(state);
  const x = 180 - state.angle;
  els.visualSvg.innerHTML += `
    ${label(70, 62, "求未知角：先找關係，再搬角度", "svg-title")}
    ${label(70, 96, "例：已知一個內錯角，利用平行線性質找到 x。", "svg-note")}
    ${baseParallel({ ...state, keepParallel: true })}
    ${arc(p.top.x, p.top.y, 58, 0, x, "#7c3aed", `已知 ${x}°`, p.top.x + 46, p.top.y + 70)}
    ${arc(p.bottom.x, p.bottom.y, 58, 180, 180 + x, "#7c3aed", `x = ${x}°`, p.bottom.x - 120, p.bottom.y - 52)}
    ${line(p.top.x + 86, p.top.y + 42, p.bottom.x - 86, p.bottom.y - 42, "z-line")}
    ${label(240, 438, "因為 l ∥ m，內錯角相等，所以 x 直接等於已知角", "result-good")}
  `;
}

function drawMap() {
  els.visualSvg.innerHTML += `
    ${label(70, 62, "4-1 平行推理地圖", "svg-title")}
    ${label(70, 96, "看到平行線被截線切開，先辨認位置，再選用關係。", "svg-note")}
    ${flowBox(120, 164, "平行線 + 截線", "#2563eb")}
    ${flowBox(360, 116, "同位角", "#079669")}
    ${flowBox(360, 230, "內錯角", "#7c3aed")}
    ${flowBox(360, 344, "同側內角", "#d88600")}
    ${flowBox(650, 116, "相等", "#079669")}
    ${flowBox(650, 230, "相等", "#7c3aed")}
    ${flowBox(650, 344, "互補 180°", "#d88600")}
    ${line(280, 208, 360, 150, "flow-line")}
    ${line(280, 208, 360, 264, "flow-line")}
    ${line(280, 208, 360, 378, "flow-line")}
    ${line(520, 150, 650, 150, "flow-line")}
    ${line(520, 264, 650, 264, "flow-line")}
    ${line(520, 378, 650, 378, "flow-line")}
    ${label(190, 488, "口訣：同位相等、內錯相等、同側互補；反過來也能判斷平行。", "result-good")}
  `;
}

function flowBox(x, y, content, color) {
  return `<rect x="${x}" y="${y}" width="160" height="68" rx="10" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="3"></rect>${label(x + 28, y + 42, content, "svg-label")}`;
}

init();

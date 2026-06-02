const lessons = [
  { chapter: "第 1 章", title: "等差數列", accent: "#2463eb", type: "sequence", slider: ["項數", 1, 10, 6], idea: "規律不是背公式，是每一步都增加同樣的量。", action: "拖曳卡片後改變項數", key: "首項、公差、第 n 項", brief: "看見固定增加的節奏" },
  { chapter: "第 1 章", title: "等差級數", accent: "#079669", type: "series", slider: ["層數", 1, 9, 5], idea: "把一串數加起來，可以先把形狀配成一個好算的矩形。", action: "調整層數，看配對加總", key: "首尾配對、平均值、總和", brief: "用面積感覺加總" },
  { chapter: "第 1 章", title: "等比數列", accent: "#7c3aed", type: "ratio", slider: ["放大次數", 1, 7, 4], idea: "等比數列的變化不是加多少，而是每一步乘同一個倍率。", action: "調整放大次數", key: "公比、倍數成長", brief: "感受乘法式成長" },
  { chapter: "第 1 章", title: "費氏數列", accent: "#d88600", type: "fibonacci", slider: ["方塊數", 2, 8, 6], idea: "後一項接住前兩項，規律會自然長出螺旋。", action: "增加方塊，觀察螺旋", key: "前兩項相加、遞迴", brief: "從加法長出圖形" },
  { chapter: "第 2 章", title: "函數與函數圖形", accent: "#0891b2", type: "function", slider: ["輸入 x", -5, 5, 2], idea: "函數像一台機器：每個輸入，都被規則送到唯一的輸出。", action: "改變輸入值", key: "輸入、輸出、對應、圖形", brief: "把規則變成圖形" },
  { chapter: "第 2 章", title: "生活中的訊號", accent: "#df3454", type: "signal", slider: ["時間", 1, 10, 5], idea: "生活中的規律訊號，可以用圖形描述變化快慢與週期。", action: "拖曳時間軸", key: "變化率、週期、訊號", brief: "用圖讀懂變化" },
  { chapter: "第 3 章", title: "三角形內外角", accent: "#2463eb", type: "angles", slider: ["頂點位置", 1, 9, 5], idea: "三角形的三個內角會彼此牽制，外角則等於兩個內對角和。", action: "移動頂點，看角度改變", key: "內角和、外角定理", brief: "角度互相補位" },
  { chapter: "第 3 章", title: "尺規作圖", accent: "#079669", type: "construction", slider: ["作圖步驟", 1, 5, 3], idea: "尺規作圖不是量出答案，而是用圓弧留下等距的證據。", action: "切換作圖步驟", key: "圓弧、等距、垂直平分", brief: "看見作圖證據" },
  { chapter: "第 3 章", title: "三角形全等", accent: "#7c3aed", type: "congruence", slider: ["疊合程度", 0, 10, 5], idea: "全等是能完全疊合；條件夠，整個三角形就被鎖定。", action: "調整疊合程度", key: "SSS、SAS、ASA、AAS、RHS", brief: "條件鎖住形狀" },
  { chapter: "第 3 章", title: "中垂線與角平分線", accent: "#d88600", type: "bisector", slider: ["點的位置", 1, 9, 5], idea: "中垂線管的是到兩端點等距；角平分線管的是到兩邊等距。", action: "移動點，觀察等距", key: "等距軌跡、線段、角", brief: "用等距認識軌跡" },
  { chapter: "第 3 章", title: "三角形邊角關係", accent: "#0891b2", type: "sideAngle", slider: ["頂點高度", 2, 9, 6], idea: "同一個三角形裡，較大的角會面對較長的邊。", action: "改變頂點高度", key: "大角對大邊、大邊對大角", brief: "邊與角互相排序" },
  { chapter: "第 3 章", title: "角度面面觀", accent: "#df3454", type: "angleMap", slider: ["轉動角", 0, 10, 4], idea: "角度可以被平移、旋轉、拼補，最後變成可追蹤的關係網。", action: "旋轉角度拼圖", key: "對頂角、補角、同位角", brief: "追蹤角度關係" },
  { chapter: "第 4 章", title: "平行", accent: "#2463eb", type: "parallel", slider: ["截線角度", 1, 9, 5], idea: "兩線平行時，被截線切出的角會成組相等或互補。", action: "調整截線角度", key: "同位角、內錯角、同側內角", brief: "平行帶來角度規律" },
  { chapter: "第 4 章", title: "平行四邊形", accent: "#079669", type: "parallelogram", slider: ["傾斜程度", 1, 9, 4], idea: "只要兩組對邊平行，對邊、對角、對角線就會一起出現規律。", action: "拖動傾斜程度", key: "對邊相等、對角相等、對角線互相平分", brief: "一個條件帶出一串性質" },
  { chapter: "第 4 章", title: "特殊四邊形", accent: "#7c3aed", type: "quadFamily", slider: ["限制條件", 1, 5, 3], idea: "矩形、菱形、正方形不是分開背，是從平行四邊形逐步加限制。", action: "增加限制條件", key: "矩形、菱形、正方形、梯形", brief: "四邊形家族樹" },
  { chapter: "第 4 章", title: "發現平行之旅", accent: "#d88600", type: "journey", slider: ["任務點", 1, 6, 3], idea: "把平行、角度與四邊形性質串起來，就能做幾何推理。", action: "切換任務點", key: "觀察、猜想、驗證、推理", brief: "從圖形走到證明" }
];

const chapters = [...new Set(lessons.map((lesson) => lesson.chapter))];
let currentIndex = 0;

const els = {
  chapterTabs: document.getElementById("chapterTabs"),
  lessonList: document.getElementById("lessonList"),
  stageKicker: document.getElementById("stageKicker"),
  stageTitle: document.getElementById("stageTitle"),
  lessonIndex: document.getElementById("lessonIndex"),
  lessonTotal: document.getElementById("lessonTotal"),
  bigIdea: document.getElementById("bigIdea"),
  actionText: document.getElementById("actionText"),
  keyText: document.getElementById("keyText"),
  sliderLabel: document.getElementById("sliderLabel"),
  sliderValue: document.getElementById("sliderValue"),
  mainSlider: document.getElementById("mainSlider"),
  visualSvg: document.getElementById("visualSvg"),
  dropZone: document.getElementById("dropZone"),
  progressDots: document.getElementById("progressDots"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  shuffleBtn: document.getElementById("shuffleBtn")
};

function init() {
  els.lessonTotal.textContent = String(lessons.length).padStart(2, "0");
  renderChapterTabs();
  renderLessonCards(chapters[0]);
  renderDots();
  bindEvents();
  setLesson(0);
}

function bindEvents() {
  els.prevBtn.addEventListener("click", () => setLesson(Math.max(0, currentIndex - 1)));
  els.nextBtn.addEventListener("click", () => setLesson(Math.min(lessons.length - 1, currentIndex + 1)));
  els.shuffleBtn.addEventListener("click", () => startTour());
  els.mainSlider.addEventListener("input", () => {
    els.sliderValue.textContent = els.mainSlider.value;
    drawCurrent();
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
    if (!Number.isNaN(idx)) setLesson(idx);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") els.nextBtn.click();
    if (event.key === "ArrowLeft") els.prevBtn.click();
  });
}

function renderChapterTabs() {
  els.chapterTabs.innerHTML = chapters.map((chapter, idx) => (
    `<button class="chapter-tab" data-chapter="${chapter}" role="tab">${idx + 1} 章</button>`
  )).join("");

  els.chapterTabs.querySelectorAll(".chapter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      renderLessonCards(tab.dataset.chapter);
      const firstIndex = lessons.findIndex((lesson) => lesson.chapter === tab.dataset.chapter);
      setLesson(firstIndex);
    });
  });
}

function renderLessonCards(chapter) {
  els.lessonList.innerHTML = lessons.map((lesson, idx) => {
    if (lesson.chapter !== chapter) return "";
    const num = String(idx + 1).padStart(2, "0");
    return `
      <article class="lesson-card" style="--accent:${lesson.accent}" draggable="true" data-index="${idx}">
        <div class="lesson-chip">${num}</div>
        <div>
          <h3>${lesson.title}</h3>
          <p>${lesson.brief}</p>
        </div>
      </article>
    `;
  }).join("");

  els.lessonList.querySelectorAll(".lesson-card").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.index);
    });
    card.addEventListener("click", () => setLesson(Number(card.dataset.index)));
  });
}

function renderDots() {
  els.progressDots.innerHTML = lessons.map((_, idx) => (
    `<button class="dot" data-index="${idx}" aria-label="前往第 ${idx + 1} 個單元"></button>`
  )).join("");
  els.progressDots.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => setLesson(Number(dot.dataset.index)));
  });
}

function setLesson(idx) {
  currentIndex = idx;
  const lesson = lessons[idx];
  const [label, min, max, value] = lesson.slider;

  if (!els.lessonList.querySelector(`[data-index="${idx}"]`)) renderLessonCards(lesson.chapter);

  document.documentElement.style.setProperty("--blue", lesson.accent);
  els.stageKicker.textContent = lesson.chapter;
  els.stageTitle.textContent = lesson.title;
  els.lessonIndex.textContent = String(idx + 1).padStart(2, "0");
  els.bigIdea.textContent = lesson.idea;
  els.actionText.textContent = lesson.action;
  els.keyText.textContent = lesson.key;
  els.sliderLabel.textContent = label;
  els.mainSlider.min = min;
  els.mainSlider.max = max;
  els.mainSlider.value = value;
  els.sliderValue.textContent = value;
  els.prevBtn.disabled = idx === 0;
  els.nextBtn.disabled = idx === lessons.length - 1;

  document.querySelectorAll(".chapter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.chapter === lesson.chapter);
  });
  document.querySelectorAll(".lesson-card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.index) === idx);
  });
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.classList.toggle("active", Number(dot.dataset.index) === idx);
  });

  drawCurrent();
}

function startTour() {
  const next = (currentIndex + 1) % lessons.length;
  setLesson(next);
}

function drawCurrent() {
  const lesson = lessons[currentIndex];
  const n = Number(els.mainSlider.value);
  const svg = els.visualSvg;
  svg.innerHTML = defs(lesson.accent);

  const drawer = {
    sequence: drawSequence,
    series: drawSeries,
    ratio: drawRatio,
    fibonacci: drawFibonacci,
    function: drawFunction,
    signal: drawSignal,
    angles: drawAngles,
    construction: drawConstruction,
    congruence: drawCongruence,
    bisector: drawBisector,
    sideAngle: drawSideAngle,
    angleMap: drawAngleMap,
    parallel: drawParallel,
    parallelogram: drawParallelogram,
    quadFamily: drawQuadFamily,
    journey: drawJourney
  }[lesson.type];

  drawer(svg, n, lesson);
}

function defs(color) {
  return `
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="${color}"></path>
      </marker>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1e2a44" flood-opacity="0.16"/>
      </filter>
    </defs>
  `;
}

function text(x, y, content, cls = "svg-label") {
  return `<text x="${x}" y="${y}" class="${cls}">${content}</text>`;
}

function drawSequence(svg, n, lesson) {
  const blocks = Array.from({ length: n }, (_, i) => {
    const h = 46 + i * 18;
    const x = 70 + i * 76;
    return `<rect x="${x}" y="${390 - h}" width="48" height="${h}" rx="7" fill="${lesson.accent}" opacity="${0.38 + i * 0.055}"></rect>
      ${text(x + 12, 420, `a${i + 1}`, "svg-note")}`;
  }).join("");
  svg.innerHTML += `${text(70, 70, "等差數列：每一步都多同樣的量", "svg-title")}
    ${text(70, 108, `現在有 ${n} 項，柱子的高度以固定差往上長`, "svg-note")}
    ${blocks}
    <path d="M88 250 C160 215, 230 205, 300 170 S460 105, 620 80" class="thin" marker-end="url(#arrow)"></path>`;
}

function drawSeries(svg, n, lesson) {
  const rows = Array.from({ length: n }, (_, r) => {
    const count = r + 2;
    return Array.from({ length: count }, (_, c) => (
      `<rect x="${90 + c * 34}" y="${360 - r * 34}" width="28" height="28" rx="5" fill="${lesson.accent}" opacity="${0.42 + r * 0.05}"></rect>`
    )).join("");
  }).join("");
  svg.innerHTML += `${text(70, 70, "等差級數：把階梯配成矩形", "svg-title")}
    ${text(70, 108, "首尾配對後，每一組的和都一樣", "svg-note")}
    ${rows}
    <rect x="520" y="${360 - n * 17}" width="190" height="${n * 34}" rx="10" fill="none" stroke="${lesson.accent}" stroke-width="5" stroke-dasharray="10 8"></rect>
    ${text(535, 382, "配對後變好算", "svg-label")}`;
}

function drawRatio(svg, n, lesson) {
  const circles = Array.from({ length: n }, (_, i) => {
    const r = 18 + i * 10;
    return `<circle cx="${110 + i * 95}" cy="285" r="${r}" fill="${lesson.accent}" opacity="${0.22 + i * 0.08}"></circle>
      ${text(94 + i * 95, 385, `×r`, "svg-note")}`;
  }).join("");
  svg.innerHTML += `${text(70, 70, "等比數列：同一倍率連續作用", "svg-title")}
    ${text(70, 108, "每一項不是加固定數，而是乘固定倍率", "svg-note")}
    ${circles}
    <path d="M135 285 H720" class="thin" marker-end="url(#arrow)"></path>`;
}

function drawFibonacci(svg, n, lesson) {
  const sizes = [22, 22, 44, 66, 110, 176, 286, 462];
  let x = 300;
  let y = 270;
  const squares = sizes.slice(0, n).map((s, i) => {
    const scale = 0.62;
    const w = s * scale;
    const dx = [0, 1, 1, -1, -1, 1, 1, -1][i] * w * 0.55;
    const dy = [0, 0, -1, -1, 1, 1, -1, -1][i] * w * 0.55;
    x += dx;
    y += dy;
    return `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="none" stroke="${lesson.accent}" stroke-width="4"></rect>`;
  }).join("");
  svg.innerHTML += `${text(70, 70, "費氏數列：前兩項合成下一項", "svg-title")}
    ${text(70, 108, "方塊一路拼接，螺旋感自然出現", "svg-note")}
    ${squares}
    <path d="M320 300 C390 205, 520 205, 585 300 S700 420, 760 300" class="bold" stroke="${lesson.accent}" opacity="0.55"></path>`;
}

function drawFunction(svg, n, lesson) {
  const y = 260 - n * 24;
  svg.innerHTML += `${text(70, 70, "函數：輸入經過規則，得到唯一輸出", "svg-title")}
    ${text(70, 108, `輸入 x = ${n}，規則 y = 2x + 1，輸出 y = ${2 * n + 1}`, "svg-note")}
    <rect x="95" y="205" width="150" height="96" rx="12" fill="#eef4ff" stroke="${lesson.accent}" stroke-width="4"></rect>
    ${text(132, 263, `x = ${n}`, "svg-label")}
    <path d="M250 253 H410" class="bold" stroke="${lesson.accent}" marker-end="url(#arrow)"></path>
    <rect x="415" y="180" width="170" height="146" rx="12" fill="${lesson.accent}" opacity="0.12" stroke="${lesson.accent}" stroke-width="4"></rect>
    ${text(455, 258, "×2 + 1", "svg-label")}
    <path d="M590 253 H735" class="bold" stroke="${lesson.accent}" marker-end="url(#arrow)"></path>
    ${text(750, 263, `y = ${2 * n + 1}`, "svg-label")}
    <polyline points="100,430 190,380 280,330 370,280 460,230 550,180 640,130" fill="none" stroke="${lesson.accent}" stroke-width="5"></polyline>
    <circle cx="${460 + n * 18}" cy="${y + 170}" r="9" fill="${lesson.accent}"></circle>`;
}

function drawSignal(svg, n, lesson) {
  const points = Array.from({ length: 80 }, (_, i) => {
    const x = 70 + i * 10;
    const y = 280 + Math.sin((i + n * 4) / 6) * 78;
    return `${x},${y}`;
  }).join(" ");
  svg.innerHTML += `${text(70, 70, "生活中的訊號：變化也能被畫出來", "svg-title")}
    ${text(70, 108, "波峰、波谷與週期，讓資料變成能讀的圖形", "svg-note")}
    <line x1="70" y1="280" x2="820" y2="280" class="thin"></line>
    <polyline points="${points}" fill="none" stroke="${lesson.accent}" stroke-width="6"></polyline>
    <circle cx="${70 + n * 70}" cy="${280 + Math.sin((n * 7 + n * 4) / 6) * 78}" r="13" fill="${lesson.accent}"></circle>`;
}

function drawAngles(svg, n, lesson) {
  const ax = 420 + (n - 5) * 28;
  const ay = 130 + Math.abs(n - 5) * 10;
  svg.innerHTML += `${text(70, 70, "三角形內外角：角度會彼此牽制", "svg-title")}
    ${text(70, 108, "內角和固定，延長一邊就看見外角定理", "svg-note")}
    <polygon points="${ax},${ay} 210,400 690,400" fill="${lesson.accent}" opacity="0.10" stroke="${lesson.accent}" stroke-width="5"></polygon>
    <line x1="690" y1="400" x2="810" y2="400" class="bold" stroke="${lesson.accent}"></line>
    <path d="M640 400 A70 70 0 0 0 705 330" class="bold" stroke="#df3454"></path>
    ${text(704, 356, "外角", "svg-label")}
    ${text(ax - 10, ay - 18, "A", "svg-label")}
    ${text(185, 430, "B", "svg-label")}
    ${text(682, 430, "C", "svg-label")}`;
}

function drawConstruction(svg, n, lesson) {
  const arcs = [
    `<circle cx="310" cy="305" r="92" class="thin"></circle>`,
    `<circle cx="550" cy="305" r="92" class="thin"></circle>`,
    `<path d="M430 170 V430" class="bold" stroke="${lesson.accent}"></path>`,
    `<line x1="310" y1="305" x2="550" y2="305" class="bold" stroke="#172033"></line>`,
    `<circle cx="430" cy="305" r="9" fill="${lesson.accent}"></circle>`
  ];
  svg.innerHTML += `${text(70, 70, "尺規作圖：圓弧留下等距證據", "svg-title")}
    ${text(70, 108, `目前顯示第 ${n} 步`, "svg-note")}
    ${arcs.slice(0, n).join("")}
    ${text(295, 335, "A", "svg-label")}
    ${text(560, 335, "B", "svg-label")}`;
}

function drawCongruence(svg, n, lesson) {
  const offset = 120 - n * 12;
  svg.innerHTML += `${text(70, 70, "三角形全等：條件足夠就能完全疊合", "svg-title")}
    ${text(70, 108, "讓兩個三角形逐步疊在一起，感受全等的意思", "svg-note")}
    <polygon points="255,370 430,160 610,370" fill="${lesson.accent}" opacity="0.16" stroke="${lesson.accent}" stroke-width="5"></polygon>
    <polygon points="${255 + offset},${370 - offset * 0.15} ${430 + offset},${160 - offset * 0.15} ${610 + offset},${370 - offset * 0.15}" fill="#172033" opacity="0.10" stroke="#172033" stroke-width="5"></polygon>
    ${text(330, 438, n > 8 ? "完全疊合" : "正在對齊", "svg-label")}`;
}

function drawBisector(svg, n, lesson) {
  const px = 430 + (n - 5) * 28;
  svg.innerHTML += `${text(70, 70, "中垂線與角平分線：等距點排成線", "svg-title")}
    ${text(70, 108, "點在中垂線上，到線段兩端距離相等", "svg-note")}
    <line x1="260" y1="340" x2="620" y2="340" class="bold" stroke="#172033"></line>
    <line x1="440" y1="140" x2="440" y2="460" class="bold" stroke="${lesson.accent}" stroke-dasharray="12 10"></line>
    <circle cx="${px}" cy="230" r="11" fill="${lesson.accent}"></circle>
    <line x1="${px}" y1="230" x2="260" y2="340" class="thin"></line>
    <line x1="${px}" y1="230" x2="620" y2="340" class="thin"></line>
    ${text(242, 372, "A", "svg-label")}
    ${text(630, 372, "B", "svg-label")}
    ${text(px + 15, 224, "P", "svg-label")}`;
}

function drawSideAngle(svg, n, lesson) {
  const ay = 110 + (10 - n) * 20;
  svg.innerHTML += `${text(70, 70, "三角形邊角關係：最大角面對最長邊", "svg-title")}
    ${text(70, 108, "改變頂點高度，邊長與對角排序一起改變", "svg-note")}
    <polygon points="420,${ay} 210,410 720,410" fill="${lesson.accent}" opacity="0.12" stroke="${lesson.accent}" stroke-width="5"></polygon>
    <line x1="210" y1="410" x2="720" y2="410" class="bold" stroke="#df3454"></line>
    <path d="M245 410 A55 55 0 0 1 275 360" class="bold" stroke="#079669"></path>
    <path d="M680 410 A65 65 0 0 0 640 350" class="bold" stroke="#d88600"></path>
    ${text(392, ay - 18, "頂點", "svg-label")}
    ${text(400, 455, "底邊最長時，對面的頂角也最醒目", "svg-label")}`;
}

function drawAngleMap(svg, n, lesson) {
  const rotate = n * 9;
  svg.innerHTML += `${text(70, 70, "角度面面觀：把角移動、旋轉、拼補", "svg-title")}
    ${text(70, 108, "同位角、內錯角、補角都能在圖上追蹤", "svg-note")}
    <g transform="translate(450 290) rotate(${rotate})">
      <line x1="-230" y1="0" x2="230" y2="0" class="bold" stroke="${lesson.accent}"></line>
      <line x1="-120" y1="-140" x2="120" y2="140" class="bold" stroke="#172033"></line>
      <path d="M0 0 A80 80 0 0 1 62 50" class="bold" stroke="#df3454"></path>
      <path d="M0 0 A80 80 0 0 0 -62 -50" class="bold" stroke="#079669"></path>
    </g>
    ${text(342, 448, "旋轉後，角度關係仍然可以追蹤", "svg-label")}`;
}

function drawParallel(svg, n, lesson) {
  const x = 360 + (n - 5) * 22;
  svg.innerHTML += `${text(70, 70, "平行：一條截線切出整組角度規律", "svg-title")}
    ${text(70, 108, "平行線上的同位角相等，內錯角相等，同側內角互補", "svg-note")}
    <line x1="130" y1="210" x2="780" y2="210" class="bold" stroke="${lesson.accent}"></line>
    <line x1="130" y1="370" x2="780" y2="370" class="bold" stroke="${lesson.accent}"></line>
    <line x1="${x - 150}" y1="110" x2="${x + 150}" y2="470" class="bold" stroke="#172033"></line>
    <circle cx="${x - 67}" cy="210" r="42" fill="none" stroke="#df3454" stroke-width="5"></circle>
    <circle cx="${x + 67}" cy="370" r="42" fill="none" stroke="#df3454" stroke-width="5"></circle>
    ${text(612, 195, "同位角", "svg-label")}`;
}

function drawParallelogram(svg, n, lesson) {
  const skew = n * 18;
  svg.innerHTML += `${text(70, 70, "平行四邊形：兩組平行帶出整串性質", "svg-title")}
    ${text(70, 108, "對邊相等、對角相等，對角線互相平分", "svg-note")}
    <polygon points="${250 + skew},170 650,170 ${650 - skew},390 250,390" fill="${lesson.accent}" opacity="0.13" stroke="${lesson.accent}" stroke-width="6"></polygon>
    <line x1="${250 + skew}" y1="170" x2="${650 - skew}" y2="390" class="thin"></line>
    <line x1="650" y1="170" x2="250" y2="390" class="thin"></line>
    <circle cx="450" cy="280" r="10" fill="${lesson.accent}"></circle>
    ${text(384, 452, "對角線交點就是彼此中點", "svg-label")}`;
}

function drawQuadFamily(svg, n, lesson) {
  const items = ["四邊形", "平行四邊形", "矩形", "菱形", "正方形"];
  const visible = items.slice(0, n);
  svg.innerHTML += `${text(70, 70, "特殊四邊形：從家族樹看限制條件", "svg-title")}
    ${text(70, 108, "條件越多，圖形越特殊", "svg-note")}
    ${visible.map((item, i) => `
      <rect x="${120 + i * 145}" y="${190 + i % 2 * 95}" width="120" height="72" rx="8" fill="${lesson.accent}" opacity="${0.14 + i * 0.08}" stroke="${lesson.accent}" stroke-width="4"></rect>
      ${text(137 + i * 145, 235 + i % 2 * 95, item, "svg-label")}
      ${i > 0 ? `<path d="M${95 + i * 145} ${226 + (i - 1) % 2 * 95} H${120 + i * 145}" class="thin" marker-end="url(#arrow)"></path>` : ""}
    `).join("")}`;
}

function drawJourney(svg, n, lesson) {
  const steps = ["觀察", "猜想", "標記", "驗證", "推理", "說明"];
  svg.innerHTML += `${text(70, 70, "發現平行之旅：把性質串成推理路線", "svg-title")}
    ${text(70, 108, "幾何不是單點知識，而是一條從圖到證明的路", "svg-note")}
    ${steps.map((step, i) => `
      <circle cx="${135 + i * 125}" cy="${285 + Math.sin(i) * 55}" r="42" fill="${lesson.accent}" opacity="${i < n ? 0.85 : 0.18}"></circle>
      ${text(103 + i * 125, 292 + Math.sin(i) * 55, step, "svg-label")}
      ${i < steps.length - 1 ? `<path d="M${178 + i * 125} ${285 + Math.sin(i) * 55} H${215 + i * 125}" class="thin" marker-end="url(#arrow)"></path>` : ""}
    `).join("")}`;
}

init();

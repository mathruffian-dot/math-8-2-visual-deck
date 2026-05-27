// --- Global State ---
let currentStage = 0;
let stage0AnimId = null;
let isDraggingS3Vertex = false;

// --- DOM Elements ---
const stageBadge = document.getElementById('current-stage-badge');
const canvasTitle = document.getElementById('canvas-dynamic-title');
const svgDrawGroup = document.getElementById('svg-draw-group');
const geometrySvg = document.getElementById('geometry-svg');

// Stage view containers
const stageViews = [
  document.getElementById('view-stage-0'),
  document.getElementById('view-stage-1'),
  document.getElementById('view-stage-2'),
  document.getElementById('view-stage-3'),
  document.getElementById('view-stage-4'),
  document.getElementById('view-stage-5')
];

// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setStage(0);
});

// Setup all control event listeners
function setupEventListeners() {
  // Presentation Controls: keyboard navigation (Arrow keys)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      prevSlide();
    }
  });

  // Stage 1 sliders (Triangle Inequality)
  const s1a = document.getElementById('slider-s1-a');
  const s1b = document.getElementById('slider-s1-b');
  const s1c = document.getElementById('slider-s1-c');
  const updateS1 = () => {
    document.getElementById('val-s1-a').innerText = s1a.value;
    document.getElementById('val-s1-b').innerText = s1b.value;
    document.getElementById('val-s1-c').innerText = s1c.value;
    renderStage1();
  };
  if (s1a) s1a.addEventListener('input', updateS1);
  if (s1b) s1b.addEventListener('input', updateS1);
  if (s1c) s1c.addEventListener('input', updateS1);

  // Stage 2 sliders (Isosceles)
  const s2angle = document.getElementById('slider-s2-angle');
  const s2leg = document.getElementById('slider-s2-leg');
  const updateS2 = () => {
    document.getElementById('val-s2-angle').innerText = s2angle.value + '°';
    document.getElementById('val-s2-leg').innerText = s2leg.value;
    renderStage2();
  };
  if (s2angle) s2angle.addEventListener('input', updateS2);
  if (s2leg) s2leg.addEventListener('input', updateS2);

  // Stage 3 sliders (Side-Angle Inequality)
  const s3x = document.getElementById('slider-s3-x');
  const s3y = document.getElementById('slider-s3-y');
  const updateS3 = () => {
    document.getElementById('val-s3-x').innerText = s3x.value;
    document.getElementById('val-s3-y').innerText = s3y.value;
    renderStage3();
  };
  if (s3x) s3x.addEventListener('input', updateS3);
  if (s3y) s3y.addEventListener('input', updateS3);

  // Stage 4 sliders (Exterior Angle)
  const s4angA = document.getElementById('slider-s4-angA');
  const s4angB = document.getElementById('slider-s4-angB');
  const updateS4 = () => {
    document.getElementById('val-s4-angA').innerText = s4angA.value + '°';
    document.getElementById('val-s4-angB').innerText = s4angB.value + '°';
    renderStage4();
  };
  if (s4angA) s4angA.addEventListener('input', updateS4);
  if (s4angB) s4angB.addEventListener('input', updateS4);

  const btnAnimateExt = document.getElementById('btn-animate-exterior');
  if (btnAnimateExt) btnAnimateExt.addEventListener('click', animateExteriorAngleCollage);

  // Support direct drag in SVG for Stage 3 vertex A
  if (geometrySvg) {
    geometrySvg.addEventListener('mousedown', startS3Drag);
    geometrySvg.addEventListener('mousemove', dragS3Vertex);
    window.addEventListener('mouseup', stopS3Drag);

    geometrySvg.addEventListener('touchstart', startS3Drag, { passive: false });
    geometrySvg.addEventListener('touchmove', dragS3Vertex, { passive: false });
    window.addEventListener('touchend', stopS3Drag);
  }
}

// --- Slide Switch Functions ---
function prevSlide() {
  if (currentStage > 0) {
    setStage(currentStage - 1);
  }
}

function nextSlide() {
  if (currentStage < 5) {
    setStage(currentStage + 1);
  }
}

// Set global active stage (called by dots click and button click)
function setGlobalStage(idx) {
  setStage(idx);
}

function setStage(stageIdx) {
  // Clean up animations
  if (stage0AnimId) {
    cancelAnimationFrame(stage0AnimId);
    stage0AnimId = null;
  }
  
  currentStage = stageIdx;

  // Update badges & UI controls
  const stageNames = ["導覽：學習大綱", "核心一：三角不等式", "核心二：等腰三角形", "核心三：大角對大邊", "核心四：外角定理", "挑戰：學習評量"];
  if (stageBadge) stageBadge.innerText = stageNames[stageIdx];
  if (canvasTitle) canvasTitle.innerText = "幾何動態模擬畫布 - " + stageNames[stageIdx].split('：')[1];

  // Disable Prev/Next at boundaries dynamically to prevent null reference crash
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  if (btnPrev) btnPrev.disabled = (stageIdx === 0);
  if (btnNext) btnNext.disabled = (stageIdx === 5);

  // Update dot indicators active class
  const slideDots = document.querySelectorAll('.slide-dot');
  slideDots.forEach((dot, idx) => {
    if (idx === stageIdx) {
      dot.classList.add('active');
      if (idx % 2 !== 0) {
        dot.classList.add('active-purple');
      } else {
        dot.classList.remove('active-purple');
      }
    } else {
      dot.classList.remove('active', 'active-purple');
    }
  });

  // Switch card views
  stageViews.forEach((view, idx) => {
    if (idx === stageIdx) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Clear drawing group
  if (svgDrawGroup) svgDrawGroup.innerHTML = '';

  // Render stage-specific graphics
  switch(stageIdx) {
    case 0:
      startStage0OverviewAnim();
      break;
    case 1:
      renderStage1();
      break;
    case 2:
      renderStage2();
      break;
    case 3:
      renderStage3();
      break;
    case 4:
      renderStage4();
      break;
    case 5:
      renderStage5();
      break;
  }
}

// --- Helper Functions ---
function getAngleArcPath(cx, cy, r, startAngle, endAngle) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  const sweepFlag = endAngle > startAngle ? "1" : "0";
  
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
}

// Calculate angle between three vertices: angle at p2
function calculateAngle(p1, p2, p3) {
  const d12 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
  const d23 = Math.hypot(p3.x - p2.x, p3.y - p2.y);
  const d13 = Math.hypot(p1.x - p3.x, p1.y - p3.y);
  
  const cosVal = (d12*d12 + d23*d23 - d13*d13) / (2 * d12 * d23);
  return Math.acos(Math.max(-1, Math.min(1, cosVal))) * (180 / Math.PI);
}

// Get screen coords to SVG viewport coords
function getSVGCoords(e) {
  const rect = geometrySvg.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  return {
    x: ((clientX - rect.left) / rect.width) * 400,
    y: ((clientY - rect.top) / rect.height) * 400
  };
}

// --- Drag & Drop Handlers for Stage 3 ---
function startS3Drag(e) {
  if (currentStage !== 3) return;
  const coords = getSVGCoords(e);
  // Check if close to vertex A (which is at coordinates governed by the slider)
  const ax = parseFloat(document.getElementById('slider-s3-x').value);
  const ay = parseFloat(document.getElementById('slider-s3-y').value);
  
  const dist = Math.hypot(coords.x - ax, coords.y - ay);
  if (dist < 22) { // Drag radius threshold
    isDraggingS3Vertex = true;
    geometrySvg.style.cursor = 'grabbing';
    e.preventDefault();
  }
}

function dragS3Vertex(e) {
  if (currentStage !== 3 || !isDraggingS3Vertex) return;
  e.preventDefault();
  const coords = getSVGCoords(e);
  
  // Constrain to canvas viewport boundaries
  const cx = Math.max(10, Math.min(390, coords.x));
  const cy = Math.max(50, Math.min(270, coords.y)); // Don't let it overlap base too much
  
  // Update sliders & text values
  document.getElementById('slider-s3-x').value = Math.round(cx);
  document.getElementById('slider-s3-y').value = Math.round(cy);
  document.getElementById('val-s3-x').innerText = Math.round(cx);
  document.getElementById('val-s3-y').innerText = Math.round(cy);
  
  renderStage3();
}

function stopS3Drag() {
  if (currentStage === 3 && isDraggingS3Vertex) {
    isDraggingS3Vertex = false;
    geometrySvg.style.cursor = 'default';
  }
}

// ==========================================
// RENDERERS FOR INDIVIDUAL STAGES
// ==========================================

// --- Stage 0: Overview rotating triangle ---
function startStage0OverviewAnim() {
  let angle = 0;
  
  function tick() {
    if (currentStage !== 0) return;
    
    angle = (angle + 0.6) % 360;
    
    // Draw rotating complex grid & triangles to show visual excellence
    if (svgDrawGroup) svgDrawGroup.innerHTML = '';
    
    const rad = (angle * Math.PI) / 180;
    const r = 90;
    
    // Rotating Vertices
    const ax = 200 + r * Math.cos(rad - Math.PI/2);
    const ay = 200 + r * Math.sin(rad - Math.PI/2);
    const bx = 200 + r * Math.cos(rad + Math.PI/6);
    const by = 200 + r * Math.sin(rad + Math.PI/6);
    const cx = 200 + r * Math.cos(rad + 5*Math.PI/6);
    const cy = 200 + r * Math.sin(rad + 5*Math.PI/6);
    
    // Draw outer orbital circle
    const orbital = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    orbital.setAttribute('cx', '200');
    orbital.setAttribute('cy', '200');
    orbital.setAttribute('r', '90');
    orbital.setAttribute('fill', 'none');
    orbital.setAttribute('stroke', 'rgba(168, 85, 247, 0.15)');
    orbital.setAttribute('stroke-dasharray', '5, 5');
    if (svgDrawGroup) svgDrawGroup.appendChild(orbital);
    
    // Draw inner geometry triangle
    const tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    tri.setAttribute('points', `${ax},${ay} ${bx},${by} ${cx},${cy}`);
    tri.setAttribute('fill', 'none');
    tri.setAttribute('stroke', 'url(#stage0-neon-grad)');
    tri.setAttribute('stroke-width', '3');
    tri.setAttribute('filter', 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))');
    if (svgDrawGroup) svgDrawGroup.appendChild(tri);
    
    // Draw glowing nodes
    [ {x: ax, label: 'A', color: '#06b6d4'}, 
      {x: bx, label: 'B', color: '#a855f7'}, 
      {x: cx, label: 'C', color: '#fbbf24'} 
    ].forEach((node, i) => {
      const cy_node = i===0 ? ay : (i===1 ? by : cy);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', node.x);
      dot.setAttribute('cy', cy_node);
      dot.setAttribute('r', '6');
      dot.setAttribute('fill', '#fff');
      dot.setAttribute('stroke', node.color);
      dot.setAttribute('stroke-width', '3');
      if (svgDrawGroup) svgDrawGroup.appendChild(dot);
    });

    // Define linear gradient inside SVG dynamically
    if (!document.getElementById('stage0-neon-grad')) {
      const defs = geometrySvg.querySelector('defs');
      if (defs) {
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'stage0-neon-grad');
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%');
        grad.setAttribute('y2', '100%');
        
        const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        s1.setAttribute('offset', '0%');
        s1.setAttribute('stop-color', '#06b6d4');
        const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        s2.setAttribute('offset', '100%');
        s2.setAttribute('stop-color', '#a855f7');
        
        grad.appendChild(s1);
        grad.appendChild(s2);
        defs.appendChild(grad);
      }
    }
    
    stage0AnimId = requestAnimationFrame(tick);
  }
  
  tick();
}

// --- Stage 1: Triangle Inequality ---
function renderStage1() {
  if (svgDrawGroup) svgDrawGroup.innerHTML = '';
  
  const sideA = parseInt(document.getElementById('slider-s1-a').value);
  const sideB = parseInt(document.getElementById('slider-s1-b').value);
  const sideC = parseInt(document.getElementById('slider-s1-c').value);
  
  // Base endpoints
  const bx = 200 - sideC / 2;
  const by = 240;
  const cx = 200 + sideC / 2;
  const cy = 240;
  
  const statusLabel = document.getElementById('triangle-inequality-status');
  
  // Check Triangle Inequality
  const canForm = (sideA + sideB > sideC) && (sideA + sideC > sideB) && (sideB + sideC > sideA);
  
  if (canForm) {
    const cosB = (sideA*sideA + sideC*sideC - sideB*sideB) / (2 * sideA * sideC);
    const angleB = Math.acos(cosB); // rad
    
    const ax = bx + sideA * Math.cos(angleB);
    const ay = by - sideA * Math.sin(angleB);
    
    // Draw filled polygon
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', `${bx},${by} ${ax},${ay} ${cx},${cy}`);
    polygon.setAttribute('class', 'svg-triangle');
    if (svgDrawGroup) svgDrawGroup.appendChild(polygon);
    
    // Draw apex lines
    drawLine(bx, by, ax, ay, 'var(--accent-cyan)', 3);
    drawLine(cx, cy, ax, ay, 'var(--accent-purple)', 3);
    
    // Draw vertex markers
    drawCircle(ax, ay, 6, '#fff', 'var(--accent-cyan)', 3);
    drawText(ax, ay - 18, 'A');
    
    // Show length tags
    drawText((bx + ax)/2 - 18, (by + ay)/2 - 10, sideA, '#67e8f9');
    drawText((cx + ax)/2 + 18, (cy + ay)/2 - 10, sideB, '#c084fc');
    
    if (statusLabel) {
      statusLabel.innerHTML = '✅ <strong>可構成三角形：</strong>任兩邊長之和皆大於第三邊。';
      statusLabel.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      statusLabel.style.background = 'rgba(16, 185, 129, 0.08)';
      statusLabel.style.color = '#34d399';
    }
    
  } else {
    // Invalid Case
    let thetaB = 0; // flat
    let thetaC = Math.PI; // flat
    
    if (sideA + sideB <= sideC) {
      thetaB = -15 * Math.PI / 180;
      thetaC = 195 * Math.PI / 180;
    }
    
    const ax1 = bx + sideA * Math.cos(thetaB);
    const ay1 = by + sideA * Math.sin(thetaB);
    
    const ax2 = cx + sideB * Math.cos(thetaC);
    const ay2 = cy + sideB * Math.sin(thetaC);
    
    // Draw base line
    drawLine(bx, by, cx, cy, 'var(--text-muted)', 2.5);
    
    // Draw failed side A & B
    drawLine(bx, by, ax1, ay1, '#f43f5e', 3.5, '5,5');
    drawLine(cx, cy, ax2, ay2, '#f43f5e', 3.5, '5,5');
    
    // Draw failed vertex dots
    drawCircle(ax1, ay1, 5, '#f43f5e', '#fff', 1.5);
    drawCircle(ax2, ay2, 5, '#f43f5e', '#fff', 1.5);
    
    // Highlight gap
    if (sideA + sideB <= sideC) {
      drawLine(ax1, by, ax2, by, '#f43f5e', 3);
      drawText(200, by + 18, `無法碰合！缺口長度: ${Math.round(sideC - (sideA + sideB))}`, '#fb7185');
    } else {
      drawText(200, by + 18, `單邊太長無法構成！`, '#fb7185');
    }
    
    if (statusLabel) {
      statusLabel.innerHTML = '❌ <strong>無法構成三角形：</strong>不滿足「兩邊之和大於第三邊」！';
      statusLabel.style.borderColor = 'rgba(244, 63, 94, 0.4)';
      statusLabel.style.background = 'rgba(244, 63, 94, 0.08)';
      statusLabel.style.color = '#fb7185';
    }
  }
  
  // Render base endpoints
  drawCircle(bx, by, 6, '#fff', 'var(--text-primary)', 3);
  drawCircle(cx, cy, 6, '#fff', 'var(--text-primary)', 3);
  drawText(bx - 12, by + 12, 'B');
  drawText(cx + 12, cy + 12, 'C');
  drawText(200, by - 12, sideC, '#94a3b8');
}

// --- Stage 2: Isosceles Triangle ---
function renderStage2() {
  if (svgDrawGroup) svgDrawGroup.innerHTML = '';
  
  const apexAngle = parseInt(document.getElementById('slider-s2-angle').value);
  const legLength = parseInt(document.getElementById('slider-s2-leg').value);
  
  const baseAngle = (180 - apexAngle) / 2;
  
  const ax = 200;
  const ay = 150;
  
  const radApexHalf = (apexAngle / 2) * Math.PI / 180;
  const bx = ax - legLength * Math.sin(radApexHalf);
  const by = ay + legLength * Math.cos(radApexHalf);
  const cx = ax + legLength * Math.sin(radApexHalf);
  const cy = ay + legLength * Math.cos(radApexHalf);
  
  // Draw base filled polygon
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', `${ax},${ay} ${bx},${by} ${cx},${cy}`);
  polygon.setAttribute('class', 'svg-triangle');
  polygon.setAttribute('style', 'fill: rgba(168, 85, 247, 0.1); stroke: var(--accent-purple); stroke-width: 3;');
  if (svgDrawGroup) svgDrawGroup.appendChild(polygon);
  
  // Highlight equal legs (AB and AC) with double neon lines
  drawLine(ax, ay, bx, by, 'var(--accent-cyan)', 3.5);
  drawLine(ax, ay, cx, cy, 'var(--accent-cyan)', 3.5);
  drawLine(bx, by, cx, cy, 'var(--text-muted)', 2);
  
  // Draw Congruence Ticks
  const midABx = (ax + bx) / 2;
  const midABy = (ay + by) / 2;
  const midACx = (ax + cx) / 2;
  const midACy = (ay + cy) / 2;
  const angAB = Math.atan2(by - ay, bx - ax) + Math.PI/2;
  const angAC = Math.atan2(cy - ay, cx - ax) + Math.PI/2;
  
  const tickLen = 6;
  drawLine(midABx - tickLen*Math.cos(angAB), midABy - tickLen*Math.sin(angAB), 
           midABx + tickLen*Math.cos(angAB), midABy + tickLen*Math.sin(angAB), 'var(--accent-cyan)', 2.5);
  drawLine(midACx - tickLen*Math.cos(angAC), midACy - tickLen*Math.sin(angAC), 
           midACx + tickLen*Math.cos(angAC), midACy + tickLen*Math.sin(angAC), 'var(--accent-cyan)', 2.5);

  // Draw angle arcs for bottom angles (B and C)
  const bArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const radAB = Math.atan2(ay - by, ax - bx);
  const angABDeg = radAB * 180 / Math.PI;
  bArc.setAttribute('d', getAngleArcPath(bx, by, 30, angABDeg, 0));
  bArc.setAttribute('class', 'svg-angle-arc');
  bArc.setAttribute('stroke', 'var(--accent-purple)');
  bArc.setAttribute('fill', 'rgba(168, 85, 247, 0.15)');
  if (svgDrawGroup) svgDrawGroup.appendChild(bArc);
  
  const cArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const radAC = Math.atan2(ay - cy, ax - cx);
  const angACDeg = radAC * 180 / Math.PI;
  cArc.setAttribute('d', getAngleArcPath(cx, cy, 30, 180, angACDeg));
  cArc.setAttribute('class', 'svg-angle-arc');
  cArc.setAttribute('stroke', 'var(--accent-purple)');
  cArc.setAttribute('fill', 'rgba(168, 85, 247, 0.15)');
  if (svgDrawGroup) svgDrawGroup.appendChild(cArc);
  
  // Draw text values
  drawText(bx + 35, by - 12, `${baseAngle.toFixed(0)}°`, '#c084fc');
  drawText(cx - 35, cy - 12, `${baseAngle.toFixed(0)}°`, '#c084fc');
  drawText(ax, ay + 30, `${apexAngle}°`, '#67e8f9');
  
  // Draw vertex dots
  drawCircle(ax, ay, 6, '#fff', 'var(--accent-cyan)', 3);
  drawCircle(bx, by, 5, '#fff', 'var(--text-primary)', 2);
  drawCircle(cx, cy, 5, '#fff', 'var(--text-primary)', 2);
  
  // Labels
  drawText(ax, ay - 18, 'A');
  drawText(bx - 12, by + 12, 'B');
  drawText(cx + 12, cy + 12, 'C');
  
  // Side lengths
  drawText(midABx - 22, midABy - 5, legLength, '#22d3ee');
  drawText(midACx + 22, midACy - 5, legLength, '#22d3ee');
  drawText((bx+cx)/2, by + 18, `底邊長: ${Math.round(2 * legLength * Math.sin(radApexHalf))}`, '#64748b');
}

// --- Stage 3: Larger Angle / Larger Side ---
function renderStage3() {
  if (svgDrawGroup) svgDrawGroup.innerHTML = '';
  
  const ax = parseFloat(document.getElementById('slider-s3-x').value);
  const ay = parseFloat(document.getElementById('slider-s3-y').value);
  
  // Fixed base vertices
  const bx = 80;
  const by = 280;
  const cx = 320;
  const cy = 280;
  
  const pA = { x: ax, y: ay };
  const pB = { x: bx, y: by };
  const pC = { x: cx, y: cy };
  
  // Calculate Side Lengths
  const side_a = Math.round(Math.hypot(cx - bx, cy - by)); // Side BC
  const side_b = Math.round(Math.hypot(ax - cx, ay - cy)); // Side AC
  const side_c = Math.round(Math.hypot(ax - bx, ay - by)); // Side AB
  
  // Calculate Angles
  const angle_A = calculateAngle(pB, pA, pC);
  const angle_B = calculateAngle(pA, pB, pC);
  const angle_C = 180 - angle_A - angle_B;
  
  const sides = [
    { label: 'a', val: side_a, elemId: 'badge-side-a', oppAngle: 'A' },
    { label: 'b', val: side_b, elemId: 'badge-side-b', oppAngle: 'B' },
    { label: 'c', val: side_c, elemId: 'badge-side-c', oppAngle: 'C' }
  ];
  
  const angles = [
    { label: 'A', val: angle_A, elemId: 'badge-angle-a', oppSide: 'a' },
    { label: 'B', val: angle_B, elemId: 'badge-angle-b', oppSide: 'b' },
    { label: 'C', val: angle_C, elemId: 'badge-angle-c', oppSide: 'c' }
  ];
  
  const sortedSides = [...sides].sort((x, y) => y.val - x.val);
  const sortedAngles = [...angles].sort((x, y) => y.val - x.val);
  
  const getTierClass = (rank) => {
    if (rank === 0) return { name: '最大', style: 'badge-largest', color: 'var(--tier-largest)' };
    if (rank === 1) return { name: '中', style: 'badge-medium', color: 'var(--tier-medium)' };
    return { name: '最小', style: 'badge-smallest', color: 'var(--tier-smallest)' };
  };
  
  sides.forEach(s => {
    const rank = sortedSides.findIndex(ss => ss.label === s.label);
    const tier = getTierClass(rank);
    const badge = document.getElementById(s.elemId);
    if (badge) {
      badge.innerText = `${s.val} (${tier.name})`;
      badge.className = `data-badge ${tier.style}`;
    }
    s.color = tier.color;
  });
  
  angles.forEach(ang => {
    const rank = sortedAngles.findIndex(sa => sa.label === ang.label);
    const tier = getTierClass(rank);
    const badge = document.getElementById(ang.elemId);
    if (badge) {
      badge.innerText = `${ang.val.toFixed(0)}° (${tier.name})`;
      badge.className = `data-badge ${tier.style}`;
    }
    ang.color = tier.color;
  });

  // Render Triangle paths dynamically with tier colored borders
  drawLine(ax, ay, bx, by, sides.find(s => s.label === 'c').color, 4);
  drawLine(ax, ay, cx, cy, sides.find(s => s.label === 'b').color, 4);
  drawLine(bx, by, cx, cy, sides.find(s => s.label === 'a').color, 4);
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', `${ax},${ay} ${bx},${by} ${cx},${cy}`);
  polygon.setAttribute('fill', 'rgba(255,255,255,0.02)');
  polygon.setAttribute('stroke', 'none');
  if (svgDrawGroup) svgDrawGroup.appendChild(polygon);

  // Render glowing Angle Arc highlights
  const radBC = Math.atan2(cy - by, cx - bx);
  const radBA = Math.atan2(ay - by, ax - bx);
  const pathB = getAngleArcPath(bx, by, 32, radBC*180/Math.PI, radBA*180/Math.PI);
  drawPath(pathB, angles.find(a => a.label === 'B').color, 'rgba(255,255,255,0.05)', 3);

  const radCA = Math.atan2(ay - cy, ax - cx);
  const radCB = Math.atan2(by - cy, bx - cx);
  const pathC = getAngleArcPath(cx, cy, 32, radCA*180/Math.PI, radCB*180/Math.PI);
  drawPath(pathC, angles.find(a => a.label === 'C').color, 'rgba(255,255,255,0.05)', 3);

  const radAC = Math.atan2(cy - ay, cx - ax);
  const radAB = Math.atan2(by - ay, bx - ax);
  const pathA = getAngleArcPath(ax, ay, 32, radAC*180/Math.PI, radAB*180/Math.PI);
  drawPath(pathA, angles.find(a => a.label === 'A').color, 'rgba(255,255,255,0.05)', 3);

  // Labels
  drawText(bx - 12, by + 12, 'B');
  drawText(cx + 12, cy + 12, 'C');
  drawText(ax, ay - 18, 'A');
  
  // Render adjustable Vertex A handle
  const handleGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  handleGlow.setAttribute('cx', ax);
  handleGlow.setAttribute('cy', ay);
  handleGlow.setAttribute('r', '15');
  handleGlow.setAttribute('fill', 'rgba(6, 182, 212, 0.15)');
  handleGlow.setAttribute('style', 'cursor: grab;');
  if (svgDrawGroup) svgDrawGroup.appendChild(handleGlow);
  
  drawCircle(ax, ay, 7, '#fff', 'var(--accent-cyan)', 3);
  drawCircle(bx, by, 5, '#fff', 'var(--text-muted)', 2);
  drawCircle(cx, cy, 5, '#fff', 'var(--text-muted)', 2);
}

// --- Stage 4: Exterior Angle Theorem ---
function renderStage4() {
  if (svgDrawGroup) svgDrawGroup.innerHTML = '';
  
  const angleB = parseInt(document.getElementById('slider-s4-angB').value);
  const angleA = parseInt(document.getElementById('slider-s4-angA').value);
  const angleC_int = 180 - angleA - angleB;
  const angleC_ext = angleA + angleB;
  
  const bx = 80;
  const by = 260;
  const cx = 260;
  const cy = 260;
  
  const dx = 370;
  const dy = 260;
  
  const baseLen = cx - bx;
  const radA = angleA * Math.PI / 180;
  const radB = angleB * Math.PI / 180;
  const radC = angleC_int * Math.PI / 180;
  
  const side_c = baseLen * Math.sin(radC) / Math.sin(radA);
  const ax = bx + side_c * Math.cos(radB);
  const ay = by - side_c * Math.sin(radB);
  
  // Draw base triangle shape
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', `${bx},${by} ${ax},${ay} ${cx},${cy}`);
  polygon.setAttribute('fill', 'rgba(255,255,255,0.02)');
  polygon.setAttribute('stroke', 'rgba(255,255,255,0.05)');
  if (svgDrawGroup) svgDrawGroup.appendChild(polygon);
  
  // Base line with arrow marker representing Ray CD
  const baseRay = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  baseRay.setAttribute('x1', bx);
  baseRay.setAttribute('y1', by);
  baseRay.setAttribute('x2', dx);
  baseRay.setAttribute('y2', dy);
  baseRay.setAttribute('stroke', 'var(--text-muted)');
  baseRay.setAttribute('stroke-width', '2.5');
  baseRay.setAttribute('marker-end', 'url(#arrow)');
  if (svgDrawGroup) svgDrawGroup.appendChild(baseRay);
  
  // Draw other two sides of triangle
  drawLine(bx, by, ax, ay, 'var(--accent-blue)', 3);
  drawLine(cx, cy, ax, ay, 'var(--text-secondary)', 2.5);
  
  // Angle B arc
  const pathB = getAngleArcPath(bx, by, 30, -angleB, 0);
  drawPath(pathB, 'var(--accent-blue)', 'rgba(59, 130, 246, 0.15)', 3, 'angle-b-arc');
  
  // Angle A arc
  const radAB = Math.atan2(by - ay, bx - ax);
  const radAC = Math.atan2(cy - ay, cx - ax);
  const pathA = getAngleArcPath(ax, ay, 28, radAC*180/Math.PI, radAB*180/Math.PI);
  drawPath(pathA, 'var(--accent-purple)', 'rgba(168, 85, 247, 0.15)', 3, 'angle-a-arc');
  
  // Exterior Angle C arc
  const radCA = Math.atan2(ay - cy, ax - cx);
  const pathC_ext = getAngleArcPath(cx, cy, 32, radCA*180/Math.PI, 0);
  drawPath(pathC_ext, '#fb7185', 'rgba(251, 113, 133, 0.15)', 3.5, 'angle-c-ext-arc');
  
  // Label values
  drawText(bx + 40, by - 12, `${angleB}°`, '#60a5fa');
  drawText(ax, ay + 38, `${angleA}°`, '#c084fc');
  drawText(cx + 42, cy - 16, `${angleC_ext}°`, '#f87171');
  
  // Label text labels
  drawText(bx - 12, by + 12, 'B');
  drawText(cx - 10, cy + 15, 'C');
  drawText(ax, ay - 16, 'A');
  drawText(dx, dy + 15, 'D');
  
  // Draw nodes
  drawCircle(ax, ay, 5, '#fff', 'var(--accent-purple)', 2);
  drawCircle(bx, by, 5, '#fff', 'var(--accent-blue)', 2);
  drawCircle(cx, cy, 5, '#fff', 'var(--text-muted)', 2);
}

// --- Exterior Angle Theorem Peel Collage Animation ---
function animateExteriorAngleCollage() {
  const angleB = parseInt(document.getElementById('slider-s4-angB').value);
  const angleA = parseInt(document.getElementById('slider-s4-angA').value);
  
  const bx = 80, by = 260;
  const cx = 260, cy = 260;
  const baseLen = cx - bx;
  const radA = angleA * Math.PI / 180;
  const radB = angleB * Math.PI / 180;
  const radC = (180 - angleA - angleB) * Math.PI / 180;
  
  const side_c = baseLen * Math.sin(radC) / Math.sin(radA);
  const ax = bx + side_c * Math.cos(radB);
  const ay = by - side_c * Math.sin(radB);
  
  if (svgDrawGroup) {
    const oldPeeled = svgDrawGroup.querySelectorAll('.peeled-angle');
    oldPeeled.forEach(el => el.remove());
  }
  
  // 1. Create a cloned angle sector B to fly to C
  const sectorB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const pathB = getAngleArcPath(0, 0, 32, -angleB, 0);
  sectorB.setAttribute('d', pathB + ' L 0 0 Z');
  sectorB.setAttribute('fill', 'rgba(59, 130, 246, 0.45)');
  sectorB.setAttribute('stroke', 'var(--accent-blue)');
  sectorB.setAttribute('stroke-width', '2.5');
  sectorB.setAttribute('class', 'peeled-angle');
  
  sectorB.style.transform = `translate(${bx}px, ${by}px)`;
  if (svgDrawGroup) svgDrawGroup.appendChild(sectorB);
  
  // 2. Create a cloned angle sector A to fly to C
  const sectorA = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const radAC = Math.atan2(cy - ay, cx - ax);
  const pathA = getAngleArcPath(0, 0, 28, -angleA, 0);
  sectorA.setAttribute('d', pathA + ' L 0 0 Z');
  sectorA.setAttribute('fill', 'rgba(168, 85, 247, 0.45)');
  sectorA.setAttribute('stroke', 'var(--accent-purple)');
  sectorA.setAttribute('stroke-width', '2.5');
  sectorA.setAttribute('class', 'peeled-angle');
  
  sectorA.style.transform = `translate(${ax}px, ${ay}px) rotate(${radAC * 180 / Math.PI + 180}deg)`;
  if (svgDrawGroup) svgDrawGroup.appendChild(sectorA);
  
  sectorB.getBoundingClientRect();
  sectorA.getBoundingClientRect();
  
  // 3. Trigger flight animation
  sectorB.style.transform = `translate(${cx}px, ${cy}px) rotate(0deg)`;
  sectorA.style.transform = `translate(${cx}px, ${cy}px) rotate(${-angleB}deg)`;
}

// --- Stage 5: Quiz & Results ---
function renderStage5() {
  if (svgDrawGroup) svgDrawGroup.innerHTML = '';
  
  const trophy = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  trophy.setAttribute('transform', 'translate(100, 100)');
  
  // Pedestal
  const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  base.setAttribute('x', '60');
  base.setAttribute('y', '150');
  base.setAttribute('width', '80');
  base.setAttribute('height', '15');
  base.setAttribute('rx', '4');
  base.setAttribute('fill', 'var(--text-muted)');
  trophy.appendChild(base);
  
  // Stem
  const stem = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  stem.setAttribute('x', '94');
  stem.setAttribute('y', '100');
  stem.setAttribute('width', '12');
  stem.setAttribute('height', '50');
  stem.setAttribute('fill', '#d1d5db');
  trophy.appendChild(stem);
  
  // Cup Bowl
  const bowl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  bowl.setAttribute('d', 'M 60 40 Q 60 100 100 100 Q 140 100 140 40 Z');
  bowl.setAttribute('fill', 'url(#cup-gold-grad)');
  bowl.setAttribute('stroke', '#eab308');
  bowl.setAttribute('stroke-width', '2');
  trophy.appendChild(bowl);
  
  // Handles
  const hL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  hL.setAttribute('d', 'M 60 50 Q 40 50 45 75 Q 50 90 65 85');
  hL.setAttribute('fill', 'none');
  hL.setAttribute('stroke', '#eab308');
  hL.setAttribute('stroke-width', '4');
  trophy.appendChild(hL);
  
  const hR = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  hR.setAttribute('d', 'M 140 50 Q 160 50 155 75 Q 150 90 135 85');
  hR.setAttribute('fill', 'none');
  hR.setAttribute('stroke', '#eab308');
  hR.setAttribute('stroke-width', '4');
  trophy.appendChild(hR);
  
  if (svgDrawGroup) svgDrawGroup.appendChild(trophy);
  
  drawQuizStar(200, 80, 8);
  drawQuizStar(150, 120, 6);
  drawQuizStar(250, 130, 7);
  
  if (!document.getElementById('cup-gold-grad')) {
    const defs = geometrySvg.querySelector('defs');
    if (defs) {
      const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      grad.setAttribute('id', 'cup-gold-grad');
      grad.setAttribute('x1', '0%');
      grad.setAttribute('y1', '0%');
      grad.setAttribute('x2', '100%');
      grad.setAttribute('y2', '0%');
      
      const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      s1.setAttribute('offset', '0%');
      s1.setAttribute('stop-color', '#fbbf24');
      const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      s2.setAttribute('offset', '50%');
      s2.setAttribute('stop-color', '#fef08a');
      const s3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      s3.setAttribute('offset', '100%');
      s3.setAttribute('stop-color', '#ca8a04');
      
      grad.appendChild(s1);
      grad.appendChild(s2);
      grad.appendChild(s3);
      defs.appendChild(grad);
    }
  }
}

function drawQuizStar(cx, cy, r) {
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = (i * 36 * Math.PI) / 180;
    const curR = i % 2 === 0 ? r : r / 2.2;
    const x = cx + curR * Math.cos(rad - Math.PI/2);
    const y = cy + curR * Math.sin(rad - Math.PI/2);
    d += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
  }
  d += ' Z';
  star.setAttribute('d', d);
  star.setAttribute('fill', '#fde047');
  star.setAttribute('stroke', '#eab308');
  star.setAttribute('stroke-width', '1');
  if (svgDrawGroup) svgDrawGroup.appendChild(star);
}

// --- Quiz Validation Mechanism ---
function checkQuiz(qIdx, optionIdx, btnElement) {
  const answers = { 1: 1, 2: 2, 3: 1 };
  
  const correctOpt = answers[qIdx];
  const optionsContainer = btnElement.parentNode;
  const buttons = optionsContainer.querySelectorAll('.quiz-btn');
  const expCard = document.getElementById(`exp-q${qIdx}`);
  
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctOpt) {
      btn.classList.add('correct');
    } else if (idx === optionIdx) {
      btn.classList.add('incorrect');
    }
  });
  
  if (expCard) expCard.style.display = 'block';
  
  if (optionIdx === correctOpt) {
    createCanvasConfetti();
  }
}

function createCanvasConfetti() {
  for (let i = 0; i < 12; i++) {
    const rx = Math.random() * 200 + 100;
    const ry = Math.random() * 200 + 80;
    const starGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    starGlow.setAttribute('cx', rx);
    starGlow.setAttribute('cy', ry);
    starGlow.setAttribute('r', Math.random() * 4 + 2);
    starGlow.setAttribute('fill', 'none');
    starGlow.setAttribute('stroke', ['#67e8f9', '#c084fc', '#fde047', '#34d399'][Math.floor(Math.random()*4)]);
    starGlow.setAttribute('stroke-width', '2');
    starGlow.setAttribute('style', 'transition: all 1s ease-out; opacity: 1;');
    if (svgDrawGroup) svgDrawGroup.appendChild(starGlow);
    
    setTimeout(() => {
      starGlow.setAttribute('r', '20');
      starGlow.style.opacity = '0';
      setTimeout(() => starGlow.remove(), 1000);
    }, 50);
  }
}

// ==========================================
// SVG PRIMITIVE DRAWING UTILITIES
// ==========================================
function drawLine(x1, y1, x2, y2, color, width = 2, dash = '') {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', width);
  line.setAttribute('stroke-linecap', 'round');
  if (dash) {
    line.setAttribute('stroke-dasharray', dash);
  }
  if (svgDrawGroup) svgDrawGroup.appendChild(line);
  return line;
}

function drawCircle(cx, cy, r, fill, stroke, strokeWidth = 2) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', fill);
  circle.setAttribute('stroke', stroke);
  circle.setAttribute('stroke-width', strokeWidth);
  if (svgDrawGroup) svgDrawGroup.appendChild(circle);
  return circle;
}

function drawText(x, y, content, color = 'var(--text-primary)') {
  const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  txt.setAttribute('x', x);
  txt.setAttribute('y', y);
  txt.setAttribute('class', 'svg-text');
  txt.setAttribute('fill', color);
  txt.textContent = content;
  if (svgDrawGroup) svgDrawGroup.appendChild(txt);
  return txt;
}

function drawPath(d, stroke, fill = 'none', strokeWidth = 2, classId = '') {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', stroke);
  path.setAttribute('fill', fill);
  path.setAttribute('stroke-width', strokeWidth);
  if (classId) {
    path.setAttribute('id', classId);
  }
  if (svgDrawGroup) svgDrawGroup.appendChild(path);
  return path;
}

// --- Bulletproof Explicit Global Exposure for onclick Event Handlers ---
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.setGlobalStage = setGlobalStage;
window.checkQuiz = checkQuiz;
window.animateExteriorAngleCollage = animateExteriorAngleCollage;

/* The browser projects measured CSI values. STFT assets are computed offline. */
(() => {
  'use strict';
  const data = window.OCTOSENSE_CUBE_DATA;
  const $ = (selector) => document.querySelector(selector);
  const demo = $('.tensor-demo');
  const cubes = [$('#positional-cube'), $('#semantic-cube')];
  if (!data) {
    $('#stage-description').textContent = 'CSI visualization data unavailable';
    cubes.forEach(cube => { cube.disabled = true; });
    return;
  }

  const size = [66, 66, 48];
  const names = ['time', 'subc', 'rx'];
  const dims = data.displayShape;
  const frameCount = axis => Math.floor((data.shape[axis] - data.transform.n_fft) / data.transform.hop_length) + 1;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const models = new Map();
  const svgNS = 'http://www.w3.org/2000/svg';
  function color(value) {
    const t = clamp(value, 0, 1);
    const start = [223, 235, 242], end = [39, 91, 130];
    return `rgb(${start.map((v, i) => Math.round(v + (end[i] - v) * t)).join(',')})`;
  }
  // Six immutable textured planes form one rigid cuboid. Texture samples come
  // directly from the measured tensor; the animation never changes their values.
  function createModel(node) {
    const scene = document.createElement('span');
    scene.className = 'tensor-model-scene';
    scene.setAttribute('aria-hidden', 'true');
    const view = document.createElement('span');
    view.className = 'tensor-model-view';
    const body = document.createElement('span');
    body.className = 'tensor-model-body';
    for (let axis = 0; axis < 3; axis += 1) {
      const uAxis = axis === 0 ? 2 : 0;
      const vAxis = axis === 1 ? 2 : 1;
      for (const side of [-1, 1]) {
        const face = document.createElement('canvas');
        face.className = 'tensor-model-face';
        face.dataset.axis = names[axis];
        face.dataset.side = String(side);
        const width = size[uAxis] * 2, height = size[vAxis] * 2;
        face.width = width * 3;
        face.height = height * 3;
        face.style.width = `${width}px`;
        face.style.height = `${height}px`;
        face.style.marginLeft = `${-width / 2}px`;
        face.style.marginTop = `${-height / 2}px`;
        face.style.transform = axis === 0
          ? `translateX(${side * size[0]}px) rotateY(90deg)`
          : axis === 1
            ? `translateY(${side * size[1]}px) rotateX(90deg)`
            : `translateZ(${side * size[2]}px)`;
        const ctx = face.getContext('2d');
        for (let u = 0; u < dims[uAxis]; u += 1) {
          for (let v = 0; v < dims[vAxis]; v += 1) {
            const index = [0, 0, 0];
            index[axis] = side < 0 ? 0 : dims[axis] - 1;
            // rotateY(90deg) maps the face's horizontal direction to -z.
            index[uAxis] = axis === 0 ? dims[uAxis] - 1 - u : u;
            index[vAxis] = v;
            const value = data.values[(index[0] * dims[1] + index[1]) * dims[2] + index[2]];
            const x = u * face.width / dims[uAxis], y = v * face.height / dims[vAxis];
            const w = face.width / dims[uAxis], h = face.height / dims[vAxis];
            ctx.fillStyle = color(value);
            ctx.fillRect(x, y, w + .5, h + .5);
            ctx.strokeStyle = 'rgba(255,255,255,.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
          }
        }
        body.append(face);
      }
    }
    view.append(body);
    scene.append(view);
    const overlay = document.createElementNS(svgNS, 'svg');
    overlay.setAttribute('viewBox', '-150 -135 300 270');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.add('tensor-model-axes');
    const axes = names.map(name => {
      const group = document.createElementNS(svgNS, 'g');
      group.classList.add('volume-axis');
      group.dataset.axis = name;
      const elements = ['path', 'circle', 'rect', 'text'].map(tag => {
        const element = document.createElementNS(svgNS, tag);
        group.append(element);
        return element;
      });
      overlay.append(group);
      return {group, elements};
    });
    node.append(scene, overlay);
    const resize = new ResizeObserver(entries => {
      scene.style.setProperty('--model-scale', entries[0].contentRect.width / 300);
    });
    resize.observe(node);
    models.set(node, {body, axes});
  }
  // This quarter-turn illustrates the new layout by exchanging the two geometric
  // axis directions (one changes sign). It is a camera/model orientation, not a
  // numeric transpose or reversal: data.permute and the offline STFT assets define
  // the storage order. No squash, reflection, or depth interpolation is needed.
  function project(point, progress) {
    const angle = (-40 + progress * 90) * Math.PI / 180;
    const tilt = 58 * Math.PI / 180;
    const x = point[0] * Math.cos(angle) - point[1] * Math.sin(angle);
    const y = point[0] * Math.sin(angle) + point[1] * Math.cos(angle);
    return [x, y * Math.cos(tilt) - point[2] * Math.sin(tilt)];
  }
  function drawCube(node, progress, named, permuted) {
    const {body, axes} = models.get(node);
    body.style.transform = `rotateZ(${progress * 90}deg)`;
    // Positional guides belong to the storage frame; named guides follow the data.
    const axisProgress = named ? progress : 0;
    const accent = named ? '#137f7b' : permuted ? '#ad6a2b' : '#456887';
    axes.forEach(({group, elements: [path, circle, rect, text]}, axis) => {
      const start = axis === 2 ? [size[0] * 1.2, -size[1] * 1.2, -size[2]] : [size[0] * 1.2, size[1] * 1.2, -size[2] * 1.2];
      const end = [...start];
      if (axis === 2) end[2] = size[2];
      else { start[axis] = -size[axis]; end[axis] = size[axis]; }
      // rx is parallel to the rotation axis: keep its external guide clear of
      // the faces instead of projecting a corner that can pass behind the cube.
      const p = axis === 2 ? [110, 37] : project(start, axisProgress);
      const q = axis === 2 ? [110, -37] : project(end, axisProgress);
      const mid = p.map((v, i) => (v + q[i]) / 2);
      const radius = Math.hypot(...mid) || 1;
      const label = mid.map((v, i) => clamp(v + v / radius * 24, i ? -110 : -116, i ? 110 : 116));
      const slot = named && permuted && axis < 2 ? 1 - axis : axis;
      const isSelected = axis === 0;
      const stroke = isSelected ? accent : '#728a9d';
      group.classList.toggle('selected', isSelected);
      group.dataset.axis = names[!named && permuted && axis < 2 ? 1 - axis : axis];
      group.dataset.slot = String(slot);
      group.dataset.selected = String(isSelected);
      path.setAttribute('d', `M${p.join(',')}L${q.join(',')}`);
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', isSelected ? '4' : '1.2');
      circle.setAttribute('cx', q[0]); circle.setAttribute('cy', q[1]);
      circle.setAttribute('r', isSelected ? '4' : '2'); circle.setAttribute('fill', stroke);
      rect.setAttribute('x', label[0] - (named ? 31 : 17)); rect.setAttribute('y', label[1] - 15);
      rect.setAttribute('width', named ? '62' : '34'); rect.setAttribute('height', '30');
      rect.setAttribute('rx', '4'); rect.setAttribute('fill', isSelected ? accent : '#fff');
      text.setAttribute('x', label[0]); text.setAttribute('y', label[1] + 7);
      text.setAttribute('fill', isSelected ? '#fff' : '#405a70');
      text.textContent = named ? names[axis] : String(slot);
    });
  }
  cubes.forEach(createModel);

  let progress = 0;
  let frame = null;
  let settled = 0;
  let timer = null;
  let inView = false;
  let lastPermuted = null;
  function render(value) {
    progress = clamp(value, 0, 1);
    const permuted = settled === 1;
    // During the transition keep the previous computation. Process again at rest.
    drawCube($('#positional-cube'), progress, false, permuted);
    drawCube($('#semantic-cube'), progress, true, permuted);
    demo.dataset.progress = progress.toFixed(3);
    demo.dataset.stage = progress === 0 ? 'before' : progress === 1 ? 'after' : 'rolling';
    // Storage, selected dimension and spectrum change together at the endpoint.
    if (permuted !== lastPermuted) {
      lastPermuted = permuted;
      demo.dataset.layout = permuted ? 'subc,time,rx' : 'time,subc,rx';
      demo.dataset.selectedPositionAxis = permuted ? 'subc' : 'time';
      demo.dataset.selectedNamedAxis = 'time';
      $('#position-spectrum').src = `assets/spectrum-${permuted ? 'positional' : 'reference'}.png`;
      $('#position-spectrum').alt = permuted ? 'Actual STFT along subcarriers after the storage axes are permuted' : 'STFT along time of the same measured CSI sample';
      $('#position-spectrum-label').textContent = `${permuted ? 'subc' : 'time'} · ${frameCount(permuted ? 1 : 0)} frames`;
      $('#semantic-spectrum').closest('figure').querySelector('figcaption span').textContent = `time · ${frameCount(0)} frames`;
      $('#position-outcome').classList.toggle('changed', permuted);
      $('#position-outcome').innerHTML = permuted ? '<b aria-hidden="true">≠</b><span>Changed</span>' : '<b aria-hidden="true">=</b><span>Same spectrum</span>';
      $('#semantic-outcome').innerHTML = permuted ? '<b aria-hidden="true">=</b><span>Preserved</span>' : '<b aria-hidden="true">=</b><span>Same spectrum</span>';
      $('#position-readout').innerHTML = `<span class="selected-slot">0</span><span aria-hidden="true">→</span><span>${permuted ? 'subc' : 'time'}</span>`;
      $('#semantic-readout').innerHTML = `<span>time</span><span aria-hidden="true">→</span><span class="selected-slot">${permuted ? '1' : '0'}</span>`;
      $('#positional-cube').setAttribute('aria-label', `Rotate both cubes. Measured CSI storage order ${permuted ? 'subcarrier, time, receiver' : 'time, subcarrier, receiver'}. Fixed position zero selects ${permuted ? 'subcarrier' : 'time'}.`);
      $('#semantic-cube').setAttribute('aria-label', `Rotate both cubes. In the same CSI cube, time is selected by name at position ${permuted ? 'one' : 'zero'}.`);
    }
    const description = progress === 0
      ? 'Both methods select time and produce the same spectrum.'
      : progress === 1
        ? 'The axes have swapped. Fixed position zero selects subcarrier and changes the spectrum. Selecting time by name preserves the original spectrum.'
        : 'Axis permutation in progress. The spectrograms retain the previous computation until the new layout is complete.';
    if ($('#stage-description').textContent !== description) $('#stage-description').textContent = description;
  }
  function clearAutoTimer() {
    clearTimeout(timer);
    timer = null;
  }
  function scheduleAuto() {
    clearAutoTimer();
    if (inView && !document.hidden) timer = setTimeout(flip, 3000);
  }
  function setRolling(rolling) {
    cubes.forEach(cube => cube.setAttribute('aria-disabled', String(rolling)));
  }
  function flip() {
    if (frame !== null) return;
    clearAutoTimer();
    const from = settled;
    const target = 1 - settled;
    // The quarter-turn itself explains the axis change, so this bounded demo
    // retains its gentle motion independently of ambient motion preferences.
    const start = performance.now();
    setRolling(true);
    function tick(now) {
      const t = clamp((now - start) / 760, 0, 1);
      const eased = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      if (t === 1) settled = target;
      render(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        frame = null;
        setRolling(false);
      }
    }
    frame = requestAnimationFrame(tick);
    // Count the three-second cadence from each flip, including a manual click.
    scheduleAuto();
  }
  function settleMotion() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    settled = progress >= .5 ? 1 : 0;
    render(settled);
    setRolling(false);
  }
  cubes.forEach(cube => cube.addEventListener('click', flip));
  render(settled);
  demo.dataset.autoplay = 'true';
  const observer = new IntersectionObserver(entries => {
    inView = entries.some(entry => entry.isIntersecting);
    scheduleAuto();
  }, {threshold: .3});
  observer.observe(demo);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) settleMotion();
    scheduleAuto();
  });
})();

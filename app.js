/* Browser-only dataset and experiment presentation. */
(() => {
  'use strict';
  const content = window.OCTOSENSE_CONTENT;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function cycleSection(region, advance) {
    let timer = null;
    let visible = false;
    let hovered = region.matches(':hover');
    function schedule() {
      clearTimeout(timer);
      timer = null;
      if (!visible || hovered || document.hidden || region.querySelector(':focus-visible')) return;
      timer = setTimeout(() => {
        advance();
        schedule();
      }, 3000);
    }
    region.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = true;
      schedule();
    });
    region.addEventListener('pointerleave', () => {
      hovered = false;
      schedule();
    });
    region.addEventListener('focusin', schedule);
    region.addEventListener('focusout', () => queueMicrotask(schedule));
    region.addEventListener('click', schedule);
    document.addEventListener('visibilitychange', schedule);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }, {threshold:0.15}).observe(region);
  }

  function cube({named = true, permuted = false, selected = false, missing = false, color = '#2f5e9c', small = false} = {}) {
    const labels = small ? [] : (named ? (permuted ? ['subc', 'time', 'rx'] : ['time', 'subc', 'rx']) : ['0', '1', '2']);
    const selectedIndex = named && permuted ? 1 : 0;
    const positions = [{x:39,y:177,anchor:'end',path:'M75 145 40 166'}, {x:159,y:207,anchor:'middle',path:'M132 176 157 195'}, {x:214,y:105,anchor:'start',path:'M188 140 218 119'}];
    const semantics = permuted ? ['subc', 'time', 'rx'] : ['time', 'subc', 'rx'];
    const axes = labels.map((label, i) => {
      const p = positions[i];
      const isMissing = missing && named && label === 'time';
      const cls = selected && selectedIndex === i && !isMissing ? ' is-selected' : '';
      return `<g class="cube-axis-group" data-semantic="${semantics[i]}"><path class="cube-axis${cls}" d="${p.path}"${isMissing ? ' stroke-dasharray="3 3"' : ''}/><text class="cube-label${cls}" x="${p.x}" y="${p.y}" text-anchor="${p.anchor}">${isMissing ? '?' : escape(label)}</text>${named ? '' : `<text class="cube-meaning" x="${p.x}" y="${p.y + 14}" text-anchor="${p.anchor}">${semantics[i]}</text>`}</g>`;
    }).join('');
    return `<svg class="data-cube" viewBox="${small ? '62 40 135 142' : '5 35 250 185'}" role="img" aria-label="${small ? 'Sample tensor' : named ? 'Named tensor: ' + (missing ? 'time is missing' : labels.join(', ')) : 'Tensor axes 0, 1, 2'}"><g class="cube-solid" style="--cube-color:${color}"><path class="cube-face" d="M70 82 130 110 130 174 70 142Z" fill="${color}" fill-opacity=".13" style="stroke:${color}"/><path class="cube-face" d="M130 110 188 77 188 141 130 174Z" fill="${color}" fill-opacity=".25" style="stroke:${color}"/><path class="cube-face" d="M70 82 128 49 188 77 130 110Z" fill="${color}" fill-opacity=".07" style="stroke:${color}"/><g class="cube-grid" style="stroke:${color}"><path d="M85 89 85 150M100 96 100 158M115 103 115 166M70 97 130 126M70 112 130 142M70 127 130 158"/><path d="M145 101 145 166M159 93 159 157M174 85 174 149M130 126 188 93M130 142 188 109M130 158 188 125"/><path d="M85 89 143 56M100 96 158 63M115 103 173 70M85 74 145 101M100 65 159 93M114 57 174 85"/></g></g>${axes}</svg>`;
  }

  const modalityNames = {wifi:'Wi-Fi', mmwave:'mmWave', uwb:'UWB', rfid:'RFID', pwr:'Passive Wi-Fi radar'};
  let selectedDataset = 'widar3';
  let activeFilter = 'all';
  const selectedModalities = {};
  const sampleRecord = (id, modality) => window.OCTOSENSE_SAMPLES?.[id]?.[modality] || null;
  const fieldValue = value => typeof value === 'object' ? JSON.stringify(value) : String(value);

  function selectCard(id, modality) {
    const data = content.cards[id];
    const entry = content.datasets.find(dataset => dataset.id === id);
    const views = data.modalityViews;
    const selected = modality || (views[activeFilter]?.supported ? activeFilter : selectedModalities[id]) || Object.keys(views).find(key => views[key].supported);
    const view = views[selected];
    const sample = sampleRecord(id, selected);
    selectedDataset = id;
    selectedModalities[id] = selected;
    $$('.dataset-selector button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.card === id)));
    $('#dataset-card').style.borderTopColor = data.color;
    $('#card-id').textContent = data.id;
    $('#card-name').textContent = data.name;
    const inputs = Object.entries(views).map(([key, item]) => {
      const label = escape(item.label || modalityNames[key]);
      return `<button type="button" class="modality-input ${key}" data-modality="${key}" ${item.supported ? `aria-pressed="${key === selected}"` : `aria-disabled="true" aria-label="${label} · Coming soon"`}>${item.supported ? label : `<span class="modality-label">${label}</span><span class="modality-soon" aria-hidden="true">Coming soon</span>`}</button>`;
    }).join('');
    $('#card-fields').innerHTML = `<dt>Source</dt><dd><a href="${escape(data.url)}" target="_blank" rel="noopener noreferrer">${escape(data.source)} ↗</a></dd><dt>Size</dt><dd>${escape(entry.size)}</dd><dt>Inputs</dt><dd><div class="input-modalities" role="group" aria-label="Input modality">${inputs}</div><span class="input-detail">${escape(view.inputs)}</span></dd><dt>Variant</dt><dd><code>${escape(view.variant || data.variant)}</code></dd><dt>Targets</dt><dd>${escape(data.task)}</dd><dt>Schema</dt><dd><code>${escape(sample?.axes?.join(' · ') || view.axes)}</code></dd><dt>Protocols</dt><dd><code>${escape(view.protocols || data.protocols)}</code></dd>`;
    $$('.modality-input:not([aria-disabled=true])').forEach(button => button.addEventListener('click', () => {
      selectCard(id, button.dataset.modality);
      $(`.modality-input[data-modality="${button.dataset.modality}"]`).focus();
    }));
    $('#sample-record-heading').textContent = sample?.recordKind === 'source' ? 'Source recording' : 'Sample record';
    $('#sample-target-heading').textContent = sample?.recordKind === 'source' ? 'Source annotation' : 'Target / annotation';
    $('#sample-id').textContent = sample ? sample.sampleId : 'Sample record unavailable';
    $('#sample-id').title = sample ? sample.sampleId : '';
    $('#sample-binding').textContent = sample ? sample.binding : '';
    $('#record-fields').innerHTML = sample ? Object.entries(sample.fields).map(([key, value]) => {
      const gesture = id === 'widar3' && key === 'gesture_id';
      return `<span><strong>${escape(gesture ? 'gesture' : key)}</strong> ${escape(gesture ? sample.target.title : fieldValue(value))}</span>`;
    }).join('') : '';
    $('#sample-source').textContent = sample ? sample.source : '';
    $('#sample-source').title = sample ? sample.source : '';
    $('.sample-source').hidden = !sample?.source;
    $('#sample-axes').textContent = sample?.axes ? sample.axes.join(' · ') : 'Signal metadata unavailable';
    $('#sample-shape').textContent = sample?.shape ? `${sample.shape.join(' × ')}${sample.dtype ? ' · ' + sample.dtype : ''}` : 'Shape not recorded';
    $('#sample-physical').textContent = sample?.physical || '';
    $('#sample-target').textContent = sample ? sample.target.title : 'Annotation unavailable';
    $('#sample-target-description').textContent = sample ? sample.target.description : 'The sample record could not be loaded.';
    $('#sample-annotation').hidden = !sample?.target.value;
    $('#sample-annotation').open = false;
    $('#sample-annotation-value').textContent = sample?.target.value ? JSON.stringify(sample.target.value, null, 2) : '';
    $('#metadata-cube').innerHTML = cube({small:true,color:data.color});
  }
  $('.dataset-selector').innerHTML = content.datasets.map(data => `<button type="button" data-card="${escape(data.id)}" aria-pressed="false"><span class="dataset-name">${escape(data.name)}</span><small class="dataset-size">${escape(data.size)}</small></button>`).join('');
  $$('.dataset-selector button').forEach(button => button.addEventListener('click', () => selectCard(button.dataset.card)));
  $$('.filter-controls button').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    activeFilter = filter;
    $$('.filter-controls button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const visible = [];
    $$('.dataset-selector button').forEach(item => {
      item.hidden = filter !== 'all' && !Object.entries(content.cards[item.dataset.card].modalityViews).some(([key, view]) => (view.family || key) === filter);
      if (!item.hidden) visible.push(item.dataset.card);
    });
    if (visible.length) selectCard(visible.includes(selectedDataset) ? selectedDataset : visible[0]);
    $('.catalog-count').textContent = `${visible.length} dataset${visible.length === 1 ? '' : 's'}`;
    $('#coverage-status').textContent = `Showing ${visible.length} dataset${visible.length === 1 ? '' : 's'}${filter === 'all' ? '' : ' with ' + modalityNames[filter] + ' source signals'}.`;
  }));
  selectCard(selectedDataset);
  cycleSection($('#datasets'), () => {
    const cards = $$('.dataset-selector button').filter(button => !button.hidden);
    if (cards.length < 2) return;
    const current = cards.findIndex(button => button.dataset.card === selectedDataset);
    selectCard(cards[(current + 1) % cards.length].dataset.card);
  });

  const modelFamilies = content.modelFamilies;
  $('#model-count').textContent = `${modelFamilies.reduce((total, family) => total + family.models.length, 0)} models (more coming soon)`;
  $('#model-families').innerHTML = modelFamilies.map(family => `<details class="model-family" open><summary>${escape(family.name)}<small>${family.models.length}</small></summary><div class="model-family-entries">${family.models.map(id => `<code>${escape(id)}</code>`).join('')}</div></details>`).join('');

  const wifiSources = content.curation;
  let sourceIndex = 0;
  let sourceTimer = null;
  let pipelineVisible = false;
  $('#source-lanes').innerHTML = wifiSources.map(data => {
    const dataset = content.datasets.find(entry => entry.id === data.id);
    const schema = content.cards[data.id].modalityViews.wifi.axes;
    return `<button class="wifi-source" type="button" data-trace="${data.id}" aria-pressed="false" style="--source-color:${data.color};--source-bg:${data.background}"><span class="mini-cube" aria-hidden="true">${cube({small:true,color:data.color})}</span><span class="wifi-source-info"><strong>${escape(data.name)}</strong><span class="source-dataset-size">${escape(dataset.size)}</span><code>${escape(schema)}</code></span><span class="source-active-dot" aria-hidden="true"></span></button>`;
  }).join('');
  function selectSource(index) {
    sourceIndex = index;
    const data = wifiSources[index];
    $$('.wifi-source').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.trace === data.id)));
    $$('[data-source-line]').forEach(node => node.classList.toggle('is-active', node.dataset.sourceLine === data.id));
    $('.wifi-pipeline').style.setProperty('--active-source', data.color);
  }
  function scheduleSourceRotation() {
    clearTimeout(sourceTimer);
    if (!pipelineVisible || document.hidden) return;
    sourceTimer = setTimeout(() => {
      selectSource((sourceIndex + 1) % wifiSources.length);
      scheduleSourceRotation();
    }, 3000);
  }
  $$('.wifi-source').forEach((button, index) => button.addEventListener('click', () => {
    selectSource(index);
    scheduleSourceRotation();
  }));
  new IntersectionObserver(entries => {
    pipelineVisible = entries[0].isIntersecting;
    scheduleSourceRotation();
  }, {threshold:0.15}).observe($('.wifi-pipeline'));
  document.addEventListener('visibilitychange', scheduleSourceRotation);
  selectSource(0);

  let currentSpecField = 'dataset';
  let showFullSpec = false;
  function specText() { return showFullSpec ? content.specFull : content.specExcerpt; }
  function renderSpec() {
    let section = '';
    $('#spec-code').innerHTML = specText().split('\n').map((line, index) => {
      const match = line.match(/^([a-z_]+):/);
      if (match) section = match[1];
      const group = /\bsplit_scheme:/.test(line) ? 'split' : section;
      const highlighted = currentSpecField === group;
      const escaped = escape(line);
      const decorated = escaped.startsWith('    #') ? `<span class="small-text">${escaped}</span>` : escaped.replace(/^([\s-]*)([\w_]+)(:)(.*)$/, '$1<span class="yaml-key">$2</span>$3<span class="yaml-value">$4</span>');
      return `<span class="code-line${highlighted ? ' highlighted' : ''}" data-field="${group}"><span class="line-number" aria-hidden="true">${String(index + 1).padStart(2,'0')}</span>${decorated}</span>`;
    }).join('');
    $('#spec-explanation').textContent = content.specExplanations[currentSpecField];
    $('#toggle-spec').textContent = showFullSpec ? 'Show excerpt' : 'Show full spec';
    $('#toggle-spec').setAttribute('aria-expanded', String(showFullSpec));
    $('#copy-spec').textContent = showFullSpec ? 'Copy full spec' : 'Copy excerpt';
    $('#spec-code').setAttribute('aria-label', `Experiment specification ${showFullSpec ? 'full configuration' : 'excerpt'}`);
    $('#raw-spec-copy').hidden = true;
  }
  function selectSpec(key, automatic = false) {
    currentSpecField = key;
    $('#spec-explanation').setAttribute('aria-live', automatic ? 'off' : 'polite');
    $$('.spec-choices button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.spec === key)));
    renderSpec();
    if (showFullSpec) {
      const first = $('.code-line.highlighted', $('#spec-code'));
      if (first) $('#spec-code').scrollTop = Math.max(0, first.offsetTop - $('#spec-code').offsetTop - 20);
    }
  }
  $$('.spec-choices button').forEach(button => {
    button.addEventListener('click', () => selectSpec(button.dataset.spec));
  });
  $('#toggle-spec').addEventListener('click', () => { showFullSpec = !showFullSpec; renderSpec(); });
  $('#copy-spec').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(specText()); $('#copy-spec').textContent = 'Copied'; }
    catch {
      const raw = $('#raw-spec-copy');
      raw.hidden = false;
      raw.value = specText();
      raw.focus();
      raw.select();
      $('#copy-spec').textContent = 'Raw text selected';
    }
  });
  renderSpec();
  cycleSection($('#experiments'), () => {
    const fields = $$('.spec-choices button').map(button => button.dataset.spec);
    selectSpec(fields[(fields.indexOf(currentSpecField) + 1) % fields.length], true);
  });
})();

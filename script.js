(function(){
  "use strict";

  var DATA = GELETEK_DATA; // [{kelas, siswa:[{no, nama}]}]

  var TEAL = '#45E8D2';
  var VIOLET = '#8B7FFF';

  function isXII(kelas){ return kelas.indexOf('XII') === 0; }
  function slug(kelas){ return kelas.replace(/\s+/g,'').replace(/-/g,'').toLowerCase(); }

  /* ---------------- Hero stats ---------------- */
  function renderStats(){
    var totalSiswa = DATA.reduce(function(a,d){ return a + d.siswa.length; }, 0);
    var totalKelas = DATA.length;
    var jenjang = 2;
    var stats = [
      { num: totalKelas, label: 'Kelas Ampuan' },
      { num: totalSiswa, label: 'Total Siswa' },
      { num: jenjang, label: 'Jenjang (XI & XII)' }
    ];
    var wrap = document.getElementById('hero-stats');
    wrap.innerHTML = stats.map(function(s){
      return '<div class="stat"><span class="stat__num">' + s.num + '</span><span class="stat__label">' + s.label + '</span></div>';
    }).join('');
  }

  /* ---------------- Class grid ---------------- */
  function renderClassGrid(){
    var grid = document.getElementById('class-grid');
    grid.innerHTML = DATA.map(function(d, i){
      var xii = isXII(d.kelas);
      var idx = String(i+1).padStart(2,'0');
      return (
        '<button class="class-card" data-index="' + i + '" data-kelas="' + d.kelas + '">' +
          '<div class="class-card__top">' +
            '<span class="class-card__tag ' + (xii ? 'class-card__tag--xii' : '') + '">' + (xii ? 'KELAS XII' : 'KELAS XI') + '</span>' +
            '<span class="class-card__index">SIMPUL ' + idx + '</span>' +
          '</div>' +
          '<h3 class="class-card__name">' + d.kelas + '</h3>' +
          '<div class="class-card__foot">' +
            '<span><span class="class-card__count">' + d.siswa.length + '</span> siswa</span>' +
            '<span class="class-card__arrow">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    // hover glow position
    grid.querySelectorAll('.class-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      card.addEventListener('click', function(){
        openModal(parseInt(card.getAttribute('data-index'), 10));
      });
    });
  }

  /* ---------------- Network diagram ---------------- */
  function renderNetwork(){
    var svg = document.getElementById('network-svg');
    var cx = 300, cy = 300, r = 200;
    var n = DATA.length;
    var rotateDur = 46; // detik per satu putaran penuh — supaya tidak ada kelas yang "menetap" di atas
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var nodes = DATA.map(function(d, i){
      var angle = (-90 + i * (360 / n)) * Math.PI / 180;
      return {
        kelas: d.kelas,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        xii: isXII(d.kelas)
      };
    });

    var parts = [];

    parts.push(
      '<defs>' +
        '<radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" stop-color="' + TEAL + '" stop-opacity="0.9"/>' +
          '<stop offset="100%" stop-color="' + TEAL + '" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>'
    );

    // cincin luar statis, tetap di belakang rotor
    parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#1E2B42" stroke-width="1" stroke-dasharray="2 6"/>');

    // --- grup rotor: garis + pulsa + badge kelas berputar bersama ---
    parts.push('<g class="net-rotor">');
    if(!reduceMotion){
      parts.push(
        '<animateTransform attributeName="transform" type="rotate" ' +
        'from="0 ' + cx + ' ' + cy + '" to="360 ' + cx + ' ' + cy + '" ' +
        'dur="' + rotateDur + 's" repeatCount="indefinite"/>'
      );
    }

    nodes.forEach(function(node){
      parts.push(
        '<line class="net-line" x1="' + cx + '" y1="' + cy + '" x2="' + node.x + '" y2="' + node.y +
        '" stroke="' + (node.xii ? VIOLET : TEAL) + '" stroke-width="1.2" stroke-opacity="0.35"/>'
      );
    });

    nodes.forEach(function(node, i){
      parts.push(
        '<circle r="3" fill="' + (node.xii ? VIOLET : TEAL) + '">' +
          '<animateMotion dur="' + (3.2 + i*0.5) + 's" repeatCount="indefinite" ' +
            'path="M' + cx + ',' + cy + ' L' + node.x + ',' + node.y + '"/>' +
          '<animate attributeName="opacity" values="0;1;1;0" dur="' + (3.2 + i*0.5) + 's" repeatCount="indefinite"/>' +
        '</circle>'
      );
    });

    // badge kelas — masing-masing berputar balik di sekitar pusatnya sendiri agar label tetap tegak
    nodes.forEach(function(node){
      parts.push('<g>');
      if(!reduceMotion){
        parts.push(
          '<animateTransform attributeName="transform" type="rotate" ' +
          'from="0 ' + node.x + ' ' + node.y + '" to="-360 ' + node.x + ' ' + node.y + '" ' +
          'dur="' + rotateDur + 's" repeatCount="indefinite"/>'
        );
      }
      parts.push(
        '<circle cx="' + node.x + '" cy="' + node.y + '" r="26" fill="#0C111C" stroke="' + (node.xii ? VIOLET : TEAL) + '" stroke-width="1.6"/>' +
        '<text x="' + node.x + '" y="' + (node.y + 4) + '" text-anchor="middle" fill="#EAF2FF" font-family="JetBrains Mono, monospace" font-weight="600" font-size="11">' + node.kelas.replace(' - ','-') + '</text>'
      );
      parts.push('</g>');
    });

    parts.push('</g>'); // tutup rotor

    // inti — tetap diam di tengah, di luar rotor
    parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="70" fill="url(#coreGlow)" opacity="0.5"/>');
    parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="34" fill="#0C111C" stroke="' + TEAL + '" stroke-width="1.6"/>');
    parts.push(
      '<text x="' + cx + '" y="' + (cy - 3) + '" text-anchor="middle" fill="#EAF2FF" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="15">GELETEK</text>' +
      '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" fill="#5A6B8C" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1">CORE</text>'
    );

    svg.innerHTML = parts.join('');
  }

  /* ---------------- Modal ---------------- */
  var currentIndex = 0;
  var overlay, modalTitle, modalEyebrow, tbody, countEl, emptyEl, modalSearch, copyBtn, copyLabel;
  var currentVisibleList = [];
  var copyResetTimer = null;

  // random picker
  var tabList, tabPicker, panelList, panelPicker;
  var pickerStage, pickerPlaceholder, pickerNameEl, pickerSpinBtn, pickerResetBtn;
  var pickerNoRepeat, pickerPoolCount, pickerHistory;
  var pickedState = {}; // { classIndex: Set(no) }
  var isSpinning = false;
  var spinTimer = null;

  function highlight(text, query){
    if(!query) return escapeHtml(text);
    var idx = text.toUpperCase().indexOf(query.toUpperCase());
    if(idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) + '<mark>' + escapeHtml(text.slice(idx, idx+query.length)) + '</mark>' + escapeHtml(text.slice(idx+query.length));
  }
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function renderModalTable(query){
    var d = DATA[currentIndex];
    var q = (query || '').trim();
    var list = d.siswa.filter(function(s){
      return !q || s.nama.toUpperCase().indexOf(q.toUpperCase()) !== -1;
    });

    currentVisibleList = list;

    if(list.length === 0){
      tbody.innerHTML = '';
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
      tbody.innerHTML = list.map(function(s){
        return '<tr><td class="col-no">' + String(s.no).padStart(2,'0') + '</td><td class="col-nama">' + highlight(s.nama, q) + '</td></tr>';
      }).join('');
    }
    countEl.textContent = list.length + ' / ' + d.siswa.length + ' siswa';
    resetCopyState();
  }

  function buildCopyText(){
    var d = DATA[currentIndex];
    var lines = [
      'GELETEK — Daftar Siswa Kelas ' + d.kelas,
      'SMA Negeri 1 Baturetno — T.A. 2026/2027',
      ''
    ];
    currentVisibleList.forEach(function(s){
      lines.push(s.no + '. ' + s.nama);
    });
    return lines.join('\n');
  }

  function resetCopyState(){
    if(copyResetTimer) clearTimeout(copyResetTimer);
    if(copyBtn){
      copyBtn.classList.remove('is-copied');
      copyLabel.textContent = 'Salin Data';
    }
  }

  function copyClassData(){
    var text = buildCopyText();
    var done = function(){
      copyBtn.classList.add('is-copied');
      copyLabel.textContent = 'Tersalin ✓';
      if(copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(function(){
        copyBtn.classList.remove('is-copied');
        copyLabel.textContent = 'Salin Data';
      }, 1800);
    };
    var fail = function(){
      copyLabel.textContent = 'Gagal menyalin';
      copyResetTimer = setTimeout(function(){ copyLabel.textContent = 'Salin Data'; }, 1800);
    };

    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){
        fallbackCopy(text) ? done() : fail();
      });
    } else {
      fallbackCopy(text) ? done() : fail();
    }
  }

  function fallbackCopy(text){
    try{
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }catch(e){ return false; }
  }

  /* ---------------- Tab switching ---------------- */
  function switchTab(tab){
    var toPicker = (tab === 'picker');
    tabList.classList.toggle('is-active', !toPicker);
    tabPicker.classList.toggle('is-active', toPicker);
    tabList.setAttribute('aria-selected', String(!toPicker));
    tabPicker.setAttribute('aria-selected', String(toPicker));
    panelList.hidden = toPicker;
    panelPicker.hidden = !toPicker;
    if(toPicker) renderPicker();
  }

  /* ---------------- Random picker ---------------- */
  function getPickedSet(){
    if(!pickedState[currentIndex]) pickedState[currentIndex] = {};
    return pickedState[currentIndex];
  }

  function getPickerPool(){
    var d = DATA[currentIndex];
    var noRepeat = pickerNoRepeat.checked;
    if(!noRepeat) return d.siswa.slice();
    var picked = getPickedSet();
    return d.siswa.filter(function(s){ return !picked[s.no]; });
  }

  function renderPicker(){
    var d = DATA[currentIndex];
    var picked = getPickedSet();
    var pickedList = d.siswa.filter(function(s){ return picked[s.no]; });
    var pool = getPickerPool();

    pickerPoolCount.textContent = pickerNoRepeat.checked
      ? 'Sisa ' + pool.length + ' dari ' + d.siswa.length + ' siswa'
      : d.siswa.length + ' siswa dalam undian (pengulangan diperbolehkan)';

    pickerSpinBtn.disabled = isSpinning || (pickerNoRepeat.checked && pool.length === 0);
    pickerResetBtn.disabled = pickedList.length === 0;

    if(pickedList.length === 0){
      pickerHistory.innerHTML = '';
    } else {
      pickerHistory.innerHTML = pickedList
        .sort(function(a,b){ return picked[a.no] - picked[b.no]; })
        .map(function(s){
          return '<span class="picker__chip"><span class="picker__chip-no">' + String(s.no).padStart(2,'0') + '</span>' + escapeHtml(s.nama) + '</span>';
        }).join('');
    }

    if(pickerNoRepeat.checked && pool.length === 0 && pickedList.length > 0){
      pickerPlaceholder.hidden = false;
      pickerPlaceholder.textContent = 'Semua siswa sudah terpilih — tekan Reset untuk mengulang';
      pickerNameEl.hidden = true;
      pickerStage.classList.add('is-empty');
    }
  }

  function spinPicker(){
    if(isSpinning) return;
    var pool = getPickerPool();
    if(pool.length === 0) return;

    isSpinning = true;
    pickerSpinBtn.disabled = true;
    pickerStage.classList.remove('is-empty');
    pickerPlaceholder.hidden = true;
    pickerNameEl.hidden = false;
    pickerNameEl.classList.remove('is-landed');
    pickerNameEl.classList.add('is-spinning');

    var displayPool = DATA[currentIndex].siswa; // shuffle visual from full class for excitement
    var elapsed = 0;
    var totalDuration = 1100;
    var intervalDelay = 60;

    function tick(){
      var r = displayPool[Math.floor(Math.random() * displayPool.length)];
      pickerNameEl.textContent = r.nama;
      elapsed += intervalDelay;
      if(elapsed < totalDuration){
        intervalDelay = Math.min(intervalDelay + 12, 180);
        spinTimer = setTimeout(tick, intervalDelay);
      } else {
        landPicker(pool);
      }
    }
    tick();
  }

  function landPicker(pool){
    var winner = pool[Math.floor(Math.random() * pool.length)];
    pickerNameEl.textContent = winner.nama;
    pickerNameEl.classList.remove('is-spinning');
    pickerNameEl.classList.add('is-landed');

    var picked = getPickedSet();
    picked[winner.no] = Date.now();

    isSpinning = false;
    renderPicker();
  }

  function resetPicker(){
    pickedState[currentIndex] = {};
    pickerNameEl.hidden = true;
    pickerNameEl.classList.remove('is-landed', 'is-spinning');
    pickerPlaceholder.hidden = false;
    pickerPlaceholder.textContent = 'Tekan \u201cAcak Nama\u201d untuk mulai';
    pickerStage.classList.remove('is-empty');
    renderPicker();
  }

  function openModal(index){
    currentIndex = index;
    var d = DATA[index];
    modalEyebrow.textContent = (isXII(d.kelas) ? 'SIMPUL KELAS XII' : 'SIMPUL KELAS XI');
    modalTitle.textContent = d.kelas;
    modalSearch.value = '';
    renderModalTable('');
    switchTab('list');
    if(spinTimer) clearTimeout(spinTimer);
    isSpinning = false;
    pickerNameEl.hidden = true;
    pickerNameEl.classList.remove('is-landed', 'is-spinning');
    pickerPlaceholder.hidden = false;
    pickerStage.classList.remove('is-empty');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ modalSearch.focus(); }, 250);
  }

  function closeModal(){
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------------- Global search ---------------- */
  function renderGlobalSearch(query){
    var resultsEl = document.getElementById('global-search-results');
    var countEl = document.getElementById('global-search-count');
    var q = query.trim();

    if(q.length < 2){
      resultsEl.innerHTML = '<p class="search-hint">Ketik minimal 2 huruf untuk mulai mencari&hellip;</p>';
      countEl.textContent = '';
      return;
    }

    var matches = [];
    DATA.forEach(function(d){
      d.siswa.forEach(function(s){
        if(s.nama.toUpperCase().indexOf(q.toUpperCase()) !== -1){
          matches.push({ kelas: d.kelas, no: s.no, nama: s.nama });
        }
      });
    });

    countEl.textContent = matches.length + ' hasil';

    if(matches.length === 0){
      resultsEl.innerHTML = '<p class="search-empty">Tidak ditemukan siswa dengan nama tersebut.</p>';
      return;
    }

    resultsEl.innerHTML = matches.slice(0, 60).map(function(m, i){
      return (
        '<div class="result-row" style="animation-delay:' + Math.min(i*20,300) + 'ms">' +
          '<span class="result-row__no">' + String(m.no).padStart(2,'0') + '</span>' +
          '<span class="result-row__name">' + highlight(m.nama, q) + '</span>' +
          '<span class="result-row__class">' + m.kelas + '</span>' +
        '</div>'
      );
    }).join('');
  }

  /* ---------------- init ---------------- */
  function init(){
    renderStats();
    renderClassGrid();
    renderNetwork();

    overlay = document.getElementById('modal-overlay');
    modalTitle = document.getElementById('modal-title');
    modalEyebrow = document.getElementById('modal-eyebrow');
    tbody = document.getElementById('modal-tbody');
    countEl = document.getElementById('modal-count');
    emptyEl = document.getElementById('modal-empty');
    modalSearch = document.getElementById('modal-search');
    copyBtn = document.getElementById('modal-copy');
    copyLabel = document.getElementById('modal-copy-label');

    tabList = document.getElementById('tab-list');
    tabPicker = document.getElementById('tab-picker');
    panelList = document.getElementById('panel-list');
    panelPicker = document.getElementById('panel-picker');
    pickerStage = document.getElementById('picker-stage');
    pickerPlaceholder = document.getElementById('picker-placeholder');
    pickerNameEl = document.getElementById('picker-name');
    pickerSpinBtn = document.getElementById('picker-spin');
    pickerResetBtn = document.getElementById('picker-reset');
    pickerNoRepeat = document.getElementById('picker-no-repeat');
    pickerPoolCount = document.getElementById('picker-pool-count');
    pickerHistory = document.getElementById('picker-history');

    tabList.addEventListener('click', function(){ switchTab('list'); });
    tabPicker.addEventListener('click', function(){ switchTab('picker'); });
    pickerSpinBtn.addEventListener('click', spinPicker);
    pickerResetBtn.addEventListener('click', resetPicker);
    pickerNoRepeat.addEventListener('change', renderPicker);

    copyBtn.addEventListener('click', copyClassData);

    document.getElementById('modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeModal();
    });
    modalSearch.addEventListener('input', function(){
      renderModalTable(modalSearch.value);
    });

    var globalSearch = document.getElementById('global-search');
    globalSearch.addEventListener('input', function(){
      renderGlobalSearch(globalSearch.value);
    });
    renderGlobalSearch('');

    document.querySelectorAll('[data-scroll-target]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var el = document.getElementById(btn.getAttribute('data-scroll-target'));
        if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    var year = new Date().getFullYear();
    document.getElementById('year-now').textContent = 'Diperbarui ' + year;
    document.getElementById('footer-year').textContent = year;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

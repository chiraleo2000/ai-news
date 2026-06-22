/**
 * AI NEWS DAILY — 4-Column Topic Layout with Filters
 * Light Cyberpunk Theme
 */

(function () {
  'use strict';

  // ═══ Topic Classification Rules ═══
  const TOPIC_RULES = {
    'ai-trends': {
      keywords: ['LLM', 'GPT', 'Claude', 'AI-research', 'foundation-model', 'reasoning',
        'transformer', 'RLHF', 'fine-tuning', 'RAG', 'retrieval', 'embeddings',
        'training', 'benchmark', 'SOTA', 'open-source', 'open-weights',
        'entropy', 'reinforcement-learning', 'ColBERT', 'multimodal', 'NLP',
        'alignment', 'safety', 'model', 'paper', 'arxiv', 'research'],
      categories: ['Research'],
      topics: ['AI Research', 'AI Safety']
    },
    'tech-trends': {
      keywords: ['AI-tools', 'AI-product', 'coding', 'workflow', 'developer',
        'API', 'platform', 'software', 'automation', 'iOS', 'apple',
        'on-device', 'vanity-search', 'vector-search', 'tool', 'product',
        'app', 'feature', 'release', 'update', 'launch'],
      categories: [],
      topics: ['AI Tools', 'AI Products']
    },
    'thailand': {
      keywords: ['Thailand', 'Thai', 'ไทย', 'กรุงเทพ', 'Blognone', 'Beartai',
        'Techsauce', 'TechTalkThai', 'Thumbsup', 'DEPA', 'EEC',
        'Bangkok', 'NECTEC', 'ดีป้า', 'Sertis'],
      categories: ['Thai'],
      topics: []
    },
    'global': {
      keywords: ['AI-policy', 'AI-business', 'export-control', 'regulation',
        'talent', 'startup', 'investment', 'IPO', 'acquisition',
        'geopolitical', 'sovereignty', 'compliance', 'KYC',
        'policy', 'business', 'government', 'ban', 'crackdown'],
      categories: [],
      topics: ['AI Policy', 'AI Business']
    }
  };

  // ═══ State ═══
  let allPosts = [];
  let manifest = [];

  // ═══ DOM refs ═══
  const $dateSelect = document.getElementById('dateSelect');
  const $urgencyFilter = document.getElementById('urgencyFilter');
  const $sourceFilter = document.getElementById('sourceFilter');
  const $searchInput = document.getElementById('searchInput');
  const $filterCount = document.getElementById('filterCount');
  const $headerDate = document.getElementById('headerDate');
  const $headerCount = document.getElementById('headerCount');
  const $modal = document.getElementById('articleModal');
  const $modalBody = document.getElementById('modalBody');
  const $modalClose = document.getElementById('modalClose');

  const columns = {
    'ai-trends': document.getElementById('colAI'),
    'tech-trends': document.getElementById('colTech'),
    'thailand': document.getElementById('colThai'),
    'global': document.getElementById('colGlobal')
  };

  const counts = {
    'ai-trends': document.getElementById('countAI'),
    'tech-trends': document.getElementById('countTech'),
    'thailand': document.getElementById('countThai'),
    'global': document.getElementById('countGlobal')
  };

  // ═══ Init ═══
  async function init() {
    try {
      manifest = await fetchJSON('data/manifest.json');
      if (!manifest || manifest.length === 0) {
        showAllEmpty('No data available');
        return;
      }
      populateDateSelect(manifest);
      await loadDate(manifest[0]);
    } catch (err) {
      showAllEmpty('Failed to load: ' + err.message);
    }
    bindEvents();
  }

  // ═══ Data ═══
  async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function loadDate(filename) {
    showAllLoading();
    try {
      const data = await fetchJSON('data/' + filename);
      allPosts = (data.posts || []).map(p => ({
        ...p,
        _topic: classifyPost(p)
      }));
      $headerDate.textContent = data.date || filename.replace('_news.json', '');
      $headerCount.textContent = `${allPosts.length} articles`;
      populateSourceFilter(allPosts);
      renderColumns();
    } catch (err) {
      showAllEmpty('Error: ' + err.message);
    }
  }

  function populateDateSelect(files) {
    $dateSelect.innerHTML = '';
    files.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f.replace('_news.json', '');
      $dateSelect.appendChild(opt);
    });
  }

  function populateSourceFilter(posts) {
    const sources = [...new Set(posts.map(p => p.source_name).filter(Boolean))].sort();
    $sourceFilter.innerHTML = '<option value="all">ALL SOURCES</option>';
    sources.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      $sourceFilter.appendChild(opt);
    });
  }

  // ═══ Topic Classification ═══
  function classifyPost(post) {
    // Use pre-assigned topic_group if available
    if (post.topic_group && TOPIC_RULES[post.topic_group]) return post.topic_group;

    // Direct category match
    if (post.category === 'Thai') return 'thailand';

    const scores = { 'ai-trends': 0, 'tech-trends': 0, 'thailand': 0, 'global': 0 };

    for (const [topic, rules] of Object.entries(TOPIC_RULES)) {
      if (rules.categories.includes(post.category)) scores[topic] += 3;
      if (rules.topics.includes(post.topic)) scores[topic] += 3;

      const blob = [
        ...(post.tags || []),
        post.title || '',
        post.topic || '',
        post.source_name || ''
      ].join(' ').toLowerCase();

      for (const kw of rules.keywords) {
        if (blob.includes(kw.toLowerCase())) scores[topic]++;
      }
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : 'global';
  }

  // ═══ Filtering ═══
  function getFilteredPosts() {
    const urgency = $urgencyFilter.value;
    const source = $sourceFilter.value;
    const search = $searchInput.value.toLowerCase().trim();

    return allPosts.filter(p => {
      if (urgency !== 'all' && p.urgency !== urgency) return false;
      if (source !== 'all' && p.source_name !== source) return false;
      if (search) {
        const blob = [p.title, p.content, p.source_name, ...(p.tags || [])].join(' ').toLowerCase();
        if (!blob.includes(search)) return false;
      }
      return true;
    });
  }

  // ═══ Rendering ═══
  function renderColumns() {
    const filtered = getFilteredPosts();

    // Group by topic
    const groups = { 'ai-trends': [], 'tech-trends': [], 'thailand': [], 'global': [] };
    filtered.forEach(p => {
      const topic = p._topic || 'global';
      if (groups[topic]) groups[topic].push(p);
      else groups['global'].push(p);
    });

    // Render each column
    for (const [topic, posts] of Object.entries(groups)) {
      const col = columns[topic];
      const count = counts[topic];
      count.textContent = posts.length;

      if (posts.length === 0) {
        col.innerHTML = '<div class="column-empty">No articles match filters</div>';
      } else {
        col.innerHTML = '';
        posts.forEach(post => {
          col.appendChild(createBlogCard(post));
        });
      }
    }

    $filterCount.textContent = `${filtered.length} results`;
  }

  function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.setAttribute('data-urgency', post.urgency || 'low');

    const tags = (post.tags || []).slice(0, 3).map(t =>
      `<span class="card-tag">${esc(t)}</span>`
    ).join('');

    const breakthroughBadge = post.breakthrough_potential
      ? '<span class="card-badge breakthrough">★ BREAKTHROUGH</span>'
      : '';

    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-source">
          <span class="card-urgency-dot ${post.urgency || 'low'}"></span>
          ${esc(post.source_name || '')}
        </span>
        ${breakthroughBadge}
      </div>
      <h3 class="card-title">${esc(post.title)}</h3>
      <p class="card-excerpt">${esc(truncate(post.content || post.summary || '', 100))}</p>
      <div class="card-tags">${tags}</div>
    `;

    card.addEventListener('click', () => openModal(post));
    return card;
  }

  // ═══ Modal ═══
  function openModal(post) {
    const topic = post._topic || 'global';
    const topicLabels = {
      'ai-trends': 'AI TRENDS',
      'tech-trends': 'TECH TRENDS',
      'thailand': 'THAILAND AI & TECH',
      'global': 'GLOBAL AI & TECH'
    };

    const devActions = (post.actions_developer || []).map(a => `<li>${esc(a)}</li>`).join('');
    const bizActions = (post.actions_business || []).map(a => `<li>${esc(a)}</li>`).join('');
    const tags = (post.tags || []).map(t => `<span class="modal-tag">${esc(t)}</span>`).join('');
    const domains = (post.related_domains || []).map(d => `<span class="modal-tag">${esc(d)}</span>`).join('');

    $modalBody.innerHTML = `
      <span class="modal-topic-badge ${topic}">${topicLabels[topic]}</span>
      <h2 class="modal-title">${esc(post.title)}</h2>
      <div class="modal-meta">
        <span class="modal-meta-item">📰 ${esc(post.source_name || 'Unknown')}</span>
        <span class="modal-meta-item">⚡ ${(post.urgency || 'low').toUpperCase()}</span>
        <span class="modal-meta-item">📅 ${esc(post.published_at ? post.published_at.slice(0, 10) : '')}</span>
        ${post.breakthrough_potential ? '<span class="modal-meta-item">★ Breakthrough</span>' : ''}
      </div>

      <div class="modal-section">
        <div class="modal-section-title">CONTENT</div>
        <p class="modal-text">${esc(post.content || post.summary || '')}</p>
      </div>

      ${post.tech_impact ? `
      <div class="modal-section">
        <div class="modal-section-title">TECH IMPACT</div>
        <div class="modal-impact">${esc(post.tech_impact)}</div>
      </div>` : ''}

      ${devActions ? `
      <div class="modal-section">
        <div class="modal-section-title">DEVELOPER ACTIONS</div>
        <ul class="modal-actions-list">${devActions}</ul>
      </div>` : ''}

      ${bizActions ? `
      <div class="modal-section">
        <div class="modal-section-title">BUSINESS ACTIONS</div>
        <ul class="modal-actions-list">${bizActions}</ul>
      </div>` : ''}

      ${domains ? `
      <div class="modal-section">
        <div class="modal-section-title">RELATED DOMAINS</div>
        <div class="modal-tags">${domains}</div>
      </div>` : ''}

      ${tags ? `
      <div class="modal-section">
        <div class="modal-section-title">TAGS</div>
        <div class="modal-tags">${tags}</div>
      </div>` : ''}

      ${post.source_url ? `<a href="${esc(post.source_url)}" target="_blank" rel="noopener" class="modal-link">⟶ VIEW ORIGINAL SOURCE</a>` : ''}
    `;

    $modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ═══ UI States ═══
  function showAllLoading() {
    Object.values(columns).forEach(col => {
      col.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
    });
  }

  function showAllEmpty(msg) {
    Object.values(columns).forEach(col => {
      col.innerHTML = `<div class="column-empty">${esc(msg)}</div>`;
    });
  }

  // ═══ Events ═══
  function bindEvents() {
    $dateSelect.addEventListener('change', () => loadDate($dateSelect.value));
    $urgencyFilter.addEventListener('change', renderColumns);
    $sourceFilter.addEventListener('change', renderColumns);

    let searchTimeout;
    $searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(renderColumns, 250);
    });

    $modalClose.addEventListener('click', closeModal);
    $modal.addEventListener('click', (e) => { if (e.target === $modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  // ═══ Helpers ═══
  function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '…' : str;
  }

  // ═══ Boot ═══
  document.addEventListener('DOMContentLoaded', init);
})();

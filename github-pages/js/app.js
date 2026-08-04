/**
 * AI NEWS DAILY — 4-Column Topic Layout with Time Range Filter
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
      topics: ['AI Tools', 'AI Products', 'AI Product']
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
  let loadedData = {}; // session cache: filename -> posts array
  let cacheBust = String(Date.now());

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
      // Always re-fetch manifest (avoid stale CDN/browser cache missing today's file)
      cacheBust = String(Date.now());
      loadedData = {};
      manifest = await fetchJSON('data/manifest.json');
      if (!manifest || manifest.length === 0) {
        showAllEmpty('No data available');
        return;
      }
      const latest = getLatestManifestDate();
      if (latest) cacheBust = latest;
      // Keep HTML default (Last 3 Days) — covers early morning before today's digest exists
      await loadByRange($dateSelect.value);
    } catch (err) {
      showAllEmpty('Failed to load: ' + err.message);
    }
    bindEvents();
  }

  // ═══ Data ═══
  async function fetchJSON(path) {
    const sep = path.includes('?') ? '&' : '?';
    const url = path + sep + 'v=' + encodeURIComponent(cacheBust);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ═══ Date Range Logic ═══
  function getDateFromFilename(filename) {
    // Extract date string from "2026-06-24_news.json" → "2026-06-24"
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }

  function getToday() {
    // Local calendar date (avoid UTC day-shift for Asia/Bangkok etc.)
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function subtractDays(dateStr, days) {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() - days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** Prefer digest/news-file date, then published_at (YYYY-MM-DD). */
  function getNewsDate(post) {
    if (post._date && /^\d{4}-\d{2}-\d{2}/.test(post._date)) return post._date.slice(0, 10);
    if (post.published_at) return String(post.published_at).slice(0, 10);
    return '';
  }

  function compareNewsDateDesc(a, b) {
    const da = getNewsDate(a);
    const db = getNewsDate(b);
    if (da !== db) return db.localeCompare(da);
    const pa = String(a.published_at || '');
    const pb = String(b.published_at || '');
    return pb.localeCompare(pa);
  }

  function getLatestManifestDate() {
    for (const f of manifest) {
      const d = getDateFromFilename(f);
      if (d) return d;
    }
    return null;
  }

  /**
   * "Today" = clock date if that digest exists, otherwise the newest
   * digest in the manifest (so a just-published day always shows).
   */
  function getEffectiveToday() {
    const clock = getToday();
    if (manifest.some(f => getDateFromFilename(f) === clock)) return clock;
    return getLatestManifestDate() || clock;
  }

  function getFilesInRange(range) {
    const today = getEffectiveToday();

    if (range === 'all') {
      return manifest;
    }

    let startDate;
    if (range === 'today') {
      return manifest.filter(f => getDateFromFilename(f) === today);
    } else if (range === 'yesterday') {
      startDate = subtractDays(today, 1);
      return manifest.filter(f => getDateFromFilename(f) === startDate);
    } else {
      const days = parseInt(range, 10);
      startDate = subtractDays(today, days - 1);
    }

    return manifest.filter(f => {
      const d = getDateFromFilename(f);
      if (!d) return false;
      return d >= startDate && d <= today;
    });
  }

  async function loadByRange(range) {
    showAllLoading();
    try {
      const files = getFilesInRange(range);

      if (files.length === 0) {
        allPosts = [];
        updateHeader(range, 0);
        populateSourceFilter([]);
        renderColumns();
        return;
      }

      // Load all files in range (use cache)
      const results = await Promise.all(files.map(async (f) => {
        if (loadedData[f]) return loadedData[f];
        try {
          const data = await fetchJSON('data/' + f);
          const posts = (data.posts || []).map(p => ({
            ...p,
            _date: data.date || getDateFromFilename(f),
            _topic: classifyPost(p)
          }));
          loadedData[f] = posts;
          return posts;
        } catch (e) {
          return [];
        }
      }));

      allPosts = results.flat();
      // Latest digest/news date first within the overall list
      allPosts.sort(compareNewsDateDesc);

      updateHeader(range, allPosts.length);
      populateSourceFilter(allPosts);
      renderColumns();
    } catch (err) {
      showAllEmpty('Error: ' + err.message);
    }
  }

  function updateHeader(range, count) {
    const labels = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      '3': 'Last 3 Days',
      '7': 'Last 7 Days',
      '14': 'Last 14 Days',
      '30': 'Last 30 Days',
      'all': 'All News'
    };
    const effective = getEffectiveToday();
    const label = labels[range] || range;
    $headerDate.textContent = range === 'today' ? `${label} · ${effective}` : label;
    $headerCount.textContent = `${count} articles`;
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
    if (post.topic_group && TOPIC_RULES[post.topic_group]) return post.topic_group;
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
        const blob = [
          p.title,
          stripHtml(p.content || p.summary || ''),
          p.source_name,
          ...(p.tags || [])
        ].join(' ').toLowerCase();
        if (!blob.includes(search)) return false;
      }
      return true;
    });
  }

  // ═══ Rendering ═══
  function renderColumns() {
    const filtered = getFilteredPosts();

    const groups = { 'ai-trends': [], 'tech-trends': [], 'thailand': [], 'global': [] };
    filtered.forEach(p => {
      const topic = p._topic || 'global';
      if (groups[topic]) groups[topic].push(p);
      else groups['global'].push(p);
    });

    // Sort each topic: latest news/digest date on top (then published_at)
    for (const posts of Object.values(groups)) {
      posts.sort(compareNewsDateDesc);
    }

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

    const newsDate = getNewsDate(post);
    const dateLabel = newsDate ? `<span class="card-date">${esc(newsDate)}</span>` : '';
    const excerpt = truncate(stripHtml(post.content || post.summary || ''), 100);

    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-source">
          <span class="card-urgency-dot ${post.urgency || 'low'}"></span>
          ${esc(post.source_name || '')}
        </span>
        ${breakthroughBadge}
      </div>
      <h3 class="card-title">${esc(stripHtml(post.title || ''))}</h3>
      <p class="card-excerpt">${esc(excerpt)}</p>
      <div class="card-bottom-row">
        <div class="card-tags">${tags}</div>
        ${dateLabel}
      </div>
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

    const newsDate = getNewsDate(post);
    const pubDate = post.published_at ? String(post.published_at).slice(0, 10) : '';
    const dateMeta = newsDate
      ? (pubDate && pubDate !== newsDate ? `${newsDate} (pub ${pubDate})` : newsDate)
      : pubDate;

    $modalBody.innerHTML = `
      <span class="modal-topic-badge ${topic}">${topicLabels[topic]}</span>
      <h2 class="modal-title">${esc(stripHtml(post.title || ''))}</h2>
      <div class="modal-meta">
        <span class="modal-meta-item">📰 ${esc(post.source_name || 'Unknown')}</span>
        <span class="modal-meta-item">⚡ ${(post.urgency || 'low').toUpperCase()}</span>
        <span class="modal-meta-item">📅 ${esc(dateMeta)}</span>
        ${post.breakthrough_potential ? '<span class="modal-meta-item">★ Breakthrough</span>' : ''}
      </div>

      <div class="modal-section">
        <div class="modal-section-title">CONTENT</div>
        <p class="modal-text">${esc(stripHtml(post.content || post.summary || ''))}</p>
      </div>

      ${post.tech_impact ? `
      <div class="modal-section">
        <div class="modal-section-title">TECH IMPACT</div>
        <div class="modal-impact">${esc(stripHtml(post.tech_impact))}</div>
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
    $dateSelect.addEventListener('change', () => {
      $dateSelect.dataset.userPicked = '1';
      loadByRange($dateSelect.value);
    });
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
  function stripHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/\s+/g, ' ')
      .trim();
  }

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

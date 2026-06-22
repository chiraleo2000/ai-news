/**
 * AI NEWS DAILY — Main Application
 * Light Cyberpunk Theme | 4 Topic Categories
 */

(function () {
  'use strict';

  // ═══ Topic Classification ═══
  // Maps articles into 4 main topics based on their content/tags/category
  const TOPIC_RULES = {
    'ai-trends': {
      keywords: ['LLM', 'GPT', 'Claude', 'AI-research', 'foundation-model', 'reasoning',
        'transformer', 'RLHF', 'fine-tuning', 'RAG', 'retrieval', 'embeddings',
        'training', 'benchmark', 'SOTA', 'open-source', 'open-weights',
        'AI Research', 'AI Safety', 'entropy', 'reinforcement-learning',
        'ColBERT', 'agentic-AI', 'multimodal', 'NLP', 'alignment'],
      categories: ['Research'],
      topics: ['AI Research', 'AI Safety']
    },
    'tech-trends': {
      keywords: ['AI-tools', 'AI-product', 'AI Products', 'coding', 'workflow',
        'developer', 'API', 'platform', 'software', 'automation',
        'iOS', 'apple', 'on-device', 'vanity-search', 'vector-search'],
      categories: [],
      topics: ['AI Tools', 'AI Products']
    },
    'thailand': {
      keywords: ['Thailand', 'Thai', 'ไทย', 'กรุงเทพ', 'Blognone', 'Beartai',
        'Techsauce', 'TechTalkThai', 'Thumbsup', 'DEPA', 'EEC',
        'Bangkok', 'NECTEC', 'ดีป้า'],
      categories: ['Thai'],
      topics: []
    },
    'global': {
      keywords: ['AI-policy', 'AI-business', 'export-control', 'regulation',
        'talent', 'startup', 'investment', 'IPO', 'acquisition',
        'geopolitical', 'sovereignty', 'compliance', 'KYC',
        'anthropic', 'openai', 'google', 'meta', 'trump', 'policy'],
      categories: [],
      topics: ['AI Policy', 'AI Business']
    }
  };

  // ═══ State ═══
  let allPosts = [];
  let currentTopic = 'all';
  let manifest = [];

  // ═══ DOM Elements ═══
  const $grid = document.getElementById('articlesGrid');
  const $dateSelect = document.getElementById('dateSelect');
  const $modal = document.getElementById('articleModal');
  const $modalBody = document.getElementById('modalBody');
  const $modalClose = document.getElementById('modalClose');
  const $headerDate = document.getElementById('headerDate');
  const $headerCount = document.getElementById('headerCount');

  // ═══ Init ═══
  async function init() {
    try {
      manifest = await fetchJSON('data/manifest.json');
      if (!manifest || manifest.length === 0) {
        showEmpty('No data available yet');
        return;
      }
      populateDateSelect(manifest);
      await loadDate(manifest[0]);
    } catch (err) {
      showEmpty('Failed to load data: ' + err.message);
    }

    bindEvents();
  }

  // ═══ Data Loading ═══
  async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return res.json();
  }

  async function loadDate(filename) {
    showLoading();
    try {
      const data = await fetchJSON('data/' + filename);
      allPosts = data.posts || [];
      updateHeader(data.date, allPosts.length);
      updateStats(allPosts);
      renderArticles();
    } catch (err) {
      showEmpty('Error loading ' + filename);
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

  // ═══ Topic Classification ═══
  function classifyPost(post) {
    // Direct category match (Thai)
    if (post.category === 'Thai') return 'thailand';

    // Score each topic
    const scores = { 'ai-trends': 0, 'tech-trends': 0, 'thailand': 0, 'global': 0 };

    for (const [topic, rules] of Object.entries(TOPIC_RULES)) {
      // Check category
      if (rules.categories.includes(post.category)) scores[topic] += 3;

      // Check topic field
      if (rules.topics.includes(post.topic)) scores[topic] += 3;

      // Check tags
      const postTags = (post.tags || []).join(' ').toLowerCase();
      const postTitle = (post.title || '').toLowerCase();
      const postContent = (post.content || '').toLowerCase();
      const combined = postTags + ' ' + postTitle + ' ' + postContent;

      for (const kw of rules.keywords) {
        if (combined.includes(kw.toLowerCase())) scores[topic] += 1;
      }
    }

    // Return highest scoring topic
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : 'global';
  }

  // ═══ Rendering ═══
  function renderArticles() {
    const filtered = currentTopic === 'all'
      ? allPosts
      : allPosts.filter(p => classifyPost(p) === currentTopic);

    if (filtered.length === 0) {
      showEmpty('No articles in this category');
      return;
    }

    $grid.innerHTML = '';
    filtered.forEach((post, idx) => {
      const card = createCard(post, idx);
      $grid.appendChild(card);
    });
  }

  function createCard(post, idx) {
    const topic = classifyPost(post);
    const card = document.createElement('article');
    card.className = 'article-card';
    card.setAttribute('data-topic-color', topic);
    card.setAttribute('data-index', idx);

    const urgencyClass = `badge-urgency-${post.urgency || 'low'}`;
    const tags = (post.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');

    card.innerHTML = `
      <div class="card-header">
        <div class="card-badges">
          <span class="badge badge-topic">${topicLabel(topic)}</span>
          <span class="badge ${urgencyClass}">${(post.urgency || 'low').toUpperCase()}</span>
        </div>
      </div>
      <h3 class="card-title">${escapeHtml(post.title)}</h3>
      <p class="card-summary">${escapeHtml(truncate(post.content || post.summary || '', 150))}</p>
      <div class="card-footer">
        <span class="card-source">${escapeHtml(post.source_name || '')}</span>
        <div class="card-tags">${tags}</div>
      </div>
    `;

    card.addEventListener('click', () => openModal(post, topic));
    return card;
  }

  function topicLabel(topic) {
    const labels = {
      'ai-trends': 'AI TRENDS',
      'tech-trends': 'TECH TRENDS',
      'thailand': 'THAILAND',
      'global': 'GLOBAL'
    };
    return labels[topic] || 'NEWS';
  }

  // ═══ Modal ═══
  function openModal(post, topic) {
    const devActions = (post.actions_developer || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    const bizActions = (post.actions_business || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    const tags = (post.tags || []).map(t => `<span class="badge badge-topic">${t}</span>`).join(' ');

    $modalBody.innerHTML = `
      <h2 class="modal-title">${escapeHtml(post.title)}</h2>
      <div class="modal-meta">
        <span class="badge badge-topic">${topicLabel(topic)}</span>
        <span class="badge badge-source">${escapeHtml(post.source_name || '')}</span>
        <span class="badge badge-urgency-${post.urgency || 'low'}">${(post.urgency || 'low').toUpperCase()}</span>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">CONTENT</div>
        <p class="modal-content-text">${escapeHtml(post.content || post.summary || '')}</p>
      </div>

      ${post.tech_impact ? `
      <div class="modal-section">
        <div class="modal-section-title">TECH IMPACT</div>
        <div class="modal-impact">${escapeHtml(post.tech_impact)}</div>
      </div>
      ` : ''}

      ${devActions ? `
      <div class="modal-section">
        <div class="modal-section-title">DEVELOPER ACTIONS</div>
        <ul class="modal-actions">${devActions}</ul>
      </div>
      ` : ''}

      ${bizActions ? `
      <div class="modal-section">
        <div class="modal-section-title">BUSINESS ACTIONS</div>
        <ul class="modal-actions">${bizActions}</ul>
      </div>
      ` : ''}

      <div class="modal-section">
        <div class="modal-section-title">TAGS</div>
        <div>${tags || '<span class="tag">—</span>'}</div>
      </div>

      ${post.source_url ? `<a href="${escapeHtml(post.source_url)}" target="_blank" rel="noopener" class="modal-link">⟶ VIEW ORIGINAL SOURCE</a>` : ''}
    `;

    $modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ═══ UI Updates ═══
  function updateHeader(date, count) {
    $headerDate.textContent = date || '—';
    $headerCount.textContent = `${count} articles`;
  }

  function updateStats(posts) {
    const stats = { total: posts.length, ai: 0, tech: 0, thai: 0, global: 0 };
    posts.forEach(p => {
      const t = classifyPost(p);
      if (t === 'ai-trends') stats.ai++;
      else if (t === 'tech-trends') stats.tech++;
      else if (t === 'thailand') stats.thai++;
      else stats.global++;
    });
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statAI').textContent = stats.ai;
    document.getElementById('statTech').textContent = stats.tech;
    document.getElementById('statThai').textContent = stats.thai;
    document.getElementById('statGlobal').textContent = stats.global;
  }

  function showLoading() {
    $grid.innerHTML = `
      <div class="loading-state">
        <div class="loader"></div>
        <p>INITIALIZING DATA STREAM...</p>
      </div>`;
  }

  function showEmpty(msg) {
    $grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◇</div>
        <p>${escapeHtml(msg)}</p>
      </div>`;
  }

  // ═══ Events ═══
  function bindEvents() {
    // Topic tabs
    document.querySelectorAll('.topic-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTopic = tab.dataset.topic;
        renderArticles();
      });
    });

    // Date selector
    $dateSelect.addEventListener('change', () => {
      loadDate($dateSelect.value);
    });

    // Modal
    $modalClose.addEventListener('click', closeModal);
    $modal.addEventListener('click', (e) => {
      if (e.target === $modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ═══ Helpers ═══
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '…' : str;
  }

  // ═══ Boot ═══
  document.addEventListener('DOMContentLoaded', init);
})();

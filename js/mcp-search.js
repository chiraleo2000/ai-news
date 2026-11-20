/**
 * Archive search panel — NOT chat.
 * Primary: search published news JSON in the browser (works on GitHub Pages offline of MCP).
 * Optional: if AI News MCP (:8789 search_rag) is reachable via tunnel, prefer that.
 */
(() => {
  const els = {
    form: document.getElementById("mcp-search-form"),
    input: document.getElementById("mcp-search-q"),
    topic: document.getElementById("mcp-search-topic"),
    submit: document.getElementById("mcp-search-submit"),
    clear: document.getElementById("mcp-search-clear"),
    status: document.getElementById("mcp-search-status"),
    results: document.getElementById("mcp-search-results"),
  };

  let bound = false;
  let rpcId = 10;
  let archiveCache = null;

  function setStatus(text) {
    if (els.status) els.status.textContent = text || "";
  }

  function esc(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function norm(s) {
    return String(s ?? "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  async function loadArchivePosts() {
    if (archiveCache) return archiveCache;
    // Prefer posts already loaded by the news app / GraphRAG
    const fromApp = window.NewsApp?.getPosts?.() || window.GraphRag?._posts || null;
    if (Array.isArray(fromApp) && fromApp.length) {
      archiveCache = fromApp;
      return archiveCache;
    }
    const posts = [];
    try {
      const manRes = await fetch(`data/manifest.json?t=${Date.now()}`, { cache: "no-store" });
      if (manRes.ok) {
        const man = await manRes.json();
        const dates = Array.isArray(man?.dates)
          ? man.dates
          : Array.isArray(man?.files)
            ? man.files.map((f) => String(f).replace(/_news\.json$/i, ""))
            : [];
        const recent = dates.slice(0, 40);
        for (const d of recent) {
          const day = String(d).slice(0, 10);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
          try {
            const r = await fetch(`data/${day}_news.json?t=${Date.now()}`, { cache: "no-store" });
            if (!r.ok) continue;
            const body = await r.json();
            const list = Array.isArray(body?.posts) ? body.posts : Array.isArray(body?.articles) ? body.articles : [];
            for (const p of list) {
              posts.push({
                id: p.id,
                date: p.date || body.date || day,
                title: p.title || "",
                topic: p.topic || p.topic_group || "",
                agency: p.agency || p.source || "",
                excerpt: String(p.content || p.summary || p.excerpt || "").slice(0, 220),
                topic_group: p.topic_group || p.topic || "",
                _hay: [p.title, p.topic, p.content, p.summary, ...(p.tags || [])].join(" "),
              });
            }
          } catch {
            /* skip day */
          }
        }
      }
    } catch {
      /* ignore */
    }
    archiveCache = posts;
    return archiveCache;
  }

  function searchLocal(q, topic, limit = 12) {
    const nq = norm(q);
    const nt = norm(topic);
    const tokens = nq.split(" ").filter(Boolean);
    const scored = [];
    for (const p of archiveCache || []) {
      if (nt) {
        const tg = norm(p.topic_group || p.topic || "");
        if (!tg.includes(nt) && !nt.includes(tg)) continue;
      }
      const hay = norm(p._hay || `${p.title} ${p.excerpt} ${p.topic}`);
      let score = 0;
      const matched = [];
      for (const t of tokens) {
        if (!t) continue;
        if (norm(p.title).includes(t)) {
          score += 5;
          matched.push("title");
        }
        if (hay.includes(t)) {
          score += 2;
          matched.push("body");
        }
      }
      if (score <= 0) continue;
      scored.push({
        id: p.id,
        date: p.date,
        title: p.title,
        agency: p.agency,
        topic: p.topic,
        excerpt: p.excerpt,
        score,
        matched_fields: [...new Set(matched)],
      });
    }
    scored.sort((a, b) => b.score - a.score || String(b.date).localeCompare(String(a.date)));
    const posts = scored.slice(0, limit);
    return { matched: scored.length, posts, source: "local-archive" };
  }

  async function callTool(name, args) {
    const endpoints = await window.NewsConnect.resolve();
    if (!endpoints.ok) throw new Error(endpoints.reason || "ยังไม่มี MCP endpoint");
    const res = await fetch(endpoints.mcp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: ++rpcId,
        method: "tools/call",
        params: { name, arguments: args },
      }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const line = text.split("\n").find((l) => l.startsWith("data:"));
      data = line ? JSON.parse(line.slice(5).trim()) : null;
    }
    if (!data) throw new Error("MCP ตอบกลับไม่ใช่ JSON");
    if (data.error) throw new Error(data.error.message || "MCP error");
    const content = data?.result?.content;
    if (Array.isArray(content) && content[0]?.text) {
      return JSON.parse(content[0].text);
    }
    return data.result || data;
  }

  function renderHits(payload, q) {
    const posts = Array.isArray(payload?.posts) ? payload.posts : [];
    if (!els.results) return;
    if (!posts.length) {
      els.results.innerHTML = `<p class="muted">ไม่พบผลสำหรับ “${esc(q)}”</p>`;
      return;
    }
    els.results.innerHTML = posts
      .map((p) => {
        const score = p.score != null ? `<span class="mcp-score">score ${esc(p.score)}</span>` : "";
        const fields =
          Array.isArray(p.matched_fields) && p.matched_fields.length
            ? `<span class="mcp-fields">${esc(p.matched_fields.join(", "))}</span>`
            : "";
        return `<article class="mcp-hit" data-id="${esc(p.id)}">
          <div class="mcp-hit-top">
            <span class="mcp-hit-meta">${esc(p.date || "")} · ${esc(p.agency || p.topic || "")}</span>
            ${score}
          </div>
          <h3 class="mcp-hit-title">${esc(p.title || p.id)}</h3>
          <p class="mcp-hit-excerpt">${esc(p.excerpt || "")}</p>
          <div class="mcp-hit-bottom">${fields}<code>${esc(p.id || "")}</code></div>
        </article>`;
      })
      .join("");
  }

  async function runSearch(ev) {
    ev?.preventDefault?.();
    const q = String(els.input?.value || "").trim();
    if (!q) {
      setStatus("พิมพ์คำค้นก่อน");
      return;
    }
    const topic = String(els.topic?.value || "").trim();
    setStatus("กำลังค้นคลังข่าว…");
    if (els.results) els.results.innerHTML = `<p class="muted">ค้นหา…</p>`;

    // Always prepare local archive (Pages-safe, no chat)
    await loadArchivePosts();
    let payload = searchLocal(q, topic, 12);
    let via = "คลังในหน้า (local)";

    try {
      const mcpPayload = await callTool("search_rag", {
        q,
        limit: 12,
        ...(topic ? { topic_group: topic } : {}),
      });
      if (Array.isArray(mcpPayload?.posts) && mcpPayload.posts.length) {
        payload = { ...mcpPayload, source: "mcp-search_rag" };
        via = "MCP search_rag · :8789";
      }
    } catch {
      // MCP optional — local archive already filled results
    }

    renderHits(payload, q);
    const n = payload?.matched ?? payload?.posts?.length ?? 0;
    setStatus(`พบ ${n} · แสดง ${(payload?.posts || []).length} · ${via} (ไม่ใช่แชท)`);
  }

  function clearSearch() {
    if (els.input) els.input.value = "";
    if (els.topic) els.topic.value = "";
    if (els.results) els.results.innerHTML = "";
    setStatus("");
  }

  function bind() {
    if (bound) return;
    bound = true;
    els.form?.addEventListener("submit", runSearch);
    els.submit?.addEventListener("click", runSearch);
    els.clear?.addEventListener("click", clearSearch);
  }

  window.McpRagSearch = { bind, runSearch, clearSearch, loadArchivePosts };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();

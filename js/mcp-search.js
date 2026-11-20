/**
 * MCP RAG search panel — calls tools/call search_rag (fallback list_posts).
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
      // SSE-ish: take first data: line
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
        const fields = Array.isArray(p.matched_fields) && p.matched_fields.length
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
    setStatus("กำลังค้นผ่าน MCP…");
    if (els.results) els.results.innerHTML = `<p class="muted">ค้นหา…</p>`;
    try {
      let payload;
      try {
        payload = await callTool("search_rag", {
          q,
          limit: 12,
          ...(topic ? { topic_group: topic } : {}),
        });
      } catch (err) {
        // Older tunnel without search_rag
        payload = await callTool("list_posts", { q, limit: 12 });
        setStatus(`ใช้ list_posts (fallback) · ${err.message}`);
      }
      renderHits(payload, q);
      const n = payload?.matched ?? payload?.posts?.length ?? 0;
      setStatus(`พบ ${n} รายการ · แสดง ${(payload?.posts || []).length}`);
    } catch (err) {
      setStatus(err.message || "ค้นหาไม่สำเร็จ");
      if (els.results) {
        els.results.innerHTML = `<p class="muted">เชื่อมต่อ MCP ไม่ได้ — เปิดแท็บ เชื่อมต่อ / MCP หรือรัน <code>node mcp/server.mjs</code></p>`;
      }
    }
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

  window.McpRagSearch = { bind, runSearch, clearSearch };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();

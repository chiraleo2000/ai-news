/**
 * AI News Pages — tab router for รายการข่าว / ข้อมูลกราฟ / เชื่อมต่อ MCP
 */
(() => {
  const els = {
    tabNews: document.getElementById("tab-news"),
    tabBrain: document.getElementById("tab-brain"),
    tabConnect: document.getElementById("tab-connect"),
    viewNews: document.getElementById("view-news"),
    viewBrain: document.getElementById("view-brain"),
    viewConnect: document.getElementById("view-connect"),
    connectBase: document.getElementById("connect-public-base"),
    connectLlm: document.getElementById("connect-llm-url"),
    connectMcp: document.getElementById("connect-mcp-url"),
    connectStatus: document.getElementById("connect-status"),
    connectReply: document.getElementById("connect-llm-reply"),
  };

  let connectBound = false;

  function parseHash() {
    const raw = (location.hash || "").replace(/^#\/?/, "").toLowerCase();
    if (raw.startsWith("brain") || raw.startsWith("graph")) return "brain";
    if (raw.startsWith("connect") || raw.startsWith("mcp")) return "connect";
    return "news";
  }

  function setHash(tab) {
    const next =
      tab === "brain" ? "#/brain" : tab === "connect" ? "#/connect" : "#/news";
    if (location.hash !== next) location.hash = next;
    else applyTab(tab);
  }

  function setActiveTab(tab) {
    els.tabNews?.classList.toggle("is-active", tab === "news");
    els.tabBrain?.classList.toggle("is-active", tab === "brain");
    els.tabConnect?.classList.toggle("is-active", tab === "connect");
    document.body.classList.toggle("is-brain", tab === "brain");
    document.body.classList.toggle("is-connect", tab === "connect");
    if (els.viewNews) els.viewNews.hidden = tab !== "news";
    if (els.viewBrain) els.viewBrain.hidden = tab !== "brain";
    if (els.viewConnect) els.viewConnect.hidden = tab !== "connect";
  }

  async function refreshConnectPanel() {
    if (!window.NewsConnect) return;
    const saved = window.NewsConnect.load();
    if (els.connectBase) els.connectBase.value = saved.publicBase || "";
    const ep = await window.NewsConnect.resolve();
    if (els.connectLlm) els.connectLlm.textContent = ep.llm || "—";
    if (els.connectMcp) els.connectMcp.textContent = ep.mcp || "—";
    if (els.connectStatus) {
      els.connectStatus.textContent = ep.ok
        ? `พร้อมใช้ · แหล่ง=${ep.source} · model=${ep.model || window.NewsConnect.model}`
        : ep.reason || "ยังไม่พร้อม";
    }
  }

  function bindConnect() {
    if (connectBound) return;
    connectBound = true;
    document.getElementById("connect-save")?.addEventListener("click", async () => {
      window.NewsConnect?.save({ publicBase: els.connectBase?.value || "" });
      await refreshConnectPanel();
      if (els.connectStatus) els.connectStatus.textContent += " · บันทึกแล้ว";
    });
    document.getElementById("connect-test")?.addEventListener("click", async () => {
      if (!window.NewsConnect) return;
      if (els.connectStatus) els.connectStatus.textContent = "กำลังทดสอบ MCP…";
      const result = await window.NewsConnect.testMcp();
      if (els.connectStatus) {
        els.connectStatus.textContent = result.ok
          ? `MCP ผ่าน · ${result.message || "ok"}`
          : `MCP ไม่ผ่าน · ${result.message || result.reason || "fail"}`;
      }
    });
    document.getElementById("connect-test-llm")?.addEventListener("click", async () => {
      if (!window.NewsConnect) return;
      if (els.connectStatus) els.connectStatus.textContent = "กำลังทดสอบ LLM…";
      if (els.connectReply) {
        els.connectReply.hidden = true;
        els.connectReply.textContent = "";
      }
      const result = await window.NewsConnect.testLlm();
      if (els.connectStatus) {
        els.connectStatus.textContent = result.ok
          ? `LLM ผ่าน · ${result.message || "ok"}`
          : `LLM ไม่ผ่าน · ${result.message || result.reason || "fail"}`;
      }
      if (result.ok && result.text && els.connectReply) {
        els.connectReply.hidden = false;
        els.connectReply.textContent = result.text;
      }
    });
  }

  async function applyTab(tab) {
    setActiveTab(tab);
    if (tab === "brain") {
      if (window.BrainGraph?.show) {
        await window.BrainGraph.show({ crimeType: "", mode: "all" });
      }
      window.GraphRag?.setMode?.("all");
      window.GraphRag?.bindAsk?.();
      window.McpRagSearch?.bind?.();
    }
    if (tab === "connect") {
      bindConnect();
      await refreshConnectPanel();
    }
  }

  function onHash() {
    applyTab(parseHash());
  }

  function bind() {
    els.tabNews?.addEventListener("click", () => setHash("news"));
    els.tabBrain?.addEventListener("click", () => setHash("brain"));
    els.tabConnect?.addEventListener("click", () => setHash("connect"));
    window.addEventListener("hashchange", onHash);
    bindConnect();
    onHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();

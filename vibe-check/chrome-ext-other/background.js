// ── SWAP THIS URL WHEN YOUR MODAL ENDPOINT IS LIVE ──────────────────────────
const API_URL = "https://omuley--tone-classifier-inference-predict-web.modal.run";
// ─────────────────────────────────────────────────────────────────────────────

const TONE_MAP = {
  sadness: 0, confusion: 1, love: 2, anger: 3, fear: 4,
  surprise: 5, neutral: 6, happiness: 7, disgust: 8,
  shame: 9, guilt: 10, sarcasm: 11, desire: 12
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "vibeCheck",
    title: "✨ Vibe Check",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "vibeCheck" || !info.selectionText) return;
  await runAnalysis(info.selectionText.trim(), tab.id);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ANALYZE") {
    runAnalysis(msg.text, sender.tab?.id)
      .then(r => sendResponse(r))
      .catch(e => sendResponse({ error: e.message }));
    return true;
  }
});

async function runAnalysis(text, tabId) {
  if (tabId) chrome.tabs.sendMessage(tabId, { type: "LOADING", text });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);

    const data = await res.json();
    // Model returns label string e.g. "happiness"
    const label = (data.tone ?? data.label ?? "neutral").toLowerCase();
    const toneId = TONE_MAP[label] ?? 6;

    const result = { toneId, label };
    if (tabId) chrome.tabs.sendMessage(tabId, { type: "RESULT", ...result, text });
    return result;
  } catch (err) {
    if (tabId) chrome.tabs.sendMessage(tabId, { type: "ERROR", error: err.message, text });
    throw err;
  }
}
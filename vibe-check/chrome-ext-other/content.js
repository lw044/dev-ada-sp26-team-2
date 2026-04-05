const TONES = {
    0:  { label: "Sadness",   color: "#4a90d9", glow: "rgba(74,144,217,0.4)",  emoji: "😢" },
    1:  { label: "Confusion", color: "#9b72d4", glow: "rgba(155,114,212,0.4)", emoji: "😕" },
    2:  { label: "Love",      color: "#e8608a", glow: "rgba(232,96,138,0.4)",  emoji: "💖" },
    3:  { label: "Anger",     color: "#e04f4f", glow: "rgba(224,79,79,0.4)",   emoji: "😠" },
    4:  { label: "Fear",      color: "#7a4eab", glow: "rgba(122,78,171,0.4)",  emoji: "😨" },
    5:  { label: "Surprise",  color: "#f5a623", glow: "rgba(245,166,35,0.4)",  emoji: "😲" },
    6:  { label: "Neutral",   color: "#8090a0", glow: "rgba(128,144,160,0.4)", emoji: "😐" },
    7:  { label: "Happiness", color: "#50c878", glow: "rgba(80,200,120,0.4)",  emoji: "😄" },
    8:  { label: "Disgust",   color: "#85b33a", glow: "rgba(133,179,58,0.4)",  emoji: "🤢" },
    9:  { label: "Shame",     color: "#c2815b", glow: "rgba(194,129,91,0.4)",  emoji: "😳" },
    10: { label: "Guilt",     color: "#a1887f", glow: "rgba(161,136,127,0.4)", emoji: "😞" },
    11: { label: "Sarcasm",   color: "#26a69a", glow: "rgba(38,166,154,0.4)",  emoji: "😏" },
    12: { label: "Desire",    color: "#ef6c9a", glow: "rgba(239,108,154,0.4)", emoji: "😍" },
  };
  
  let floatBtn = null, overlay = null, lastText = null;
  
  // ── Floating button on selection ─────────────────────────────────────────────
  document.addEventListener("mouseup", e => {
    setTimeout(() => {
      const text = window.getSelection()?.toString().trim();
      if (text?.length > 1) {
        lastText = text;
        spawnFloatBtn(e.clientX, e.clientY);
      } else {
        killFloatBtn();
      }
    }, 20);
  });
  
  function spawnFloatBtn(cx, cy) {
    killFloatBtn();
    floatBtn = document.createElement("div");
    floatBtn.className = "vc-float-btn";
    floatBtn.innerHTML = `<span class="vc-float-icon">✨</span>Vibe Check`;
    floatBtn.style.left = `${cx + window.scrollX}px`;
    floatBtn.style.top  = `${cy + window.scrollY - 52}px`;
    floatBtn.addEventListener("mousedown", e => {
      e.preventDefault(); e.stopPropagation();
      if (lastText) kickOff(lastText);
    });
    document.body.appendChild(floatBtn);
    setTimeout(killFloatBtn, 5000);
  }
  function killFloatBtn() { floatBtn?.remove(); floatBtn = null; }
  
  // ── Analysis flow ─────────────────────────────────────────────────────────────
  function kickOff(text) {
    killFloatBtn();
    showOverlay("loading", null, text);
    try {
      chrome.runtime.sendMessage({ type: "ANALYZE", text }, res => {
        if (chrome.runtime.lastError || !res) return showOverlay("error", null, text, "Extension error");
        if (res.error) return showOverlay("error", null, text, res.error);
        showOverlay("result", res.toneId, text);
      });
    } catch(e) {
      showOverlay("error", null, text, "Please refresh the page and try again.");
    }
  }
  
  // ── Listen from background (context menu path) ───────────────────────────────
  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === "LOADING") showOverlay("loading", null, msg.text);
    if (msg.type === "RESULT")  showOverlay("result", msg.toneId, msg.text);
    if (msg.type === "ERROR")   showOverlay("error", null, msg.text, msg.error);
  });
  
  // ── Overlay ───────────────────────────────────────────────────────────────────
  function showOverlay(state, toneId, text, errMsg) {
    overlay?.remove();
    overlay = document.createElement("div");
    overlay.className = "vc-backdrop";
  
    if (state === "loading") {
      overlay.innerHTML = `
        <div class="vc-card vc-loading">
          <div class="vc-orb-wrap"><div class="vc-orb"></div></div>
          <p class="vc-loading-text">Reading the vibe…</p>
          <p class="vc-snippet">"${clip(text, 72)}"</p>
        </div>`;
    } else if (state === "result") {
      const t = TONES[toneId] ?? TONES[6];
      const imgSrc = chrome.runtime.getURL(`images/tone_${toneId}.png`);
      overlay.innerHTML = `
        <div class="vc-card vc-result" style="--c:${t.color};--g:${t.glow}">
          <button class="vc-x" id="vc-close">✕</button>
          <div class="vc-top">
            <span class="vc-emoji">${t.emoji}</span>
            <span class="vc-name">${t.label}</span>
          </div>
          <div class="vc-img-box">
            <img src="${imgSrc}" alt="${t.label}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
            <div class="vc-emoji-fb" style="display:none">${t.emoji}</div>
          </div>
          <p class="vc-snippet">"${clip(text, 90)}"</p>
        </div>`;
    } else {
      overlay.innerHTML = `
        <div class="vc-card vc-error">
          <button class="vc-x" id="vc-close">✕</button>
          <div class="vc-err-icon">⚠️</div>
          <p class="vc-err-msg">${errMsg ?? "Something went wrong"}</p>
          <p class="vc-err-hint">Is your backend deployed?</p>
        </div>`;
    }
  
    document.body.appendChild(overlay);
    overlay.querySelector("#vc-close")?.addEventListener("click", () => overlay?.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay?.remove(); });
    if (state === "result") setTimeout(() => overlay?.remove(), 9000);
  }
  
  function clip(s, n) { return s.length > n ? s.slice(0, n) + "…" : s; }

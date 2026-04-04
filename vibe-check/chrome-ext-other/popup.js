const TONES = {
    sadness:"😢", confusion:"😕", love:"💖", anger:"😠", fear:"😨",
    surprise:"😲", neutral:"😐", happiness:"😄", disgust:"🤢",
    shame:"😳", guilt:"😞", sarcasm:"😏", desire:"😍"
  };
  
  const TONE_MAP = {
    sadness:0,confusion:1,love:2,anger:3,fear:4,
    surprise:5,neutral:6,happiness:7,disgust:8,
    shame:9,guilt:10,sarcasm:11,desire:12
  };
  
  const API_URL = "https://omuley--tone-classifier-inference-predict-web.modal.run";
  
  const btn   = document.getElementById("btn");
  const inp   = document.getElementById("inp");
  const res   = document.getElementById("res");
  const spin  = document.getElementById("spin");
  const emoji = document.getElementById("emoji");
  const rlabel = document.getElementById("rlabel");
  const rsub   = document.getElementById("rsub");
  
  btn.addEventListener("click", async () => {
    const text = inp.value.trim();
    if (!text) { inp.focus(); return; }
  
    btn.disabled = true;
    res.classList.add("show");
    spin.style.display = "block";
    emoji.style.display = "none";
    rlabel.textContent = "Analyzing…";
    rsub.textContent = "Contacting backend";
  
    try {
      const r = await fetch(API_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text })
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const label = (data.tone ?? data.label ?? "neutral").toLowerCase();
      const toneId = TONE_MAP[label] ?? 6;
  
      spin.style.display = "none";
      emoji.style.display = "block";
      emoji.textContent = TONES[label] ?? "😐";
      rlabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      rsub.textContent = `Tone ${toneId} of 12`;
    } catch(e) {
      spin.style.display = "none";
      emoji.style.display = "block";
      emoji.textContent = "⚠️";
      rlabel.textContent = "Error";
      rsub.textContent = e.message.includes("fetch") ? "Backend not reachable" : e.message;
    } finally {
      btn.disabled = false;
    }
  });
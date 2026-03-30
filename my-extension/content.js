document.addEventListener("mouseup", async() => {
    const selected = window.getSelection().toString().trim();
    if(!selected) return;

    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    //backend

    const result = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selected })
      })
    //const result = await Response.json()
    showTooltip(rect, result.tone);
});

function showTooltip(rect,tone) {
    document.getElementById("sentiment-tooltip")?.remove();

    const tip = document.createElement("div");
    tip.id = "sentiment-tooltip";
    tip.textContent = tone;
    tip.className = `sentiment-tooltip sentiment-${tone.toLowerCase()}`;
    tip.style.top = `${rect.top + window.scrollY - 40}px`;
    tip.style.left = `${rect.left + window.scrollX}px`;
    document.body.appendChild(tip);
}

document.addEventListener("mousedown", () => {
    document.getElementById("sentiment-tooltip")?.remove();
})
document.addEventListener("mouseup", async () => {
    const selected = window.getSelection().toString().trim();
    if (!selected) return;

    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    //backend
    try {
        // Calling your Modal backend
        // The Modal endpoint expects 'text' as a query parameter
        const response = await fetch(`https://omuley--tone-classifier-inference-predict-web.modal.run?text=${encodeURIComponent(selected)}`, {
            method: "POST"
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tone = await response.json(); 
        showTooltip(rect, tone);
    } catch (error) {
        console.error("Error fetching tone:", error);
    }
});

function showTooltip(rect, tone) {
    document.getElementById("sentiment-tooltip")?.remove();

    const tip = document.createElement("div");
    tip.id = "sentiment-tooltip";
    tip.textContent = tone.trim();
    tip.className = `sentiment-tooltip sentiment-${tone.trim().toLowerCase()}`;
    tip.style.top = `${rect.top + window.scrollY - 40}px`;
    tip.style.left = `${rect.left + window.scrollX}px`;
    document.body.appendChild(tip);
}

document.addEventListener("mousedown", () => {
    document.getElementById("sentiment-tooltip")?.remove();
})
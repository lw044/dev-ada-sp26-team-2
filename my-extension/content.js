document.addEventListener("mouseup", async () => {
    const selected = window.getSelection().toString().trim();
    if (!selected) return;

    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    try {
        // Option 1: Calling your local Flask backend
        // (Make sure to run 'python server.py' in your terminal if you uncomment this, 
        //  and fix the python errors in server.py first!)
        /*
        const responseLocal = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selected })
        });
        const result = await responseLocal.json();
        showTooltip(rect, result.score);
        return; // Don't run Option 2 if Option 1 is executed
        */

        // Option 2: Calling your Modal backend
        // The Modal endpoint expects 'text' as a query parameter, not in the body
        const response = await fetch(`https://omuley--tone-classifier-inference-predict-web.modal.run?text=${encodeURIComponent(selected)}`, {
            method: "POST"
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tone = await response.json(); 
        showTooltip(rect, tone); // Modal endpoint returns a string directly
        
    } catch (error) {
        console.error("Error fetching tone:", error);
    }
});

function showTooltip(rect, tone) {
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
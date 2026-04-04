# ✨ Vibe Check — Chrome Extension

## Setup

### 1. Add your tone images
Place your images in `extension/images/` named exactly:

| File          | Emotion   |
|--------------|-----------|
| tone_0.png   | Sadness   |
| tone_1.png   | Confusion |
| tone_2.png   | Love      |
| tone_3.png   | Anger     |
| tone_4.png   | Fear      |
| tone_5.png   | Surprise  |
| tone_6.png   | Neutral   |
| tone_7.png   | Happiness |
| tone_8.png   | Disgust   |
| tone_9.png   | Shame     |
| tone_10.png  | Guilt     |
| tone_11.png  | Sarcasm   |
| tone_12.png  | Desire    |

Also add: `icon16.png`, `icon48.png`, `icon128.png`

If any image is missing, the extension shows an emoji fallback automatically.

---

### 2. Swap in your Modal URL (when ready)

Search for `YOUR-APP` in these 3 files and replace with your real URL:

- `background.js` — line 2
- `popup.js` — line 9
- `popup.html` — footer
- `manifest.json` — host_permissions

Your URL will look like:
```
https://yourname--tone-classifier-analyze.modal.run
```

---

### 3. Load into Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder

---

## How it works

- **Highlight text** on any webpage → floating **✨ Vibe Check** button appears → click it
- **Right-click** highlighted text → "✨ Vibe Check"  
- **Popup** → paste text → Analyze Tone

Your backend receives: `{ "text": "..." }`  
It should return: `{ "tone": "happiness" }` (the label string your model outputs)
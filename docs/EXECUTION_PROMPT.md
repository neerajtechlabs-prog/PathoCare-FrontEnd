# Screenshot Analysis Tool - Execution Guide

## Complete Step-by-Step Instructions

### Step 1: Get Your Google API Key (2 minutes)

1. Open: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"** button
3. Copy the generated key
4. **Keep it safe** - you'll use it in the next step

---

### Step 2: Set Up Environment Variable (1 minute)

**Option A: Windows PowerShell**
```powershell
$env:GOOGLE_API_KEY="paste-your-api-key-here"
```

**Option B: Windows Command Prompt (CMD)**
```cmd
set GOOGLE_API_KEY=paste-your-api-key-here
```

**Option C: Permanent Setup (.env file)**
1. Open `.env.analysis` in project root
2. Replace `your_api_key_here` with your actual key
3. Save the file
4. Run: `$env:GOOGLE_API_KEY = (Get-Content .env.analysis | Select-String 'GOOGLE_API_KEY' | ForEach-Object {$_ -replace 'GOOGLE_API_KEY='}).trim()`

---

### Step 3: Install Dependencies (1-2 minutes)

```bash
npm install
```

Expected output should show fs-extra and sharp being installed.

---

### Step 4: Run the Analysis (5-10 minutes)

**Standard run (uses attached screenshot folder):**
```bash
npm run analyze:screenshots
```

**Custom screenshot folder:**
```bash
npm run analyze:screenshots "C:\path\to\your\screenshots"
```

**Example output you'll see:**
```
🚀 Starting Screenshot Analysis Tool...

📂 Analyzing folder: c:\Users\PC\Desktop\Advik\ScreenshotFromSoft

📂 Scanning directory structure...
✅ Found 65 PNG files in 11 folders

💾 Loading cache...
✅ Cache contains 0 previous analyses

🔍 Analyzing images with AI Vision...

📸 Analyzing: Screenshot 2026-05-22 114256.png
📸 Analyzing: Screenshot 2026-05-22 114408.png
... (continues for all 65 images)

📝 Generating markdown report...
✅ Report saved to: d:\WorkingZone\PathoCare\PathoCarePro\analysis-report.md

═══════════════════════════════════════════
✨ Analysis Complete!
═══════════════════════════════════════════
```

---

### Step 5: Review the Report (10-15 minutes)

1. Open `analysis-report.md` in VS Code
2. Review the AI-generated descriptions under each folder
3. Compare descriptions with actual screenshots
4. Edit/refine descriptions as needed (optional)

---

## What Gets Generated

### Files Created:
- **`analysis-report.md`** — Main output report with all analyses
- **`tools/.analysis-cache.json`** — Cache file (for faster re-runs)

### Report Contents:
- Executive summary with statistics
- ASCII directory tree of all 65 screenshots
- Organized by folder with 2-3 line descriptions per image
- Architecture reference section
- Review guidelines

---

## Troubleshooting

### Problem: "API key not found" Error

**Solution:** Make sure API key is set before running the tool:
```powershell
# Check if API key is set
echo $env:GOOGLE_API_KEY

# If empty, set it again
$env:GOOGLE_API_KEY="your-key"

# Verify it worked
echo $env:GOOGLE_API_KEY  # Should display your key
```

### Problem: "Screenshot folder not found"

**Solution:** Verify the path exists:
```powershell
Test-Path "c:\Users\PC\Desktop\Advik\ScreenshotFromSoft"
```

If using custom folder, make sure full path is correct:
```bash
npm run analyze:screenshots "C:\Users\PC\Desktop\Advik\ScreenshotFromSoft"
```

### Problem: "npm: command not found"

**Solution:** Node.js/npm not in PATH. Either:
1. Install Node.js from nodejs.org
2. Or use full path: `C:\Program Files\nodejs\npm run analyze:screenshots`

### Problem: Rate Limiting (Gemini API)

**Solution:** Tool handles this automatically with delays. Just wait - the process will continue.

---

## What Happens Next?

Once analysis completes:

1. ✅ Open `analysis-report.md` 
2. ✅ Verify descriptions match your screenshots
3. ✅ Use this documentation for:
   - Cloud migration planning
   - Understanding current system architecture
   - Planning Phase 1 (Booking + Reporting modules)
4. ✅ Keep report safe - reference during development

---

## Running it Again

The tool caches results, so next time:
```bash
npm run analyze:screenshots  # Much faster (skips already-analyzed images)
```

To completely re-analyze all images:
```powershell
# Clear cache
Remove-Item tools/.analysis-cache.json

# Run again
npm run analyze:screenshots
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run analyze:screenshots` | Analyze using default screenshot folder |
| `npm run analyze:screenshots "path"` | Analyze custom folder |
| `echo $env:GOOGLE_API_KEY` | Verify API key is set |
| `npm install` | Install/update dependencies |

---

**Ready?** Follow Steps 1-4 above and you'll have a complete analysis in ~15-20 minutes! 🚀

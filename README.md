# Discipline Dashboard

A free, open-source Chrome extension that replaces your new tab page with a personal discipline dashboard. Track habits, manage categories, and visualize your progress — all stored locally on your device, with no accounts and no tracking.

Developed by **Iheb Heni**
- Email: ihebheni013@gmail.com
- Phone: +216 54 670 322
- LinkedIn: https://www.linkedin.com/in/iheb-heni/

---

## What It Does

Every time you open a new tab, you see a clean, modern dashboard with:

- **Daily greeting** with your name and today's date
- **KPI cards**: today's completion, current streak, weekly total, active habits
- **Today's progress**: a donut chart with your completion percentage and a clickable habit list
- **Weekly progress**: a bar chart showing your activity over the last 7 days
- **Habit management**: add, edit, delete, and check off habits directly from the dashboard
- **Category management**: create custom categories with colors, rename, and delete them
- **Light and dark mode**: switch between themes, with your preference saved automatically

All data stays in your browser using Chrome's built-in storage. Nothing is sent to any server.

---

## Features

### Core
- New tab override: the dashboard replaces Chrome's default new tab page
- Habit tracker with a 7-day grid (Monday to Sunday)
- Add, edit, and delete habits
- Check off habits for today and previous days of the week
- Live "today" score badge
- Three charts: today's completion (donut), 7-day progression (bar), and weekly totals per category (horizontal bar)
- Persistent storage via `chrome.storage.sync` (falls back to `localStorage` in non-extension contexts)

### Categories
- Create custom categories with a name and color
- Edit existing categories (rename, change color)
- Delete categories, with automatic reassignment of habits to another category
- Category pills shown on each habit and in the dashboard legend

### Personalization
- Set your first name to personalize the greeting
- Light, dark, or system theme
- Theme preference is saved and restored

### Data
- Reset all data to start fresh

---

## Tech Stack

- Plain HTML, CSS, and JavaScript (ES modules). No framework, no build step.
- Chrome Extension Manifest V3
- `chrome.storage.sync` for persistence
- Chart.js bundled locally in `vendor/` (no CDN at runtime)
- Native `Intl.DateTimeFormat` for dates and `crypto.randomUUID()` for IDs

---

## Project Structure


discipline-dashboard/
├── manifest.json
├── README.md
├── src/
│ ├── newtab.html # Main entry point
│ ├── newtab.js # Bootstrap and theme initialization
│ ├── styles/ # base.css, layout.css, components.css
│ ├── store/ # state, storage, theme, profile, categories
│ ├── models/ # habit model
│ ├── views/ # dashboard, habitsTable, categories, stats, settings
│ ├── components/ # modal
│ ├── charts/ # todayChart, weekChart, categoryChart
│ └── utils/ # dates, id
├── vendor/
│ └── chart.umd.min.js
└── assets/
└── icons/ # icon16, icon32, icon48, icon128


## Installation (Local Development)

### Prerequisites
- Google Chrome (or any Chromium-based browser)
- Git (optional, for cloning)

### Steps

1. **Clone the repository**
   git clone https://github.com/iheb-heni/discipline-dashboard.git
   cd discipline-dashboard
   Download Chart.js locally

The extension cannot load remote scripts. You need to download Chart.js into the vendor/ folder:

powershell
# Windows PowerShell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js" -OutFile "vendor\chart.umd.min.js"
# macOS / Linux
curl -o vendor/chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js
Add icons (optional for local testing)

Place four PNG files in assets/icons/: icon16.png, icon32.png, icon48.png, icon128.png. Any image will work. If you skip this, Chrome will use a default icon.

Load the extension in Chrome

Open chrome://extensions

Enable Developer mode (toggle in the top right)

Click Load unpacked

Select the discipline-dashboard folder (the one containing manifest.json)

Test it

Open a new tab (Ctrl+T)

The dashboard should appear

After Changing Code
Go to chrome://extensions

Click the reload (↻) button on the Discipline Dashboard card

Close the current new tab and open a fresh one

Privacy
No data leaves your device unless you explicitly export it

No analytics, no tracking, no third-party requests at runtime

Only the storage permission is requested

Everything is stored locally in your Chrome profile

Roadmap
Planned features for future versions:

Per-habit streaks (current and longest)

Daily notes / journal

Import and export data as JSON

Start-of-week preference

Recurring schedules (specific days only)

Pomodoro / focus timer

Statistics export (CSV, PDF)

License
MIT License. Free to use, modify, and distribute.

Author
Iheb Heni

Email: ihebheni013@gmail.com

Phone: +216 54 670 322

LinkedIn: https://www.linkedin.com/in/iheb-heni/
# Discipline Dashboard

A free, open-source Chrome extension that replaces your New Tab page with a personal discipline dashboard. Track habits, manage categories, and visualize your progress — all stored locally in your browser, with no accounts and no tracking.

Developed by **Iheb Heni**

- **Email:** ihebheni013@gmail.com
- **Phone:** +216 54 670 322
- **LinkedIn:** https://www.linkedin.com/in/iheb-heni/
- **GitHub:** https://github.com/iheb-heni/discipline-dashboard

---

## What It Does

Every time you open a new tab, Discipline Dashboard gives you a clean and modern overview of your daily discipline.

### Dashboard

- **Personalized greeting** with your name and today's date
- **KPI cards** showing today's completion, current streak, weekly total, and active habits
- **Today's progress** with a donut chart and habit checklist
- **Weekly progress** with a 7-day activity chart
- **Habit management** directly from the dashboard
- **Category management** with custom names and colors
- **Light and dark mode** with automatic theme persistence

All data is stored in your browser using Chrome's built-in storage. No data is sent to a remote server.

---

## Features

### Core

- New Tab override: replaces Chrome's default New Tab page
- Habit tracker with a Monday–Sunday weekly view
- Add, edit, and delete habits
- Check off habits for today and previous days of the week
- Live daily completion score
- Today's completion donut chart
- 7-day progression bar chart
- Weekly totals by category using a horizontal bar chart
- Persistent storage using `chrome.storage.sync`
- `localStorage` fallback for non-extension development contexts

### Categories

- Create custom categories
- Assign a name and color to each category
- Edit existing categories
- Rename categories
- Change category colors
- Delete categories
- Automatically reassign habits when a category is deleted
- Display category indicators throughout the dashboard

### Personalization

- Set your first name for a personalized greeting
- Choose between:
  - Light mode
  - Dark mode
  - System mode
- Automatically save and restore your theme preference

### Data

- Reset all application data
- All application data remains inside the browser
- No account is required

---

## Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES Modules)**
- **Chrome Extension Manifest V3**
- **Chrome Storage API**
- **Chart.js**
- Native `Intl.DateTimeFormat` for date formatting
- `crypto.randomUUID()` for unique IDs
- No framework
- No build step
- No CDN dependency at runtime

Chart.js is bundled locally inside the `vendor/` directory.

---

## Project Structure

```text
discipline-dashboard/
│
├── manifest.json
├── README.md
│
├── src/
│   ├── newtab.html
│   ├── newtab.js
│   │
│   ├── styles/
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   │
│   ├── store/
│   │   ├── storage.js
│   │   ├── state.js
│   │   └── migrate.js
│   │
│   ├── models/
│   │   ├── habit.js
│   │   ├── task.js
│   │   └── subtask.js
│   │
│   ├── views/
│   │   ├── dashboard.js
│   │   ├── habitsTable.js
│   │   ├── habitEditor.js
│   │   ├── stats.js
│   │   └── settings.js
│   │
│   ├── components/
│   │   ├── modal.js
│   │   ├── checkbox.js
│   │   └── button.js
│   │
│   ├── charts/
│   │   ├── todayChart.js
│   │   ├── weekChart.js
│   │   └── categoryChart.js
│   │
│   └── utils/
│       ├── dates.js
│       └── id.js
│
├── vendor/
│   └── chart.umd.min.js
│
└── assets/
    └── icons/
        ├── icon16.png
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

---

## Installation

### Prerequisites

- Google Chrome or another Chromium-based browser
- Git — optional, only required for cloning the repository

### 1. Clone the Repository

```bash
git clone https://github.com/iheb-heni/discipline-dashboard.git
cd discipline-dashboard
```

### 2. Download Chart.js Locally

The extension cannot load remote JavaScript files at runtime, so Chart.js must be stored locally in the `vendor/` directory.

#### Windows PowerShell

```powershell
Invoke-WebRequest `
  -Uri "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js" `
  -OutFile "vendor\chart.umd.min.js"
```

#### macOS / Linux

```bash
curl -o vendor/chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js
```

### 3. Add Extension Icons

Place the following PNG files inside:

```text
assets/icons/
```

Required files:

```text
icon16.png
icon32.png
icon48.png
icon128.png
```

For local testing, any valid PNG images can be used.

### 4. Load the Extension in Chrome

Open:

```text
chrome://extensions
```

Then:

1. Enable **Developer mode**
2. Click **Load unpacked**
3. Select the `discipline-dashboard` folder
4. Make sure you select the folder containing `manifest.json`

### 5. Test the Extension

Open a new tab:

```text
Ctrl + T
```

The Discipline Dashboard should appear instead of Chrome's default New Tab page.

---

## After Changing the Code

After modifying the extension:

1. Open:

```text
chrome://extensions
```

2. Find **Discipline Dashboard**
3. Click the **Reload ↻** button
4. Close the current New Tab
5. Open a new tab with `Ctrl + T`

The updated version should now be loaded.

---

## Privacy

Discipline Dashboard is designed to keep your data inside your browser.

- No user account required
- No analytics
- No tracking
- No advertising
- No third-party requests at runtime
- No external API required
- No remote JavaScript dependencies at runtime
- Application data is stored using Chrome's storage system
- The extension requests only the permissions required for its functionality

Your habit data remains in your Chrome profile unless you explicitly export or otherwise transfer it.

---

## Roadmap

Planned features for future versions:

- Per-habit current and longest streaks
- Daily notes / journal
- Import and export data as JSON
- Configurable start-of-week preference
- Recurring schedules for specific days
- Pomodoro / focus timer
- Statistics export to CSV
- Statistics export to PDF
- Additional dashboard customization
- More detailed productivity analytics

---

## License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute the project according to the terms of the license.

---

## Author

### Iheb Heni

Full Stack Web Developer

- **Email:** ihebheni013@gmail.com
- **Phone:** +216 54 670 322
- **LinkedIn:** https://www.linkedin.com/in/iheb-heni/
- **GitHub:** https://github.com/iheb-heni/discipline-dashboard

- `store/` is the single source of truth for state and storage. Views never touch `chrome.storage` directly.
- `views/` renders each section of the dashboard from state.
- `models/` defines the shape of habits, tasks, and subtasks.
- `charts/` wraps Chart.js instances.
- `utils/` holds small helpers (dates, IDs).

---

## Development Plan

1. Scaffold the project structure and manifest (done).
2. Build the storage layer: `storage.js`, `state.js`, `migrate.js`.
3. Define data models: habit, task, subtask.
4. Rebuild the dashboard layout in `newtab.html` using semantic HTML and modular CSS.
5. Port the existing habits table and charts into `views/` and `charts/`.
6. Add habit, task, and subtask editors.
7. Add streaks, notes, and review views.
8. Add settings (theme, week start, import/export).
9. Bundle Chart.js locally and remove all CDN references.
10. Test as an unpacked extension in Chrome.
11. Prepare store assets: icons, screenshots, privacy policy.
12. Publish on the Chrome Web Store.

---

## How to Load the Extension Locally

1. Clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable Developer Mode (top right).
4. Click "Load unpacked" and select the project folder.
5. Open a new tab — the dashboard appears.

---

## Privacy

- No data leaves the user's device unless the user explicitly exports it.
- No analytics, no tracking, no third-party requests at runtime.
- Only the `storage` permission is requested.

---

## License

MIT License. Free to use, modify, and distribute.

---

## Author

Iheb Heni
- Email: ihebheni013@gmail.com
- Phone: +216 54 670 322
- LinkedIn: https://www.linkedin.com/in/iheb-heni/
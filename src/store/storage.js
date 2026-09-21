const HAS_CHROME =
  typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync;

function chromeGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (res) => resolve(res || {}));
  });
}

function chromeSet(obj) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(obj, () => resolve());
  });
}

function localGet(keys) {
  try {
    const out = {};
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw !== null) out[k] = JSON.parse(raw);
    }
    return Promise.resolve(out);
  } catch (e) {
    return Promise.resolve({});
  }
}

function localSet(obj) {
  try {
    for (const k of Object.keys(obj)) {
      localStorage.setItem(k, JSON.stringify(obj[k]));
    }
  } catch (e) {
    /* ignore quota errors */
  }
  return Promise.resolve();
}

export function get(keys) {
  const list = Array.isArray(keys) ? keys : [keys];
  return HAS_CHROME ? chromeGet(list) : localGet(list);
}

export function set(obj) {
  return HAS_CHROME ? chromeSet(obj) : localSet(obj);
}

export function onChange(callback) {
  if (HAS_CHROME) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      callback(changes);
    });
  } else {
    window.addEventListener("storage", (e) => {
      if (!e.key) return;
      callback({ [e.key]: { newValue: JSON.parse(e.newValue) } });
    });
  }
}
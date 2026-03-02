// ============================================================
// FILE 6: Asynchronous JavaScript & API Communication
// Topics: Callbacks, Promises, async/await, Fetch, AbortController,
//         WebSocket, SSE, Service Workers, Web Workers
// ============================================================


// ─────────────────────────────────────────────
// 1. THE EVENT LOOP — HOW ASYNC WORKS
// ─────────────────────────────────────────────
// JS is single-threaded. Async tasks go into the callback/task queue.
// The event loop moves tasks to the call stack when it's empty.
//
// Execution order:
//  1. Synchronous code (call stack)
//  2. Microtasks: Promise callbacks, queueMicrotask
//  3. Macrotasks: setTimeout, setInterval, I/O, UI events

console.log("1 - sync");

setTimeout(() => console.log("3 - macrotask (setTimeout 0)"), 0);

Promise.resolve().then(() => console.log("2 - microtask (Promise)"));

queueMicrotask(() => console.log("2b - microtask (queueMicrotask)"));

console.log("1b - sync");
// Output: 1 → 1b → 2 → 2b → 3


// ─────────────────────────────────────────────
// 2. CALLBACKS (old pattern)
// ─────────────────────────────────────────────

function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload  = () => callback(null, script);
  script.onerror = () => callback(new Error(`Failed to load ${src}`));
  document.head.appendChild(script);
}

loadScript("https://example.com/lib.js", (err, script) => {
  if (err) return console.error(err.message);
  console.log("Loaded:", script.src);
});


// ─────────────────────────────────────────────
// 3. PROMISES
// ─────────────────────────────────────────────
// A Promise represents a future value: pending → fulfilled | rejected

// Creating a Promise
const promise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) resolve("Data loaded!");
    else reject(new Error("Something went wrong"));
  }, 1000);
});

// Consuming a Promise
promise
  .then(data => {
    console.log(data);       // "Data loaded!"
    return data.toUpperCase();  // chain: return passes to next .then
  })
  .then(upper => console.log(upper))  // "DATA LOADED!"
  .catch(err => console.error(err.message))  // handles any rejection above
  .finally(() => console.log("Always runs"));

// ── Promise states ──
// pending: initial state
// fulfilled: resolve() called
// rejected: reject() called

// ── Promisifying a callback function ──
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    // Simulated (in Node: fs.readFile(filename, 'utf8', callback))
    setTimeout(() => {
      if (filename) resolve(`Contents of ${filename}`);
      else reject(new Error("No filename"));
    }, 100);
  });
}

readFilePromise("data.txt")
  .then(contents => console.log(contents))
  .catch(err => console.error(err.message));

// ── Promise combinators ──

// Promise.all — wait for ALL, fail if any rejects
Promise.all([
  fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json()),
  fetch("https://jsonplaceholder.typicode.com/posts/1").then(r => r.json()),
])
.then(([user, post]) => console.log(user.name, post.title))
.catch(err => console.error("One failed:", err));

// Promise.allSettled — wait for ALL, never rejects, reports each result
Promise.allSettled([
  Promise.resolve("success"),
  Promise.reject("failure"),
  Promise.resolve("another success"),
])
.then(results => {
  results.forEach(r => {
    if (r.status === "fulfilled") console.log("✓", r.value);
    else console.log("✗", r.reason);
  });
});

// Promise.race — first to settle wins (either fulfill or reject)
Promise.race([
  new Promise(res => setTimeout(() => res("fast"), 100)),
  new Promise(res => setTimeout(() => res("slow"), 500)),
])
.then(winner => console.log(winner)); // "fast"

// Promise.any — first SUCCESSFUL one wins (ignores rejections)
Promise.any([
  Promise.reject("error 1"),
  new Promise(res => setTimeout(() => res("success"), 100)),
  new Promise(res => setTimeout(() => res("another"), 200)),
])
.then(val => console.log(val))   // "success"
.catch(err => console.error(err)); // AggregateError only if ALL reject

// Timeout pattern using Promise.race
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}


// ─────────────────────────────────────────────
// 4. ASYNC / AWAIT
// ─────────────────────────────────────────────
// Syntactic sugar over Promises — makes async code look synchronous

async function getUser(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const user = await response.json();
  return user;
}

// ── Error handling with async/await ──
async function fetchWithHandling(id) {
  try {
    const user = await getUser(id);
    console.log(user.name);
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    console.log("Fetch attempt complete");
  }
}

fetchWithHandling(1);

// ── Sequential vs Parallel ──

// Sequential (slower — each waits for previous)
async function sequential() {
  const user  = await getUser(1);  // wait ~500ms
  const post  = await getUser(2);  // wait another ~500ms
  return [user, post];
}

// Parallel (faster — start both at the same time)
async function parallel() {
  const [user, post] = await Promise.all([getUser(1), getUser(2)]);
  return [user, post];
}

// ── Async iteration ──
async function* asyncRange(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise(res => setTimeout(res, 100));  // simulate delay
    yield i;
  }
}

async function runAsyncRange() {
  for await (const n of asyncRange(1, 5)) {
    console.log(n); // 1,2,3,4,5 with 100ms delay each
  }
}
runAsyncRange();

// ── Top-level await (works in ES modules) ──
// const data = await fetch("https://api.example.com/data");


// ─────────────────────────────────────────────
// 5. FETCH API
// ─────────────────────────────────────────────

// GET request
async function fetchGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

// POST request
async function fetchPost(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-Custom-Header": "value"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// PUT / PATCH / DELETE
async function fetchPut(url, data) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function fetchDelete(url) {
  const res = await fetch(url, { method: "DELETE" });
  if (res.status === 204) return null;  // No Content
  return res.json();
}

// ── Response types ──
async function fetchVariousTypes(url) {
  const res = await fetch(url);
  const json   = await res.clone().json();      // parse as JSON
  const text   = await res.clone().text();      // parse as string
  const blob   = await res.clone().blob();      // parse as Blob (file)
  const buffer = await res.clone().arrayBuffer(); // parse as binary
  const form   = await res.clone().formData();  // parse as FormData
}

// ── Response metadata ──
async function checkResponse(url) {
  const res = await fetch(url);
  console.log(res.status);     // 200, 404, 500, etc.
  console.log(res.statusText); // "OK", "Not Found", etc.
  console.log(res.ok);         // true for 200-299
  console.log(res.url);        // final URL (after redirects)
  console.log(res.redirected); // was there a redirect?
  console.log(res.type);       // "basic", "cors", "opaque"
  console.log(res.headers.get("Content-Type"));
  for (const [key, val] of res.headers) {
    console.log(key, val);
  }
}

// ── Upload file ──
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", "My upload");

  const res = await fetch("/upload", {
    method: "POST",
    body: formData  // don't set Content-Type manually — browser sets it with boundary
  });
  return res.json();
}

// ── Download with progress ──
async function downloadWithProgress(url, onProgress) {
  const res = await fetch(url);
  const total = parseInt(res.headers.get("Content-Length") || "0");
  const reader = res.body.getReader();
  let received = 0;
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(received / total);  // 0 to 1
  }

  const body = new Uint8Array(received);
  let pos = 0;
  for (const chunk of chunks) {
    body.set(chunk, pos);
    pos += chunk.length;
  }
  return new Blob([body]);
}


// ─────────────────────────────────────────────
// 6. ABORTCONTROLLER — cancel requests
// ─────────────────────────────────────────────

async function fetchWithAbort(url) {
  const controller = new AbortController();
  const { signal } = controller;

  // Cancel after 5 seconds
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, { signal });
    clearTimeout(timeout);
    return res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request was cancelled");
      return null;
    }
    throw err;
  }
}

// Cancel on user action
function makeCancellableFetch(url) {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal }).then(r => r.json());
  return {
    promise,
    cancel: () => controller.abort()
  };
}

const { promise: req, cancel } = makeCancellableFetch("https://jsonplaceholder.typicode.com/users");
// cancel(); // call to cancel


// ─────────────────────────────────────────────
// 7. API WRAPPER / HTTP CLIENT
// ─────────────────────────────────────────────

class ApiClient {
  #baseUrl;
  #defaultHeaders;
  #interceptors = { request: [], response: [] };

  constructor(baseUrl, options = {}) {
    this.#baseUrl = baseUrl;
    this.#defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers
    };
  }

  addRequestInterceptor(fn) { this.#interceptors.request.push(fn); }
  addResponseInterceptor(fn) { this.#interceptors.response.push(fn); }

  async #request(method, path, options = {}) {
    let config = {
      method,
      headers: { ...this.#defaultHeaders, ...options.headers },
      ...options
    };

    if (options.body) config.body = JSON.stringify(options.body);

    // Run request interceptors
    for (const interceptor of this.#interceptors.request) {
      config = await interceptor(config);
    }

    let response = await fetch(`${this.#baseUrl}${path}`, config);

    // Run response interceptors
    for (const interceptor of this.#interceptors.response) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw Object.assign(new Error(error.message), {
        status: response.status,
        data: error
      });
    }

    return response.status === 204 ? null : response.json();
  }

  get(path, options)       { return this.#request("GET", path, options); }
  post(path, body, opts)   { return this.#request("POST", path, { ...opts, body }); }
  put(path, body, opts)    { return this.#request("PUT", path, { ...opts, body }); }
  patch(path, body, opts)  { return this.#request("PATCH", path, { ...opts, body }); }
  delete(path, options)    { return this.#request("DELETE", path, options); }
}

// Usage
const api = new ApiClient("https://jsonplaceholder.typicode.com");

// Add auth interceptor
api.addRequestInterceptor(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Add response logger
api.addResponseInterceptor(res => {
  console.log(`[${res.status}] ${res.url}`);
  return res;
});

api.get("/users/1").then(user => console.log(user.name));
api.post("/posts", { title: "Hello", body: "World", userId: 1 });


// ─────────────────────────────────────────────
// 8. RETRY & EXPONENTIAL BACKOFF
// ─────────────────────────────────────────────

async function fetchWithRetry(url, options = {}, retries = 3) {
  const { retryDelay = 1000, retryOn = [500, 502, 503] } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (!res.ok && retryOn.includes(res.status) && attempt < retries) {
        const delay = retryDelay * 2 ** (attempt - 1);  // exponential: 1s, 2s, 4s
        console.log(`Retry ${attempt} in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = retryDelay * 2 ** (attempt - 1);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}


// ─────────────────────────────────────────────
// 9. WEBSOCKET — real-time bidirectional
// ─────────────────────────────────────────────

class WebSocketClient {
  #ws = null;
  #url;
  #listeners = new Map();
  #reconnectDelay = 1000;
  #shouldReconnect = true;

  constructor(url) {
    this.#url = url;
  }

  connect() {
    this.#ws = new WebSocket(this.#url);

    this.#ws.onopen = (e) => {
      console.log("WebSocket connected");
      this.#reconnectDelay = 1000;  // reset backoff
      this.#emit("open", e);
    };

    this.#ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Message received:", data);
      this.#emit("message", data);
      if (data.type) this.#emit(data.type, data.payload);  // typed events
    };

    this.#ws.onerror = (e) => {
      console.error("WebSocket error:", e);
      this.#emit("error", e);
    };

    this.#ws.onclose = (e) => {
      console.log("WebSocket closed:", e.code, e.reason);
      this.#emit("close", e);
      if (this.#shouldReconnect) this.#scheduleReconnect();
    };
  }

  #scheduleReconnect() {
    console.log(`Reconnecting in ${this.#reconnectDelay}ms...`);
    setTimeout(() => this.connect(), this.#reconnectDelay);
    this.#reconnectDelay = Math.min(this.#reconnectDelay * 2, 30000);  // cap at 30s
  }

  send(type, payload) {
    if (this.#ws?.readyState === WebSocket.OPEN) {
      this.#ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(listener);
  }

  #emit(event, data) {
    (this.#listeners.get(event) || []).forEach(l => l(data));
  }

  disconnect() {
    this.#shouldReconnect = false;
    this.#ws?.close(1000, "Client disconnected");
  }
}

const ws = new WebSocketClient("wss://ws.example.com/chat");
ws.connect();
ws.on("message", data => console.log("Chat:", data));
ws.send("chat", { text: "Hello!", room: "general" });


// ─────────────────────────────────────────────
// 10. SERVER-SENT EVENTS (SSE) — one-way server push
// ─────────────────────────────────────────────

function connectSSE(url) {
  const source = new EventSource(url, { withCredentials: true });

  source.onopen = () => console.log("SSE connected");
  source.onerror = (e) => {
    if (e.eventPhase === EventSource.CLOSED) console.log("SSE closed");
  };

  // Default message event
  source.onmessage = (e) => {
    console.log("SSE data:", JSON.parse(e.data));
  };

  // Custom named events (server sends: event: update\ndata: {...})
  source.addEventListener("update", (e) => {
    const data = JSON.parse(e.data);
    console.log("Update:", data);
  });

  source.addEventListener("heartbeat", () => {
    console.log("Heartbeat");
  });

  return source;
}

const eventSource = connectSSE("/api/events");
// eventSource.close(); // stop


// ─────────────────────────────────────────────
// 11. WEB WORKERS — background threads
// ─────────────────────────────────────────────

// main.js
const worker = new Worker("worker.js");

worker.postMessage({ type: "COMPUTE", data: { n: 1000000 } });

worker.onmessage = (e) => {
  console.log("Worker result:", e.data);
};

worker.onerror = (err) => {
  console.error("Worker error:", err.message);
  worker.terminate();
};

// worker.js (runs in a separate thread)
/*
self.onmessage = function(e) {
  const { type, data } = e.data;
  if (type === "COMPUTE") {
    let sum = 0;
    for (let i = 0; i < data.n; i++) sum += i;
    self.postMessage({ type: "RESULT", sum });
  }
};
*/

// Inline worker (create from string — no separate file needed)
function createInlineWorker(fn) {
  const blob = new Blob([`self.onmessage = ${fn.toString()}`], {
    type: "application/javascript"
  });
  return new Worker(URL.createObjectURL(blob));
}

const inlineWorker = createInlineWorker(function(e) {
  const result = e.data * 2;
  self.postMessage(result);
});

inlineWorker.postMessage(21);
inlineWorker.onmessage = (e) => console.log("Inline worker result:", e.data); // 42


// ─────────────────────────────────────────────
// 12. SERVICE WORKERS — offline caching
// ─────────────────────────────────────────────

// Registration (in main.js)
async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("SW registered:", reg.scope);

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("New version available — reload to update");
          }
        });
      });
    } catch (err) {
      console.error("SW registration failed:", err);
    }
  }
}

// sw.js content:
/*
const CACHE_NAME = "v1";
const URLS_TO_CACHE = ["/", "/index.html", "/main.js", "/style.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // activate immediately
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // take control of all clients
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    // Cache-first strategy
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      });
    })
  );
});
*/


// ─────────────────────────────────────────────
// 13. REAL-WORLD ASYNC PATTERNS
// ─────────────────────────────────────────────

// Request deduplication — avoid duplicate in-flight requests
const pendingRequests = new Map();

async function deduplicatedFetch(url) {
  if (pendingRequests.has(url)) return pendingRequests.get(url);

  const promise = fetch(url).then(r => r.json()).finally(() => {
    pendingRequests.delete(url);
  });

  pendingRequests.set(url, promise);
  return promise;
}

// Cache layer with TTL
class CachedApi {
  #cache = new Map();
  #ttl;

  constructor(ttlMs = 60000) {
    this.#ttl = ttlMs;
  }

  async get(url) {
    const cached = this.#cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.#ttl) {
      return cached.data;
    }
    const data = await fetch(url).then(r => r.json());
    this.#cache.set(url, { data, timestamp: Date.now() });
    return data;
  }

  invalidate(url) { this.#cache.delete(url); }
  clear() { this.#cache.clear(); }
}

const cachedApi = new CachedApi(30000); // 30s TTL
cachedApi.get("https://jsonplaceholder.typicode.com/users");

// Queue with concurrency limit
class ConcurrentQueue {
  #queue = [];
  #running = 0;
  #concurrency;

  constructor(concurrency = 3) {
    this.#concurrency = concurrency;
  }

  add(fn) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ fn, resolve, reject });
      this.#run();
    });
  }

  #run() {
    while (this.#running < this.#concurrency && this.#queue.length) {
      const { fn, resolve, reject } = this.#queue.shift();
      this.#running++;
      Promise.resolve(fn())
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.#running--;
          this.#run();
        });
    }
  }
}

const queue = new ConcurrentQueue(2);  // max 2 concurrent
const urls = ["url1", "url2", "url3", "url4", "url5"];

// Only 2 requests run at a time
Promise.all(urls.map(url => queue.add(() => fetch(url))));

// Polling
function poll(fn, interval, stopCondition) {
  return new Promise((resolve) => {
    const timer = setInterval(async () => {
      const result = await fn();
      if (stopCondition(result)) {
        clearInterval(timer);
        resolve(result);
      }
    }, interval);
  });
}

poll(
  () => fetch("/api/job/123").then(r => r.json()),
  2000,
  (job) => job.status === "complete"
).then(job => console.log("Job done:", job));

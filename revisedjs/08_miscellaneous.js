// ============================================================
// FILE 8: Miscellaneous JavaScript Topics
// Topics: Modules, Internationalization, Web APIs, Security,
//         Testing concepts, TypeScript hints, Tooling, Patterns
// ============================================================


// ─────────────────────────────────────────────
// 1. ES MODULES (ESM)
// ─────────────────────────────────────────────
// Modern JS uses import/export instead of require/module.exports

// ── Named exports ──
// math.js:
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export class Vector2D {
  constructor(x, y) { this.x = x; this.y = y; }
  add(other) { return new Vector2D(this.x + other.x, this.y + other.y); }
}

// ── Default export (one per file) ──
// api.js:
export default class Api {
  constructor(baseUrl) { this.baseUrl = baseUrl; }
}

// ── Import named ──
import { PI, add, Vector2D } from "./math.js";
// ── Import default ──
import Api from "./api.js";
// ── Import all as namespace ──
import * as math from "./math.js";
// ── Import with alias ──
import { subtract as sub } from "./math.js";
// ── Dynamic import (lazy loading) ──
async function loadModule() {
  const { add } = await import("./math.js");
  console.log(add(1, 2));
}

// ── Re-exports (barrel file / index.js pattern) ──
// index.js:
export { add, subtract } from "./math.js";
export { default as Api } from "./api.js";
export * from "./utils.js";

// ── Import assertions (JSON modules) ──
// import data from "./data.json" assert { type: "json" };

// ── Module features ──
// - Always in strict mode
// - Runs once, then cached
// - Top-level `this` is undefined (not window)
// - Can use top-level await
// - Deferred by default (like defer attribute on script)


// ─────────────────────────────────────────────
// 2. INTERNATIONALIZATION (Intl API)
// ─────────────────────────────────────────────

// ── Number formatting ──
const num = 1234567.89;

console.log(new Intl.NumberFormat("en-US").format(num)); // "1,234,567.89"
console.log(new Intl.NumberFormat("de-DE").format(num)); // "1.234.567,89"
console.log(new Intl.NumberFormat("hi-IN").format(num)); // "12,34,567.89"

// Currency
console.log(new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD"
}).format(1234.5));  // "$1,234.50"

console.log(new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR"
}).format(1234.5));  // "₹1,234.50"

// Percent
console.log(new Intl.NumberFormat("en-US", { style: "percent" }).format(0.42)); // "42%"

// Compact
console.log(new Intl.NumberFormat("en", { notation: "compact" }).format(1234567)); // "1.2M"

// ── Date formatting ──
const date = new Date("2024-01-15T10:30:00");

console.log(new Intl.DateTimeFormat("en-US").format(date)); // "1/15/2024"
console.log(new Intl.DateTimeFormat("de-DE").format(date)); // "15.1.2024"
console.log(new Intl.DateTimeFormat("ja-JP").format(date)); // "2024/1/15"

console.log(new Intl.DateTimeFormat("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
  hour: "numeric", minute: "2-digit", timeZone: "America/New_York"
}).format(date));  // "Monday, January 15, 2024 at 10:30 AM"

// Relative time
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
console.log(rtf.format(-1, "day"));    // "yesterday"
console.log(rtf.format(3, "week"));    // "in 3 weeks"
console.log(rtf.format(-5, "month"));  // "5 months ago"

// ── List formatting ──
const listFmt = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
console.log(listFmt.format(["Alice", "Bob", "Carol"])); // "Alice, Bob, and Carol"

const orFmt = new Intl.ListFormat("en", { style: "short", type: "disjunction" });
console.log(orFmt.format(["A", "B", "C"])); // "A, B, or C"

// ── Plural rules ──
const pr = new Intl.PluralRules("en");
console.log(pr.select(0));  // "other" → "0 items"
console.log(pr.select(1));  // "one"   → "1 item"
console.log(pr.select(5));  // "other" → "5 items"

function pluralize(count, singular, plural) {
  const rule = new Intl.PluralRules("en").select(count);
  return `${count} ${rule === "one" ? singular : plural}`;
}
console.log(pluralize(1, "item", "items")); // "1 item"
console.log(pluralize(5, "item", "items")); // "5 items"

// ── Collator (locale-aware sorting) ──
const collator = new Intl.Collator("de", { sensitivity: "base" });
const words = ["Österreich", "Andorra", "Zypern", "abc"];
console.log(words.sort((a, b) => collator.compare(a, b)));

// ── Segmenter (split text into words/sentences) ──
const segmenter = new Intl.Segmenter("en", { granularity: "word" });
const text = "Hello, World! How are you?";
const segments = [...segmenter.segment(text)].filter(s => s.isWordLike);
console.log(segments.map(s => s.segment)); // ["Hello", "World", "How", "are", "you"]


// ─────────────────────────────────────────────
// 3. BROWSER SECURITY
// ─────────────────────────────────────────────

// ── XSS Prevention ──
// Never use innerHTML with untrusted data
function dangerousInsert(userInput) {
  document.getElementById("output").innerHTML = userInput; // ✗ XSS risk!
}

function safeInsert(userInput) {
  document.getElementById("output").textContent = userInput; // ✓ safe
}

// Or sanitize
function sanitizeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// DOMPurify (library) for rich HTML:
// import DOMPurify from "dompurify";
// element.innerHTML = DOMPurify.sanitize(userHTML);

// Content Security Policy (set via HTTP header):
// Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com

// ── CSRF Prevention ──
// Include CSRF token in state-changing requests
async function safeFetch(url, data) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify(data),
    credentials: "include"  // include cookies
  });
}

// ── Subresource Integrity (SRI) ──
// <script src="https://cdn.example.com/lib.js"
//   integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
//   crossorigin="anonymous"></script>

// ── Secure storage patterns ──
// Never store sensitive data in localStorage (accessible by any JS on the page)
// Store auth tokens in httpOnly cookies (inaccessible to JS)
// Use sessionStorage for session-only sensitive data


// ─────────────────────────────────────────────
// 4. WEB PERFORMANCE APIs
// ─────────────────────────────────────────────

// ── Navigation Timing ──
window.addEventListener("load", () => {
  const perf = performance.timing;
  const pageLoad = perf.loadEventEnd - perf.navigationStart;
  const dns = perf.domainLookupEnd - perf.domainLookupStart;
  const tcp = perf.connectEnd - perf.connectStart;
  const ttfb = perf.responseStart - perf.requestStart;
  const dom = perf.domContentLoadedEventEnd - perf.domLoading;
  console.log(`Page load: ${pageLoad}ms, TTFB: ${ttfb}ms`);
});

// ── Performance Observer (modern) ──
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (entry.entryType === "measure") {
      console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
    }
    if (entry.entryType === "largest-contentful-paint") {
      console.log(`LCP: ${entry.startTime.toFixed(0)}ms`);
    }
    if (entry.entryType === "layout-shift") {
      console.log(`CLS: ${entry.value.toFixed(4)}`);
    }
  });
});

observer.observe({ entryTypes: ["measure", "largest-contentful-paint", "layout-shift"] });

// ── User Timing ──
performance.mark("renderStart");
// ... render work ...
performance.mark("renderEnd");
performance.measure("renderTime", "renderStart", "renderEnd");

// ── Core Web Vitals ──
// LCP (Largest Contentful Paint) < 2.5s → Good
// FID (First Input Delay) / INP (Interaction to Next Paint) < 200ms → Good
// CLS (Cumulative Layout Shift) < 0.1 → Good

// Long task detection
const longTaskObs = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.warn(`Long task: ${entry.duration.toFixed(0)}ms`);
  });
});
longTaskObs.observe({ entryTypes: ["longtask"] });

// Resource timing
const resourceObs = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.log(`${entry.name}: ${entry.duration.toFixed(0)}ms`);
  });
});
resourceObs.observe({ entryTypes: ["resource"] });


// ─────────────────────────────────────────────
// 5. WEB CRYPTO API
// ─────────────────────────────────────────────

// Generate random values
const array = new Uint8Array(16);
crypto.getRandomValues(array);
console.log(array); // random bytes

// Generate UUID
console.log(crypto.randomUUID()); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

// Hashing
async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

hashText("hello world").then(hash => console.log("SHA-256:", hash));

// AES-GCM encryption
async function encrypt(plaintext, keyData) {
  const key = await crypto.subtle.importKey(
    "raw", keyData, { name: "AES-GCM" }, false, ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return { ciphertext, iv };
}

// Key generation
async function generateKey() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
  );
}


// ─────────────────────────────────────────────
// 6. STREAMS API
// ─────────────────────────────────────────────

// ReadableStream — read data chunk by chunk
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue("Hello ");
    controller.enqueue("World");
    controller.close();
  }
});

async function readStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}

// WritableStream
const writableStream = new WritableStream({
  write(chunk) { console.log("Writing:", chunk); },
  close() { console.log("Stream closed"); },
  abort(err) { console.error("Stream aborted:", err); }
});

// TransformStream — transform data as it flows
const upperCaseTransform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  }
});

// Pipe streams together
readableStream
  .pipeThrough(upperCaseTransform)
  .pipeTo(writableStream);


// ─────────────────────────────────────────────
// 7. BROADCAST CHANNEL & SHARED WORKERS
// ─────────────────────────────────────────────

// BroadcastChannel — communicate between tabs/windows of same origin
const bc = new BroadcastChannel("notifications");

bc.postMessage({ type: "notification", text: "Hello from tab 1!" });

bc.onmessage = (e) => {
  console.log("Message from another tab:", e.data);
};

// SharedWorker — shared across multiple browsing contexts
// const sharedWorker = new SharedWorker("shared-worker.js");
// sharedWorker.port.postMessage("hello");
// sharedWorker.port.onmessage = (e) => console.log(e.data);


// ─────────────────────────────────────────────
// 8. CANVAS API (brief)
// ─────────────────────────────────────────────

function setupCanvas() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 800;
  canvas.height = 600;

  // Draw shapes
  ctx.fillStyle = "#3498db";
  ctx.fillRect(10, 10, 100, 50);            // rectangle

  ctx.strokeStyle = "#e74c3c";
  ctx.lineWidth = 3;
  ctx.strokeRect(120, 10, 100, 50);         // outlined rectangle

  ctx.beginPath();
  ctx.arc(300, 35, 30, 0, Math.PI * 2);    // circle
  ctx.fillStyle = "#2ecc71";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 10);
  ctx.lineTo(450, 60);
  ctx.lineTo(350, 60);
  ctx.closePath();
  ctx.fillStyle = "#f39c12";
  ctx.fill();

  // Text
  ctx.font = "bold 24px Arial";
  ctx.fillStyle = "#2c3e50";
  ctx.fillText("Hello Canvas!", 10, 120);

  // Image
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 10, 140, 200, 150);
  img.src = "https://example.com/image.png";

  // Gradient
  const gradient = ctx.createLinearGradient(0, 0, 800, 0);
  gradient.addColorStop(0, "#3498db");
  gradient.addColorStop(1, "#e74c3c");
  ctx.fillStyle = gradient;
  ctx.fillRect(10, 310, 780, 50);

  // Animation loop
  let angle = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(400, 300);
    ctx.rotate(angle);
    ctx.fillRect(-25, -25, 50, 50);
    ctx.restore();
    angle += 0.05;
    requestAnimationFrame(animate);
  }
  animate();
}


// ─────────────────────────────────────────────
// 9. USEFUL UTILITY PATTERNS
// ─────────────────────────────────────────────

// ── UUID generation ──
const uuid = () => crypto.randomUUID();

// ── Deep equal ──
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key]));
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));  // true
console.log(deepEqual({ a: 1 }, { a: 2 }));         // false

// ── Omit / Pick (like Lodash) ──
const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));

const user = { id: 1, name: "Alice", password: "secret", email: "alice@example.com" };
console.log(omit(user, ["password"]));         // { id, name, email }
console.log(pick(user, ["name", "email"]));    // { name, email }

// ── Flatten object ──
function flattenObject(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, fullKey));
    } else {
      acc[fullKey] = val;
    }
    return acc;
  }, {});
}

const nested2 = { a: { b: { c: 1 }, d: 2 }, e: 3 };
console.log(flattenObject(nested2)); // { "a.b.c": 1, "a.d": 2, "e": 3 }

// ── Chunk array ──
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
console.log(chunk([1,2,3,4,5,6,7], 3)); // [[1,2,3],[4,5,6],[7]]

// ── Zip arrays ──
const zip = (...arrays) =>
  Array.from({ length: Math.min(...arrays.map(a => a.length)) }, (_, i) =>
    arrays.map(a => a[i])
  );
console.log(zip([1,2,3], ["a","b","c"], [true,false,true]));
// [[1,"a",true],[2,"b",false],[3,"c",true]]

// ── Group by ──
const groupBy = (arr, fn) =>
  arr.reduce((groups, item) => {
    const key = fn(item);
    (groups[key] = groups[key] || []).push(item);
    return groups;
  }, {});

const people = [
  { name: "Alice", dept: "Engineering" },
  { name: "Bob", dept: "Marketing" },
  { name: "Carol", dept: "Engineering" }
];
console.log(groupBy(people, p => p.dept));
// { Engineering: [{Alice},{Carol}], Marketing: [{Bob}] }

// Object.groupBy (ES2024)
// const grouped = Object.groupBy(people, p => p.dept);

// ── Pipe / Compose utilities ──
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const process = pipe(
  x => x.trim(),
  x => x.toLowerCase(),
  x => x.replace(/\s+/g, "-")
);
console.log(process("  Hello World  ")); // "hello-world"

// ── Sleep / wait ──
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function withDelay() {
  console.log("start");
  await sleep(1000);
  console.log("after 1 second");
}


// ─────────────────────────────────────────────
// 10. TESTING CONCEPTS (without framework)
// ─────────────────────────────────────────────

// Simple test runner
class TestRunner {
  #tests = [];
  #passed = 0;
  #failed = 0;

  test(name, fn) {
    this.#tests.push({ name, fn });
    return this;
  }

  async run() {
    console.log(`Running ${this.#tests.length} tests...\n`);

    for (const { name, fn } of this.#tests) {
      try {
        await fn();
        console.log(`✓ ${name}`);
        this.#passed++;
      } catch (err) {
        console.error(`✗ ${name}\n   ${err.message}`);
        this.#failed++;
      }
    }

    console.log(`\n${this.#passed} passed, ${this.#failed} failed`);
  }
}

// Simple assertions
function expect(received) {
  return {
    toBe(expected) {
      if (!Object.is(received, expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(received)}`);
    },
    toEqual(expected) {
      if (!deepEqual(received, expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(received)}`);
    },
    toBeTruthy() {
      if (!received) throw new Error(`Expected truthy, got ${received}`);
    },
    toBeFalsy() {
      if (received) throw new Error(`Expected falsy, got ${received}`);
    },
    toThrow(message) {
      if (typeof received !== "function") throw new Error("Expected a function");
      try {
        received();
        throw new Error("Expected function to throw");
      } catch (e) {
        if (message && !e.message.includes(message))
          throw new Error(`Expected to throw "${message}", got "${e.message}"`);
      }
    }
  };
}

// Usage
const runner = new TestRunner()
  .test("add returns correct sum", () => {
    expect(1 + 1).toBe(2);
    expect(0 + 0).toBe(0);
  })
  .test("array deepEqual works", () => {
    expect([1, [2, 3]]).toEqual([1, [2, 3]]);
  })
  .test("chunk splits correctly", () => {
    expect(chunk([1,2,3,4], 2)).toEqual([[1,2],[3,4]]);
  })
  .test("this test will fail", () => {
    expect(1 + 1).toBe(3);  // intentional failure
  });

runner.run();


// ─────────────────────────────────────────────
// 11. COMMON JS GOTCHAS CHEATSHEET
// ─────────────────────────────────────────────

// ── Type coercion surprises ──
console.log([] + []);      // "" (both convert to "")
console.log([] + {});      // "[object Object]"
console.log({} + []);      // "[object Object]" or 0 depending on context
console.log(+"");           // 0
console.log(+null);         // 0
console.log(+undefined);    // NaN
console.log(+"3");          // 3
console.log(+true);         // 1
console.log(+false);        // 0

// ── NaN quirk ──
console.log(NaN === NaN);       // false! (NaN ≠ NaN)
console.log(Number.isNaN(NaN)); // true (use this)

// ── null vs undefined ──
console.log(null == undefined);  // true  (loose)
console.log(null === undefined); // false (strict)
console.log(typeof null);        // "object" (bug in JS)

// ── Array holes ──
const arr = [1, 2, , 4];       // hole at index 2
console.log(arr.length);        // 4
console.log(arr[2]);            // undefined (reads as undefined)
console.log(2 in arr);          // false (it's a real hole, not undefined)

// ── Object.keys vs for…in ──
const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

Object.keys(child).forEach(k => console.log(k));  // ["own"] — only own
for (const k in child) console.log(k);             // "own", "inherited"

// ── Arguments object ──
function argsDemo() {
  console.log(arguments);           // array-like, not an array
  console.log(typeof arguments);    // "object"
  const arr = [...arguments];       // convert to real array
  // Arrow functions do NOT have `arguments`
}

// ── parseInt quirks ──
console.log(parseInt("08"));    // 8 (modern browsers — was 0 in old ones)
console.log(parseInt("0x10"));  // 16 (auto-detects hex)
console.log(parseInt("10", 2)); // 2  (binary)

// ── Floating point ──
console.log(0.1 + 0.2);              // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);     // false!
// Fix: use toFixed or epsilon comparison
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true

// ── Object comparison ──
console.log({} === {});          // false (different references)
console.log([] === []);          // false (different references)
console.log(JSON.stringify({a:1}) === JSON.stringify({a:1})); // true (compare as strings)

// ── typeof function ──
console.log(typeof function(){});   // "function" (not "object" like you might expect)
console.log(typeof class{});        // "function" (classes are functions)
console.log(typeof null);           // "object" (historical bug, won't be fixed)

// ── Delete operator ──
const obj2 = { a: 1, b: 2 };
delete obj2.a;       // true — works
delete obj2;         // false — can't delete a variable
const frozen = Object.freeze({ x: 1 });
delete frozen.x;     // false — can't delete from frozen object

// ── In operator ──
const arr2 = [1, 2, 3];
console.log(0 in arr2);      // true (index 0 exists)
console.log(3 in arr2);      // false (index 3 doesn't exist)
console.log("length" in arr2); // true (arrays have length property)


// ─────────────────────────────────────────────
// 12. NEWER JS FEATURES REFERENCE
// ─────────────────────────────────────────────

// ── ES2020 ──
const val1 = null ?? "default";        // "default" (nullish coalescing)
const val2 = 0 ?? "default";           // 0 (0 is not null/undefined)
const val3 = obj?.deeply?.nested;      // undefined (optional chaining)
const val4 = arr?.[0];                 // optional chaining with array
obj?.method?.();                        // optional chaining with function call
const bigInt2 = 9007199254740991n;     // BigInt literal

// ── ES2021 ──
let str3 = null;
str3 ??= "assigned";  // assign if null/undefined
let count3 = 0;
count3 ||= 10;        // assign if falsy
let active = true;
active &&= active && someCondition;  // assign if truthy

const str4 = "aabbcc".replaceAll("b", "X"); // "aaXXcc"
const p2 = Promise.any([p1, p2, p3]);       // first fulfilled

// ── ES2022 ──
class ModernClass {
  publicField = "public";
  #privateField = "private";           // private field
  static staticField = "static";
  static #privateStatic = "pstatic";  // private static

  #privateMethod() { return this.#privateField; }
  static #privateStaticMethod() {}

  get value() { return this.#privateMethod(); }
}

const cloned = structuredClone({ a: 1, b: [2, 3] }); // deep clone
const exists = Object.hasOwn(obj2, "a");               // modern hasOwnProperty
const at = [1,2,3].at(-1);                            // 3 (negative indexing)

// ── ES2023 ──
const arr3 = [1, 2, 3];
arr3.toSorted((a, b) => b - a);   // [3,2,1] — non-mutating sort
arr3.toReversed();                  // [3,2,1] — non-mutating reverse
arr3.with(1, 99);                   // [1,99,3] — non-mutating index change
arr3.findLast(n => n > 1);          // 3
arr3.findLastIndex(n => n > 1);     // 2

// ── ES2024 ──
// Object.groupBy
const items2 = [1, 2, 3, 4, 5, 6];
const grouped2 = Object.groupBy(items2, n => n % 2 === 0 ? "even" : "odd");
console.log(grouped2); // { odd: [1,3,5], even: [2,4,6] }

// Map.groupBy
const mapGrouped = Map.groupBy(items2, n => n % 2 === 0 ? "even" : "odd");

// Promise.withResolvers
const { promise: p3, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve("done!"), 1000);
p3.then(console.log); // "done!" after 1 second

// Temporal (Stage 3 — not yet standard)
// const now2 = Temporal.Now.instant();
// const date2 = Temporal.PlainDate.from("2024-01-15");

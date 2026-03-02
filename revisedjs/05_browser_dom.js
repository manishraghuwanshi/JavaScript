// ============================================================
// FILE 5: Browser APIs — DOM, Events, Storage, Web APIs
// Note: Run in a browser environment (not Node.js)
// ============================================================


// ─────────────────────────────────────────────
// 1. THE DOM — Document Object Model
// ─────────────────────────────────────────────
// The DOM is a tree representation of the HTML document.
// JS can read and modify every node.

// ── Selecting elements ──
const byId    = document.getElementById("app");
const byClass = document.getElementsByClassName("card");     // HTMLCollection (live)
const byTag   = document.getElementsByTagName("div");        // HTMLCollection (live)

const single  = document.querySelector(".card");             // first match
const all     = document.querySelectorAll(".card");          // NodeList (static)
const parent  = document.querySelector(".container");
const child   = parent?.querySelector(".title");

// Convert NodeList to array for array methods
const cards = [...document.querySelectorAll(".card")];
cards.forEach(card => console.log(card.textContent));

// ── Traversal ──
const el = document.querySelector("#app");

el.parentElement;           // direct parent
el.children;                // HTMLCollection of child elements
el.firstElementChild;       // first element child
el.lastElementChild;        // last element child
el.nextElementSibling;      // next sibling element
el.previousElementSibling;  // previous sibling element

el.childNodes;              // NodeList including text nodes and comments
el.parentNode;              // parent node (may include non-elements)

// ── Creating elements ──
const div = document.createElement("div");
const text = document.createTextNode("Hello World");
const frag = document.createDocumentFragment();  // batch DOM updates

div.appendChild(text);     // append text to div

// ── Inserting elements ──
const container = document.querySelector(".container");

container.appendChild(div);            // append to end
container.prepend(div);                // insert at start
container.insertBefore(div, child);    // insert before specific child
container.append("text", div);        // append multiple (string or element)

// Modern: insertAdjacentHTML / insertAdjacentElement
container.insertAdjacentHTML("beforebegin", "<p>Before container</p>");
container.insertAdjacentHTML("afterbegin",  "<p>First child</p>");
container.insertAdjacentHTML("beforeend",   "<p>Last child</p>");
container.insertAdjacentHTML("afterend",    "<p>After container</p>");

// ── Removing & Replacing ──
el.remove();                                   // remove self
container.removeChild(child);                  // remove specific child
container.replaceChild(div, child);            // replace child
child.replaceWith(div);                        // modern replace

// ── Cloning ──
const clone = el.cloneNode(false);  // shallow (no children)
const deepClone = el.cloneNode(true); // deep (with children)


// ─────────────────────────────────────────────
// 2. MODIFYING ELEMENTS
// ─────────────────────────────────────────────

const card = document.querySelector(".card");

// ── Content ──
card.textContent = "Safe text (no HTML parsed)";     // plain text
card.innerHTML = "<strong>Bold</strong> content";    // parses HTML (XSS risk!)
card.innerText = "Visible text";                     // respects CSS visibility

// ── Attributes ──
card.setAttribute("data-id", "123");
card.getAttribute("data-id");         // "123"
card.removeAttribute("data-id");
card.hasAttribute("class");           // true/false

// ── Dataset (data-* attributes) ──
// HTML: <div data-user-id="42" data-role="admin">
card.dataset.userId;   // "42"    (camelCase auto-conversion)
card.dataset.role;     // "admin"
card.dataset.newProp = "value";  // creates data-new-prop attribute

// ── Classes ──
card.classList.add("active");
card.classList.remove("hidden");
card.classList.toggle("selected");            // add if absent, remove if present
card.classList.toggle("selected", true);     // force add
card.classList.toggle("selected", false);    // force remove
card.classList.replace("active", "inactive");
card.classList.contains("active");           // true/false
card.className = "card active highlight";   // set all at once

// ── Styles ──
card.style.color = "red";
card.style.backgroundColor = "blue";   // camelCase for hyphenated properties
card.style.cssText = "color: red; background: blue;";  // set multiple

// Computed styles (reflects actual applied styles including CSS)
const computed = window.getComputedStyle(card);
console.log(computed.fontSize);    // "16px"
console.log(computed.display);     // "flex"

// ── Dimensions & Position ──
const rect = card.getBoundingClientRect();
console.log(rect.top, rect.left, rect.width, rect.height);

card.offsetWidth;   // width including padding
card.offsetHeight;  // height including padding
card.scrollTop;     // how much scrolled
card.scrollLeft;
card.clientWidth;   // width excluding scrollbar
card.clientHeight;

// Scroll
card.scrollIntoView({ behavior: "smooth" });
window.scrollTo({ top: 0, behavior: "smooth" });


// ─────────────────────────────────────────────
// 3. EVENTS
// ─────────────────────────────────────────────

const button = document.querySelector("button");

// ── Adding listeners ──
function handleClick(event) {
  console.log("Clicked!", event.target);
}
button.addEventListener("click", handleClick);

// ── Removing listeners ── (must use same function reference)
button.removeEventListener("click", handleClick);

// ── Options ──
button.addEventListener("click", handleClick, {
  once: true,      // auto-removes after first call
  passive: true,   // won't call preventDefault (better scroll performance)
  capture: true    // fires during capture phase (top-down)
});

// ── The Event Object ──
button.addEventListener("click", (e) => {
  e.target;          // element that triggered event
  e.currentTarget;   // element listener is attached to
  e.type;            // "click"
  e.timeStamp;       // when event fired
  e.bubbles;         // does it bubble?

  e.preventDefault();    // stop default action (e.g. form submit, link follow)
  e.stopPropagation();   // stop bubbling up
  e.stopImmediatePropagation(); // stop all remaining listeners too
});

// ── Mouse events ──
document.addEventListener("mousemove", (e) => {
  console.log(e.clientX, e.clientY);  // relative to viewport
  console.log(e.pageX, e.pageY);      // relative to page
  console.log(e.buttons);             // which mouse button
});

const imgEl = document.querySelector("img");
imgEl.addEventListener("mouseenter", () => console.log("hovered"));
imgEl.addEventListener("mouseleave", () => console.log("left"));
imgEl.addEventListener("dblclick", () => console.log("double clicked"));
imgEl.addEventListener("contextmenu", (e) => {
  e.preventDefault();  // disable right-click menu
  console.log("right clicked");
});

// ── Keyboard events ──
document.addEventListener("keydown", (e) => {
  console.log(e.key);      // "Enter", "a", "ArrowUp" etc.
  console.log(e.code);     // "KeyA", "Enter", "ArrowUp"
  console.log(e.ctrlKey, e.shiftKey, e.altKey, e.metaKey);

  if (e.key === "Escape") console.log("Escape pressed");
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    console.log("Ctrl+S intercepted");
  }
});
document.addEventListener("keyup", (e) => console.log("keyup:", e.key));

// ── Form events ──
const form = document.querySelector("form");
const input = document.querySelector("input");

form.addEventListener("submit", (e) => {
  e.preventDefault();  // stop page reload
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});

input.addEventListener("input", (e) => {
  console.log("Typing:", e.target.value);  // fires on every keystroke
});
input.addEventListener("change", (e) => {
  console.log("Changed:", e.target.value);  // fires on blur if changed
});
input.addEventListener("focus", () => console.log("focused"));
input.addEventListener("blur",  () => console.log("blurred"));

// ── Event Delegation — attach ONE listener to parent ──
// More efficient than attaching to each child
document.querySelector(".list").addEventListener("click", (e) => {
  const item = e.target.closest(".list-item");  // find target or ancestor
  if (!item) return;
  console.log("Item clicked:", item.dataset.id);
});

// ── Custom events ──
const myEvent = new CustomEvent("userLoggedIn", {
  detail: { userId: 123, name: "Alice" },
  bubbles: true,
  cancelable: true
});
document.dispatchEvent(myEvent);

document.addEventListener("userLoggedIn", (e) => {
  console.log("User logged in:", e.detail);
});

// ── Scroll & Resize ──
window.addEventListener("scroll", (e) => {
  console.log("ScrollY:", window.scrollY);
});

window.addEventListener("resize", () => {
  console.log(`Window: ${window.innerWidth}x${window.innerHeight}`);
});

// ── Load events ──
window.addEventListener("load", () => {
  console.log("All resources loaded (images, scripts, etc.)");
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("HTML parsed, DOM ready (images may still load)");
});

// ── Intersection Observer — lazy loading, infinite scroll ──
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log("Element is visible:", entry.target);
      obs.unobserve(entry.target);  // stop observing after seen once
    }
  });
}, {
  threshold: 0.5,     // 50% visible to trigger
  rootMargin: "0px 0px -100px 0px"  // shrink detection zone
});

document.querySelectorAll(".lazy").forEach(el => observer.observe(el));

// ── Mutation Observer — watch DOM changes ──
const mutationObs = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    console.log("Mutation:", m.type, m.target);
    m.addedNodes.forEach(n => console.log("Added:", n));
    m.removedNodes.forEach(n => console.log("Removed:", n));
  });
});

mutationObs.observe(document.body, {
  childList: true,   // watch children added/removed
  subtree: true,     // watch all descendants
  attributes: true,  // watch attribute changes
  characterData: true // watch text changes
});
// mutationObs.disconnect(); // stop observing

// ── Resize Observer — element resize ──
const resizeObs = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`Element resized: ${width}x${height}`);
  });
});
resizeObs.observe(card);


// ─────────────────────────────────────────────
// 4. WEB STORAGE
// ─────────────────────────────────────────────

// ── localStorage — persists across sessions ──
localStorage.setItem("username", "Alice");
localStorage.setItem("settings", JSON.stringify({ theme: "dark", lang: "en" }));

const username = localStorage.getItem("username");       // "Alice"
const settings = JSON.parse(localStorage.getItem("settings") || "{}");

localStorage.removeItem("username");
localStorage.clear();  // remove everything

// Iterate over all keys
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}

// Helper wrapper (avoids repetitive JSON.parse/stringify)
const storage = {
  get: (key, defaultVal = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? defaultVal; }
    catch { return defaultVal; }
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear()
};

storage.set("user", { id: 1, name: "Alice" });
console.log(storage.get("user")); // { id:1, name:"Alice" }

// ── sessionStorage — same API, cleared when tab closes ──
sessionStorage.setItem("tempToken", "abc123");
const token = sessionStorage.getItem("tempToken");

// ── Storage events (fires in OTHER tabs) ──
window.addEventListener("storage", (e) => {
  console.log("Storage changed:", e.key, e.oldValue, e.newValue);
});

// ── Cookies ──
// Set
document.cookie = "name=Alice; expires=Fri, 31 Dec 2026 23:59:59 GMT; path=/; SameSite=Strict";
document.cookie = "theme=dark; max-age=31536000; path=/";  // 1 year in seconds

// Read (all cookies as one string)
const cookies = document.cookie.split("; ").reduce((acc, pair) => {
  const [key, val] = pair.split("=");
  acc[decodeURIComponent(key)] = decodeURIComponent(val);
  return acc;
}, {});
console.log(cookies.name);  // "Alice"

// Delete (set expiry in past)
document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";


// ─────────────────────────────────────────────
// 5. IndexedDB (brief — for large/structured data)
// ─────────────────────────────────────────────

const request = indexedDB.open("MyDatabase", 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
  store.createIndex("name", "name", { unique: false });
};

request.onsuccess = (e) => {
  const db = e.target.result;

  // Add
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");
  store.add({ name: "Alice", email: "alice@example.com" });

  // Get
  store.get(1).onsuccess = (e) => console.log("User:", e.target.result);

  // Get all
  store.getAll().onsuccess = (e) => console.log("All:", e.target.result);

  tx.oncomplete = () => console.log("Transaction complete");
};

request.onerror = (e) => console.error("IndexedDB error:", e.target.error);


// ─────────────────────────────────────────────
// 6. URL & HISTORY API
// ─────────────────────────────────────────────

// URL object
const url = new URL("https://example.com/path?search=hello&page=2#section");
console.log(url.hostname);  // "example.com"
console.log(url.pathname);  // "/path"
console.log(url.search);    // "?search=hello&page=2"
console.log(url.hash);      // "#section"

const params = url.searchParams;
params.get("search");    // "hello"
params.set("page", "3");
params.append("filter", "active");
params.delete("search");
console.log(params.toString()); // "page=3&filter=active"

// Iterate params
for (const [key, val] of params) {
  console.log(key, val);
}

// History API (SPA navigation)
history.pushState({ page: 2 }, "Page 2", "/page/2");   // add to history
history.replaceState({ page: 1 }, "Page 1", "/page/1"); // replace current
history.back();     // like clicking back
history.forward();
history.go(-2);     // go back 2 steps

window.addEventListener("popstate", (e) => {
  console.log("Navigated:", e.state);  // restore state
});

// Current location info
console.log(window.location.href);
console.log(window.location.origin);
console.log(window.location.pathname);
window.location.reload();
window.location.href = "https://example.com"; // navigate


// ─────────────────────────────────────────────
// 7. NAVIGATOR & DEVICE APIs
// ─────────────────────────────────────────────

// Online status
console.log(navigator.onLine);
window.addEventListener("online", () => console.log("Back online"));
window.addEventListener("offline", () => console.log("Offline"));

// Geolocation
navigator.geolocation.getCurrentPosition(
  (pos) => {
    console.log("Lat:", pos.coords.latitude);
    console.log("Lng:", pos.coords.longitude);
    console.log("Accuracy:", pos.coords.accuracy, "meters");
  },
  (err) => console.error("Geo error:", err.message),
  { enableHighAccuracy: true, timeout: 5000 }
);

// Watch position (continuous updates)
const watchId = navigator.geolocation.watchPosition(pos => {
  console.log("Moving:", pos.coords.latitude, pos.coords.longitude);
});
navigator.geolocation.clearWatch(watchId);

// Clipboard
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
  console.log("Copied!");
}
async function readClipboard() {
  const text = await navigator.clipboard.readText();
  console.log("Pasted:", text);
}

// Battery
navigator.getBattery?.().then(battery => {
  console.log("Level:", battery.level * 100 + "%");
  console.log("Charging:", battery.charging);
});

// Device info
console.log(navigator.userAgent);
console.log(navigator.language);      // "en-US"
console.log(navigator.cookieEnabled); // true
console.log(navigator.hardwareConcurrency); // CPU cores

// Share API
async function share(data) {
  if (navigator.canShare?.(data)) {
    await navigator.share(data);
  }
}
share({ title: "Check this", text: "Cool article", url: "https://example.com" });


// ─────────────────────────────────────────────
// 8. WINDOW OBJECT
// ─────────────────────────────────────────────

// Dimensions
console.log(window.innerWidth, window.innerHeight);   // viewport
console.log(window.outerWidth, window.outerHeight);   // browser window
console.log(screen.width, screen.height);             // physical screen
console.log(window.devicePixelRatio);                 // e.g. 2 for Retina

// Dialogs
window.alert("Alert!");
const ok = window.confirm("Are you sure?");    // boolean
const input2 = window.prompt("Your name?", "Default"); // string | null

// Timers (more in file 6)
const timeoutId = setTimeout(() => {}, 1000);
clearTimeout(timeoutId);

const intervalId = setInterval(() => {}, 500);
clearInterval(intervalId);

// Animation
const rafId = requestAnimationFrame((timestamp) => {
  console.log("Frame at:", timestamp);
});
cancelAnimationFrame(rafId);

// Open / Close windows
const newWin = window.open("https://example.com", "_blank", "width=600,height=400");
newWin?.close();


// ─────────────────────────────────────────────
// 9. CSS & ANIMATIONS FROM JS
// ─────────────────────────────────────────────

// CSS Variables
document.documentElement.style.setProperty("--primary-color", "#3498db");
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--primary-color");

// Web Animations API
const anim = card.animate([
  { transform: "translateX(0)", opacity: 1 },
  { transform: "translateX(100px)", opacity: 0.5 }
], {
  duration: 500,
  easing: "ease-in-out",
  fill: "forwards",   // keep end state
  iterations: Infinity,
  delay: 200
});

anim.pause();
anim.play();
anim.reverse();
anim.cancel();
anim.finish();

anim.addEventListener("finish", () => console.log("Animation done"));

// CSSStyleDeclaration — list all styles
const allStyles = card.style;
console.log([...allStyles]);  // all inline style properties


// ─────────────────────────────────────────────
// 10. TEMPLATE LITERALS IN DOM
// ─────────────────────────────────────────────

function renderUserCard(user) {
  return `
    <div class="user-card" data-id="${user.id}">
      <img src="${user.avatar}" alt="${user.name}" loading="lazy">
      <h2>${escapeHtml(user.name)}</h2>
      <p>${escapeHtml(user.bio)}</p>
    </div>
  `;
}

// Always escape user input to prevent XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Batch DOM update using fragment
function renderList(items) {
  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.dataset.id = item.id;
    fragment.appendChild(li);
  });
  document.querySelector("ul").appendChild(fragment);  // single reflow
}

// Virtual DOM concept — update only differences
function updateElement(parent, newNode, oldNode, index = 0) {
  if (!oldNode) { parent.appendChild(newNode); return; }
  if (!newNode) { parent.removeChild(parent.childNodes[index]); return; }
  if (newNode.nodeName !== oldNode.nodeName) {
    parent.replaceChild(newNode, parent.childNodes[index]);
    return;
  }
  if (newNode.textContent !== oldNode.textContent) {
    parent.childNodes[index].textContent = newNode.textContent;
  }
}

// ============================================================
// FILE 3: Built-in Methods & Functions
// Topics: String, Array, Number, Math, Object, Date,
//         JSON, RegExp, Console, Set, Map, Browser APIs
// ============================================================


// ─────────────────────────────────────────────
// 1. STRING METHODS
// ─────────────────────────────────────────────

const str = "  Hello, World!  ";

// ── Length & access ──
console.log(str.length);          // 18
console.log(str[0]);              // " "
console.log(str.charAt(2));       // "H"
console.log(str.charCodeAt(2));   // 72  (Unicode code point)
console.log(String.fromCharCode(72)); // "H"
console.log(str.at(-1));          // " "  (negative index from end, ES2022)

// ── Case ──
console.log("hello".toUpperCase()); // "HELLO"
console.log("HELLO".toLowerCase()); // "hello"

// ── Trim ──
console.log(str.trim());          // "Hello, World!"
console.log(str.trimStart());     // "Hello, World!  "
console.log(str.trimEnd());       // "  Hello, World!"

// ── Search ──
const s = "Hello, World!";
console.log(s.includes("World"));     // true
console.log(s.startsWith("Hello"));   // true
console.log(s.endsWith("!"));         // true
console.log(s.indexOf("o"));          // 4  (first occurrence)
console.log(s.lastIndexOf("o"));      // 8  (last occurrence)
console.log(s.search(/world/i));      // 7  (regex, returns index)

// ── Extraction ──
console.log(s.slice(7, 12));          // "World"
console.log(s.slice(-6));             // "World!"  (from end)
console.log(s.substring(7, 12));      // "World"   (no negatives)
// console.log(s.substr(7, 5));       // "World"   (deprecated)

// ── Replace ──
console.log(s.replace("World", "JS"));          // "Hello, JS!"   (first)
console.log("aabbcc".replaceAll("b", "X"));     // "aaXXcc"
console.log("hello".replace(/[aeiou]/g, "*"));  // "h*ll*"

// ── Split & Join ──
console.log("a,b,c".split(","));       // ["a","b","c"]
console.log("hello".split(""));        // ["h","e","l","l","o"]
console.log(["a","b","c"].join("-"));  // "a-b-c"

// ── Pad & Repeat ──
console.log("5".padStart(3, "0"));    // "005"
console.log("5".padEnd(3, "0"));      // "500"
console.log("ha".repeat(3));          // "hahaha"

// ── Template & misc ──
console.log("abc".concat("def", "ghi")); // "abcdefghi"
console.log("  hi  ".trim());            // "hi"

// ── String to Array & spread ──
const chars = [...("hello")];  // ["h","e","l","l","o"]

// ── matchAll (ES2020) ──
const text = "cat bat sat";
const matches = [...text.matchAll(/[a-z]at/g)];
console.log(matches.map(m => m[0])); // ["cat","bat","sat"]

// ── at() — easy last element ──
console.log("hello".at(-1)); // "o"


// ─────────────────────────────────────────────
// 2. ARRAY METHODS
// ─────────────────────────────────────────────

const fruits = ["apple", "banana", "cherry", "date"];

// ── Access ──
console.log(fruits[0]);            // "apple"
console.log(fruits.at(-1));        // "date"
console.log(fruits.length);        // 4

// ── Mutating methods ──
const arr = [1, 2, 3];
arr.push(4);          // [1,2,3,4]  — add to end
arr.pop();            // [1,2,3]    — remove from end
arr.unshift(0);       // [0,1,2,3]  — add to front
arr.shift();          // [1,2,3]    — remove from front
arr.splice(1, 1, 99); // [1,99,3]   — remove 1 at index 1, insert 99
console.log(arr);

arr.reverse();   // [3,99,1]  — reverse in place
arr.sort((a, b) => a - b);  // [1,3,99]  — sort with comparator

// ── Non-mutating methods ──
const nums = [3, 1, 4, 1, 5, 9, 2, 6];

// slice
console.log(nums.slice(2, 5));   // [4,1,5]

// concat
console.log([1, 2].concat([3, 4], [5]));  // [1,2,3,4,5]

// spread (alternative)
console.log([...[1,2], ...[3,4]]); // [1,2,3,4]

// ── Iteration ──
// forEach — side effects only, no return
[1, 2, 3].forEach((n, i, arr) => {
  process.stdout.write(`${i}:${n} `);
});
console.log();

// map — transform each element, returns new array
const doubled = [1, 2, 3].map(n => n * 2);
console.log(doubled); // [2,4,6]

// filter — keep elements that pass test
const evens = [1, 2, 3, 4, 5, 6].filter(n => n % 2 === 0);
console.log(evens); // [2,4,6]

// reduce — accumulate into single value
const sum = [1, 2, 3, 4, 5].reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// reduceRight — same but from right
const str2 = ["a", "b", "c"].reduceRight((acc, s) => acc + s, "");
console.log(str2); // "cba"

// find / findIndex
const found = [1, 2, 3, 4].find(n => n > 2);
console.log(found);           // 3
console.log([1,2,3,4].findIndex(n => n > 2)); // 2

// findLast / findLastIndex (ES2023)
console.log([1,2,3,4].findLast(n => n % 2 === 0));       // 4
console.log([1,2,3,4].findLastIndex(n => n % 2 === 0));   // 3

// some / every
console.log([1,2,3].some(n => n > 2));   // true  (at least one)
console.log([1,2,3].every(n => n > 0));  // true  (all)
console.log([1,2,3].every(n => n > 1));  // false

// includes
console.log([1,2,3].includes(2));     // true
console.log([1,2,NaN].includes(NaN)); // true  (uses SameValueZero)

// flat / flatMap
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());      // [1,2,3,4,[5,6]]
console.log(nested.flat(2));     // [1,2,3,4,5,6]
console.log(nested.flat(Infinity)); // fully flatten any depth

const sentences = ["Hello World", "Foo Bar"];
console.log(sentences.flatMap(s => s.split(" "))); // ["Hello","World","Foo","Bar"]

// fill
console.log(new Array(5).fill(0));           // [0,0,0,0,0]
console.log([1,2,3,4,5].fill(0, 2, 4));     // [1,2,0,0,5]

// copyWithin
console.log([1,2,3,4,5].copyWithin(0, 3)); // [4,5,3,4,5]

// entries / keys / values
for (const [i, v] of ["a","b","c"].entries()) {
  console.log(i, v);
}

// indexOf
console.log([1,2,3,2].indexOf(2));     // 1
console.log([1,2,3,2].lastIndexOf(2)); // 3

// Array.from
console.log(Array.from("hello"));          // ["h","e","l","l","o"]
console.log(Array.from({length:5}, (_,i) => i)); // [0,1,2,3,4]
console.log(Array.from(new Set([1,2,2,3]))); // [1,2,3]

// Array.of
console.log(Array.of(1, 2, 3)); // [1,2,3]

// Array.isArray
console.log(Array.isArray([]));     // true
console.log(Array.isArray("abc"));  // false

// toSorted / toReversed / with (ES2023 non-mutating alternatives)
const original = [3, 1, 2];
console.log(original.toSorted((a,b) => a-b));  // [1,2,3]
console.log(original.toReversed());             // [2,1,3]
console.log(original.with(1, 99));              // [3,99,2]
console.log(original);  // [3,1,2]  — unchanged!


// ─────────────────────────────────────────────
// 3. NUMBER METHODS
// ─────────────────────────────────────────────

const n = 3.14159;
console.log(n.toFixed(2));       // "3.14"      — string
console.log(n.toPrecision(4));   // "3.142"     — string
console.log(n.toString());       // "3.14159"
console.log(n.toString(2));      // binary string
console.log(n.toString(16));     // hex string
console.log((255).toString(16)); // "ff"

// Static methods
console.log(Number.isInteger(42));       // true
console.log(Number.isInteger(3.14));     // false
console.log(Number.isFinite(Infinity));  // false
console.log(Number.isNaN(NaN));          // true  (better than global isNaN)
console.log(Number.parseFloat("3.14abc")); // 3.14
console.log(Number.parseInt("42px"));      // 42

console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER);  // -9007199254740991
console.log(Number.EPSILON);           // 2.220446049250313e-16
console.log(Number.MAX_VALUE);         // largest positive number
console.log(Number.POSITIVE_INFINITY); // Infinity


// ─────────────────────────────────────────────
// 4. MATH METHODS
// ─────────────────────────────────────────────

console.log(Math.abs(-5));        // 5
console.log(Math.ceil(4.1));      // 5
console.log(Math.floor(4.9));     // 4
console.log(Math.round(4.5));     // 5
console.log(Math.trunc(4.9));     // 4  (just remove decimal)
console.log(Math.trunc(-4.9));    // -4

console.log(Math.max(1, 5, 3));   // 5
console.log(Math.min(1, 5, 3));   // 1
console.log(Math.pow(2, 8));      // 256
console.log(Math.sqrt(144));      // 12
console.log(Math.cbrt(27));       // 3

console.log(Math.log(Math.E));    // 1
console.log(Math.log2(8));        // 3
console.log(Math.log10(1000));    // 3

console.log(Math.sin(Math.PI / 2)); // 1
console.log(Math.cos(0));           // 1

console.log(Math.random());         // 0 ≤ x < 1

// Random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randomInt(1, 6));  // dice roll

console.log(Math.sign(-5));   // -1
console.log(Math.sign(0));    //  0
console.log(Math.sign(5));    //  1

console.log(Math.hypot(3, 4));  // 5  (√(3²+4²))
console.log(Math.clz32(1));     // 31 (count leading zeros in 32-bit)


// ─────────────────────────────────────────────
// 5. OBJECT METHODS
// ─────────────────────────────────────────────

const obj = { a: 1, b: 2, c: 3 };

console.log(Object.keys(obj));    // ["a","b","c"]
console.log(Object.values(obj));  // [1,2,3]
console.log(Object.entries(obj)); // [["a",1],["b",2],["c",3]]

// fromEntries — inverse of entries
const map = new Map([["x", 10], ["y", 20]]);
console.log(Object.fromEntries(map));  // { x:10, y:20 }
console.log(Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, v*2]))); // { a:2, b:4, c:6 }

// assign — shallow merge / copy
const target = { a: 1 };
Object.assign(target, { b: 2 }, { c: 3 });
console.log(target); // { a:1, b:2, c:3 }

// spread (preferred for merging)
const merged = { ...obj, d: 4 };

// freeze / seal
const frozen = Object.freeze({ x: 1 });
frozen.x = 99;  // silently fails (throws in strict mode)
console.log(frozen.x); // 1

// hasOwn (ES2022 — preferred over hasOwnProperty)
console.log(Object.hasOwn(obj, "a"));  // true
console.log(Object.hasOwn(obj, "z"));  // false

// defineProperty
const person = {};
Object.defineProperty(person, "name", {
  value: "Alice",
  writable: false,
  enumerable: true,
  configurable: false
});
console.log(person.name); // "Alice"

// getPrototypeOf
console.log(Object.getPrototypeOf([]) === Array.prototype); // true

// create — custom prototype
const animal = { breathe() { return "breathing"; } };
const dog = Object.create(animal);
dog.bark = () => "woof";
console.log(dog.breathe()); // "breathing" (inherited)


// ─────────────────────────────────────────────
// 6. DATE METHODS
// ─────────────────────────────────────────────

const now = new Date();
const specific = new Date("2024-01-15T10:30:00");
const fromMs = new Date(0); // Unix epoch

console.log(now.getFullYear());   // e.g. 2026
console.log(now.getMonth());      // 0-11 (January = 0!)
console.log(now.getDate());       // day of month 1-31
console.log(now.getDay());        // day of week 0-6 (Sunday = 0)
console.log(now.getHours());      // 0-23
console.log(now.getMinutes());    // 0-59
console.log(now.getSeconds());    // 0-59
console.log(now.getMilliseconds()); // 0-999
console.log(now.getTime());       // milliseconds since epoch
console.log(Date.now());          // same — static, no object needed

// Setters
const d = new Date();
d.setFullYear(2025);
d.setMonth(11);   // December

// Formatting
console.log(now.toISOString());        // "2026-03-02T..."
console.log(now.toLocaleDateString()); // "3/2/2026" (locale-dependent)
console.log(now.toLocaleTimeString()); // "10:30:00 AM"
console.log(now.toLocaleString("en-US", { weekday: "long" })); // "Monday"
console.log(now.toUTCString());        // "Mon, 02 Mar 2026 ..."

// Date arithmetic
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const diff = Math.round((tomorrow - now) / 1000 / 60 / 60); // hours
console.log(diff); // ~24


// ─────────────────────────────────────────────
// 7. JSON METHODS
// ─────────────────────────────────────────────

// Serialize JS → JSON string
const data = { name: "Alice", age: 30, hobbies: ["reading", "coding"] };
const json = JSON.stringify(data);
console.log(json); // '{"name":"Alice","age":30,"hobbies":["reading","coding"]}'

// Pretty print
console.log(JSON.stringify(data, null, 2));

// Replacer function — filter/transform
console.log(JSON.stringify(data, (key, val) =>
  key === "age" ? undefined : val // omit "age"
));

// Parse JSON string → JS object
const parsed = JSON.parse(json);
console.log(parsed.name); // "Alice"

// Reviver function — transform during parse
const withDate = JSON.parse('{"date":"2024-01-15"}', (key, val) =>
  key === "date" ? new Date(val) : val
);
console.log(withDate.date instanceof Date); // true

// Deep clone trick
const clone = JSON.parse(JSON.stringify(data)); // loses functions, Date, undefined


// ─────────────────────────────────────────────
// 8. REGEXP METHODS
// ─────────────────────────────────────────────

const regex = /(\d{4})-(\d{2})-(\d{2})/;
const dateStr = "Today is 2024-01-15 and tomorrow is 2024-01-16";

// test — returns boolean
console.log(regex.test("2024-01-15"));  // true
console.log(/^\d+$/.test("abc"));       // false

// match — returns array
console.log("hello world".match(/\w+/g)); // ["hello","world"]
const m = "2024-01-15".match(regex);
console.log(m[0], m[1], m[2], m[3]);     // "2024-01-15" "2024" "01" "15"

// matchAll
const allDates = [...dateStr.matchAll(/\d{4}-\d{2}-\d{2}/g)];
console.log(allDates.map(m => m[0])); // ["2024-01-15","2024-01-16"]

// replace with regex
console.log("hello".replace(/[aeiou]/g, "*")); // "h*ll*"
console.log("2024-01-15".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1")); // "15/01/2024"

// split with regex
console.log("one   two\tthree".split(/\s+/)); // ["one","two","three"]

// Named capture groups (ES2018)
const namedRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { year, month, day } = "2024-01-15".match(namedRegex).groups;
console.log(year, month, day); // "2024" "01" "15"


// ─────────────────────────────────────────────
// 9. SET METHODS
// ─────────────────────────────────────────────

const set = new Set([1, 2, 3, 2, 1]);
console.log(set);          // Set {1,2,3}  — unique values only
console.log(set.size);     // 3

set.add(4);
set.delete(2);
console.log(set.has(3));   // true
console.log(set.has(2));   // false

// Iterate
for (const val of set) process.stdout.write(val + " ");
console.log();

// Convert to/from array
const unique = [...new Set([1,1,2,2,3,3])];
console.log(unique); // [1,2,3]

// Set operations
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);
const union = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference = new Set([...a].filter(x => !b.has(x)));
console.log([...union]);        // [1,2,3,4,5,6]
console.log([...intersection]); // [3,4]
console.log([...difference]);   // [1,2]


// ─────────────────────────────────────────────
// 10. MAP METHODS
// ─────────────────────────────────────────────

const map2 = new Map();
map2.set("name", "Alice");
map2.set("age", 30);
map2.set({ id: 1 }, "object key!");  // objects can be keys (unlike plain objects)

console.log(map2.get("name"));  // "Alice"
console.log(map2.has("age"));   // true
console.log(map2.size);         // 3

map2.delete("age");

// Iterate
for (const [key, val] of map2) {
  console.log(key, "→", val);
}

// Convert to/from array
const mapFromArr = new Map([["a", 1], ["b", 2]]);
console.log(Object.fromEntries(mapFromArr)); // { a:1, b:2 }


// ─────────────────────────────────────────────
// 11. WEAKSET & WEAKMAP (brief)
// ─────────────────────────────────────────────
// Hold weak references (objects only) — allows garbage collection

const ws = new WeakSet();
let obj2 = { id: 1 };
ws.add(obj2);
console.log(ws.has(obj2)); // true

const wm = new WeakMap();
let key = {};
wm.set(key, "secret");
console.log(wm.get(key)); // "secret"


// ─────────────────────────────────────────────
// 12. CONSOLE METHODS
// ─────────────────────────────────────────────

console.log("Standard output");
console.info("Informational");
console.warn("Warning!");
console.error("Error!");
console.debug("Debug info");

console.table([{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]);
console.dir({ a: 1, b: { c: 2 } });  // interactive display in browser

console.group("Group");
console.log("Inside group");
console.groupEnd();

console.time("timer");
// ... expensive operation ...
console.timeEnd("timer");  // prints elapsed time

console.count("button clicked"); // 1
console.count("button clicked"); // 2
console.countReset("button clicked");

console.assert(1 === 1, "Should not print");
console.assert(1 === 2, "1 is not 2!");  // logs assertion failed

console.trace("Trace from here");  // shows stack trace


// ─────────────────────────────────────────────
// 13. GLOBAL FUNCTIONS
// ─────────────────────────────────────────────

// Encoding
console.log(encodeURIComponent("hello world!")); // "hello%20world%21"
console.log(decodeURIComponent("hello%20world")); // "hello world"

console.log(encodeURI("https://example.com/path?q=hello world"));
console.log(decodeURI("https://example.com/path?q=hello%20world"));

// eval (avoid — security risk & slow)
// console.log(eval("2 + 2")); // 4

// setTimeout / setInterval (covered in file 5/6)
const timer = setTimeout(() => console.log("delayed"), 1000);
clearTimeout(timer);

const interval = setInterval(() => console.log("repeating"), 500);
clearInterval(interval);

// queueMicrotask
queueMicrotask(() => console.log("microtask queued")); // runs before setTimeout

// ============================================================
// FILE 1: JavaScript Basics
// Topics: Variables, Data Types, Operators, Control Structures,
//         Loops, Error Handling, Type Conversion, Basic Functions
// ============================================================


// ─────────────────────────────────────────────
// 1. COMMENTS
// ─────────────────────────────────────────────
// Single-line comment
/* Multi-line
   comment */


// ─────────────────────────────────────────────
// 2. VARIABLES  — var / let / const
// ─────────────────────────────────────────────

var oldStyle = "I'm function-scoped and hoisted";   // avoid in modern JS
let mutable   = "I can be reassigned";              // block-scoped
const fixed   = "I cannot be reassigned";           // block-scoped, preferred

// Re-assignment
mutable = "new value";   // ✓ OK
// fixed = "oops";       // ✗ TypeError

// Hoisting demo (var is hoisted, let/const are NOT initialised)
console.log(hoisted);    // undefined  (var declaration hoisted)
var hoisted = 42;

// Block scope demo
{
  let blockVar = "only inside this block";
  const blockConst = 99;
}
// console.log(blockVar); // ✗ ReferenceError


// ─────────────────────────────────────────────
// 3. DATA TYPES
// ─────────────────────────────────────────────

// ── Primitive types ──
let str    = "Hello, World!";          // String
let num    = 42;                       // Number
let float  = 3.14;                     // Number (floats are Numbers too)
let bigInt = 9007199254740991n;        // BigInt  (suffix n)
let bool   = true;                     // Boolean  (true | false)
let nothing = null;                    // Null     (intentional absence)
let undef   = undefined;              // Undefined (declared but not assigned)
let sym     = Symbol("unique");        // Symbol   (always unique)

// ── Reference types (covered in depth in file 4) ──
let obj  = { name: "Alice" };
let arr  = [1, 2, 3];
let func = function() {};

// typeof operator
console.log(typeof str);     // "string"
console.log(typeof num);     // "number"
console.log(typeof bigInt);  // "bigint"
console.log(typeof bool);    // "boolean"
console.log(typeof nothing); // "object"  ← famous JS quirk
console.log(typeof undef);   // "undefined"
console.log(typeof sym);     // "symbol"
console.log(typeof obj);     // "object"
console.log(typeof func);    // "function"


// ─────────────────────────────────────────────
// 4. STRINGS — literals & template literals
// ─────────────────────────────────────────────

let single   = 'Single quotes';
let double   = "Double quotes";
let template = `Template literal: 1 + 1 = ${1 + 1}`;   // expression inside ${}

// Multi-line template literal
let multiLine = `Line 1
Line 2
Line 3`;

// Common escape sequences
let escaped = "Tab:\t Newline:\n Quote:\"";

// String concatenation
let greeting = "Hello" + ", " + "World!";          // old way
let greeting2 = `Hello, ${"World"}!`;              // modern way


// ─────────────────────────────────────────────
// 5. NUMBERS & MATH
// ─────────────────────────────────────────────

let integer  = 100;
let decimal  = 3.14159;
let negative = -42;
let expo     = 2.5e4;   // 25000  (scientific notation)
let hex      = 0xFF;    // 255
let octal    = 0o17;    // 15
let binary   = 0b1010;  // 10

// Special numeric values
console.log(Infinity);   // Infinity
console.log(-Infinity);  // -Infinity
console.log(NaN);        // Not a Number
console.log(isNaN("abc"));      // true
console.log(isFinite(Infinity)); // false

// Math object (more in file 3)
console.log(Math.PI);           // 3.14159…
console.log(Math.floor(4.9));   // 4
console.log(Math.ceil(4.1));    // 5
console.log(Math.round(4.5));   // 5
console.log(Math.abs(-7));      // 7
console.log(Math.pow(2, 10));   // 1024
console.log(Math.sqrt(16));     // 4
console.log(Math.random());     // 0 ≤ x < 1


// ─────────────────────────────────────────────
// 6. OPERATORS
// ─────────────────────────────────────────────

// ── Arithmetic ──
console.log(5 + 2);   // 7   addition
console.log(5 - 2);   // 3   subtraction
console.log(5 * 2);   // 10  multiplication
console.log(5 / 2);   // 2.5 division
console.log(5 % 2);   // 1   modulus (remainder)
console.log(5 ** 2);  // 25  exponentiation (ES2016)

// ── Increment / Decrement ──
let x = 5;
console.log(x++);  // 5  (post-increment: returns then increments)
console.log(x);    // 6
console.log(++x);  // 7  (pre-increment: increments then returns)
console.log(x--);  // 7  (post-decrement)
console.log(x);    // 6

// ── Assignment ──
let a = 10;
a += 5;   // a = 15
a -= 3;   // a = 12
a *= 2;   // a = 24
a /= 4;   // a = 6
a %= 4;   // a = 2
a **= 3;  // a = 8

// ── Comparison ──
console.log(5 == "5");   // true  (loose, coerces types)
console.log(5 === "5");  // false (strict, no coercion)  ← always prefer ===
console.log(5 != "5");   // false
console.log(5 !== "5");  // true
console.log(5 > 3);      // true
console.log(5 < 3);      // false
console.log(5 >= 5);     // true
console.log(5 <= 4);     // false

// ── Logical ──
console.log(true && false);  // false  (AND)
console.log(true || false);  // true   (OR)
console.log(!true);          // false  (NOT)

// Short-circuit evaluation
let user = null;
let name = user && user.name;       // null  (short-circuits at user)
let defaultName = user || "Guest";  // "Guest"

// Nullish coalescing (??) — only null/undefined trigger default
let count = 0;
console.log(count || 10);   // 10  (0 is falsy, so falls to default)
console.log(count ?? 10);   // 0   (?? only checks null/undefined)

// Optional chaining (?.)
let profile = { address: { city: "NYC" } };
console.log(profile?.address?.city);    // "NYC"
console.log(profile?.phone?.number);    // undefined  (no error)

// ── Bitwise (rare in everyday JS) ──
console.log(5 & 3);   // 1   AND
console.log(5 | 3);   // 7   OR
console.log(5 ^ 3);   // 6   XOR
console.log(~5);      // -6  NOT
console.log(5 << 1);  // 10  left shift
console.log(5 >> 1);  // 2   right shift

// ── Ternary (conditional) ──
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status);  // "Adult"

// ── typeof / instanceof ──
console.log(typeof "hi");           // "string"
console.log([] instanceof Array);   // true
console.log({} instanceof Object);  // true


// ─────────────────────────────────────────────
// 7. TYPE CONVERSION
// ─────────────────────────────────────────────

// ── Explicit conversion ──
console.log(Number("42"));       // 42
console.log(Number("3.14"));     // 3.14
console.log(Number(""));         // 0
console.log(Number("abc"));      // NaN
console.log(Number(true));       // 1
console.log(Number(false));      // 0
console.log(Number(null));       // 0
console.log(Number(undefined));  // NaN

console.log(String(42));         // "42"
console.log(String(true));       // "true"
console.log(String(null));       // "null"

console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
console.log(Boolean("hello"));   // true
console.log(Boolean(42));        // true
console.log(Boolean([]));        // true  ← empty array is truthy!
console.log(Boolean({}));        // true  ← empty object is truthy!

// parseInt / parseFloat
console.log(parseInt("42px"));   // 42  (parses until non-numeric)
console.log(parseFloat("3.14abc")); // 3.14
console.log(parseInt("0xFF", 16));  // 255 (base 16)

// ── Implicit (coercion) — JS does this automatically, be careful ──
console.log("5" + 3);     // "53"  (+ triggers string concatenation)
console.log("5" - 3);     // 2     (- forces numeric)
console.log("5" * "2");   // 10    (* forces numeric)
console.log(true + 1);    // 2
console.log(null + 1);    // 1
console.log(undefined + 1); // NaN


// ─────────────────────────────────────────────
// 8. CONTROL FLOW — if / else if / else
// ─────────────────────────────────────────────

let score = 75;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("F");
}
// Output: "C"

// Truthy / Falsy values in conditions
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: everything else
if ("") {
  console.log("won't run");
}
if ("hello") {
  console.log("runs");  // ✓
}


// ─────────────────────────────────────────────
// 9. SWITCH STATEMENT
// ─────────────────────────────────────────────

let day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break;           // without break, falls through to next case
  case "Saturday":
  case "Sunday":
    console.log("Weekend");
    break;
  default:
    console.log("Unknown day");
}


// ─────────────────────────────────────────────
// 10. LOOPS
// ─────────────────────────────────────────────

// ── for loop ──
for (let i = 0; i < 5; i++) {
  process.stdout.write(i + " ");  // 0 1 2 3 4
}
console.log();

// ── while loop ──
let i = 0;
while (i < 5) {
  process.stdout.write(i + " ");
  i++;
}
console.log();

// ── do…while (runs at least once) ──
let j = 0;
do {
  console.log("runs at least once, j =", j);
  j++;
} while (j < 1);

// ── for…of (iterate values — arrays, strings, sets, maps) ──
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color);
}

// ── for…in (iterate keys of an object) ──
const person = { name: "Alice", age: 30 };
for (const key in person) {
  console.log(key, ":", person[key]);
}

// ── break & continue ──
for (let k = 0; k < 10; k++) {
  if (k === 3) continue;   // skip 3
  if (k === 6) break;      // stop at 6
  process.stdout.write(k + " ");  // 0 1 2 4 5
}
console.log();

// ── Labeled break (rare) ──
outer: for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 1 && c === 1) break outer;  // breaks both loops
    console.log(r, c);
  }
}


// ─────────────────────────────────────────────
// 11. ERROR HANDLING — try / catch / finally / throw
// ─────────────────────────────────────────────

// Basic try-catch
try {
  let result = JSON.parse("invalid json {");
} catch (error) {
  console.log("Caught:", error.message);
}

// finally always runs
try {
  let x = 1 / 0;   // Infinity, not an error in JS
  console.log(x);
} catch (e) {
  console.log("Error:", e.message);
} finally {
  console.log("Finally block always runs");
}

// throw custom errors
function divide(a, b) {
  if (b === 0) throw new Error("Division by zero!");
  return a / b;
}

try {
  console.log(divide(10, 2));   // 5
  console.log(divide(10, 0));   // throws
} catch (e) {
  console.log("Error:", e.message);
}

// Error types
try { null.property; }       catch(e) { console.log(e instanceof TypeError);    } // true
try { undeclaredVar; }       catch(e) { console.log(e instanceof ReferenceError); } // true
try { eval("{bad syntax"); } catch(e) { console.log(e instanceof SyntaxError);  } // true

// Custom error class
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  throw new ValidationError("Required field", "email");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`${e.name} on ${e.field}: ${e.message}`);
  }
}


// ─────────────────────────────────────────────
// 12. FUNCTIONS (intro — detailed in file 2)
// ─────────────────────────────────────────────

// Function declaration (hoisted)
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Alice"));  // "Hello, Alice!"

// Function expression (not hoisted)
const add = function(a, b) {
  return a + b;
};
console.log(add(3, 4));  // 7

// Arrow function
const multiply = (a, b) => a * b;
console.log(multiply(3, 4));  // 12

// Default parameters
function power(base, exponent = 2) {
  return base ** exponent;
}
console.log(power(3));    // 9
console.log(power(3, 3)); // 27

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4, 5));  // 15

// Returning multiple values via array/object
function minMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3, 1, 4, 1, 5, 9]);
console.log(min, max);  // 1 9


// ─────────────────────────────────────────────
// 13. SCOPE
// ─────────────────────────────────────────────

// Global scope
let globalVar = "I'm global";

function scopeDemo() {
  // Local scope
  let localVar = "I'm local";
  console.log(globalVar);  // accessible ✓
  console.log(localVar);   // accessible ✓
}

// console.log(localVar);   // ✗ ReferenceError

// Block scope
{
  let blockScoped = "block";
  const alsoBlock = "also block";
  // var notBlock = "not block";  // var ignores block scope!
}


// ─────────────────────────────────────────────
// 14. STRICT MODE
// ─────────────────────────────────────────────

// Add "use strict"; at the top of a file or function to enable strict mode.
// It prevents:
//  - Using undeclared variables
//  - Deleting variables/functions
//  - Duplicate parameter names
//  - Using reserved future keywords

function strictDemo() {
  "use strict";
  // undeclared = 5;  // ✗ ReferenceError in strict mode
  console.log("Strict mode active");
}
strictDemo();


// ─────────────────────────────────────────────
// 15. ADVANCED BASICS — real-world patterns
// ─────────────────────────────────────────────

// Guard clauses (early return to avoid deep nesting)
function processUser(user) {
  if (!user) return "No user provided";
  if (!user.name) return "Name is required";
  if (user.age < 18) return "Must be 18+";
  return `Welcome, ${user.name}!`;
}

// Chained ternaries (use sparingly for readability)
const grade = score >= 90 ? "A"
            : score >= 80 ? "B"
            : score >= 70 ? "C"
            : "F";

// Logical assignment operators (ES2021)
let username = null;
username ??= "Anonymous";   // assign if null/undefined
console.log(username);      // "Anonymous"

let count2 = 0;
count2 ||= 10;   // assign if falsy
console.log(count2); // 10

let value = 5;
value &&= value * 2;  // assign if truthy
console.log(value);   // 10

// Comma operator (returns last value)
let z = (1, 2, 3);
console.log(z);  // 3

// void operator (always returns undefined)
console.log(void 0);  // undefined

// delete operator
let tempObj = { a: 1, b: 2 };
delete tempObj.a;
console.log(tempObj);  // { b: 2 }

// in operator (check if property exists)
console.log("b" in tempObj);  // true
console.log("a" in tempObj);  // false

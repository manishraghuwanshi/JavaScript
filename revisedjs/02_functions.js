// ============================================================
// FILE 2: Functions — All Variations
// Topics: Declaration, Expression, Arrow, IIFE, Callbacks,
//         Higher-Order, Closures (intro), Recursion, Generators,
//         Async functions, Method shorthand, Pure functions, etc.
// ============================================================


// ─────────────────────────────────────────────
// 1. FUNCTION DECLARATION
// ─────────────────────────────────────────────
// Hoisted to the top of its scope — can be called before definition

function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Alice"));      // "Hello, Alice!"
console.log(greetHoisted("Bob")); // works because of hoisting ↓

function greetHoisted(name) {
  return `Hey, ${name}!`;
}


// ─────────────────────────────────────────────
// 2. FUNCTION EXPRESSION
// ─────────────────────────────────────────────
// Not hoisted — must be defined before use

const add = function(a, b) {
  return a + b;
};

console.log(add(3, 4)); // 7

// Named function expression (name is local to the function — useful for recursion/debugging)
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);  // 'fact' is accessible here
};
console.log(factorial(5)); // 120


// ─────────────────────────────────────────────
// 3. ARROW FUNCTIONS
// ─────────────────────────────────────────────
// Shorter syntax; does NOT have its own `this`, `arguments`, or `super`

// Concise body (implicit return when single expression)
const double = x => x * 2;
const multiply = (a, b) => a * b;
const getObject = () => ({ key: "value" });  // wrap object in () for implicit return

// Block body (explicit return required)
const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

console.log(double(5));         // 10
console.log(multiply(3, 4));    // 12
console.log(getObject());       // { key: "value" }
console.log(clamp(15, 0, 10)); // 10

// Arrow vs regular `this` — key difference
function Timer() {
  this.seconds = 0;

  // Regular function — `this` is lost inside setInterval callback
  // setInterval(function() { this.seconds++; }, 1000); // ✗ `this` is undefined/global

  // Arrow function — inherits `this` from Timer
  setInterval(() => {
    this.seconds++;
  }, 1000); // ✓ works correctly
}


// ─────────────────────────────────────────────
// 4. PARAMETERS — defaults, rest, spread
// ─────────────────────────────────────────────

// Default parameters
function createUser(name, role = "viewer", active = true) {
  return { name, role, active };
}
console.log(createUser("Alice"));               // { name:"Alice", role:"viewer", active:true }
console.log(createUser("Bob", "admin"));        // { name:"Bob",  role:"admin",  active:true }
console.log(createUser("Eve", "editor", false));

// Default using previous parameter
function buildUrl(host, port = 80, path = `/${host}`) {
  return `${host}:${port}${path}`;
}
console.log(buildUrl("example.com")); // "example.com:80/example.com"

// Rest parameters — collects remaining args into an array
function sum(first, second, ...rest) {
  const restTotal = rest.reduce((acc, n) => acc + n, 0);
  return first + second + restTotal;
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Spread in function call
const nums = [3, 1, 4, 1, 5];
console.log(Math.max(...nums));  // 5


// ─────────────────────────────────────────────
// 5. IIFE — Immediately Invoked Function Expression
// ─────────────────────────────────────────────
// Runs immediately; creates its own scope (avoids polluting global)

(function() {
  const secret = "I'm private";
  console.log("IIFE ran:", secret);
})();

// Arrow IIFE
(() => {
  console.log("Arrow IIFE");
})();

// IIFE with arguments
const result = (function(a, b) {
  return a + b;
})(10, 20);
console.log(result); // 30

// IIFE returning a module-like object
const counter = (function() {
  let count = 0;
  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
})();

counter.increment();
counter.increment();
console.log(counter.getCount()); // 2


// ─────────────────────────────────────────────
// 6. FIRST-CLASS FUNCTIONS & HIGHER-ORDER FUNCTIONS
// ─────────────────────────────────────────────
// Functions are values — they can be stored, passed, and returned

// Storing a function
const sayHi = function() { return "hi"; };
const fn = sayHi;   // pass by reference
console.log(fn());  // "hi"

// Passing a function as argument (callback)
function doMath(a, b, operation) {
  return operation(a, b);
}
console.log(doMath(10, 5, (a, b) => a + b));  // 15
console.log(doMath(10, 5, (a, b) => a * b));  // 50

// Returning a function
function multiplier(factor) {
  return (number) => number * factor;  // closure over `factor`
}
const triple = multiplier(3);
const quadruple = multiplier(4);
console.log(triple(7));    // 21
console.log(quadruple(7)); // 28


// ─────────────────────────────────────────────
// 7. CALLBACKS
// ─────────────────────────────────────────────

// Synchronous callback
function runWithLogging(fn, ...args) {
  console.log("Before");
  const result = fn(...args);
  console.log("After, result:", result);
  return result;
}
runWithLogging(add, 3, 4);

// Asynchronous callback (Node.js style error-first)
function fetchData(id, callback) {
  setTimeout(() => {
    if (id <= 0) return callback(new Error("Invalid ID"), null);
    callback(null, { id, name: "User " + id });
  }, 100);
}

fetchData(1, (err, data) => {
  if (err) return console.error(err.message);
  console.log(data);  // { id: 1, name: "User 1" }
});

// Callback hell example (what to avoid)
function step1(cb) { setTimeout(() => cb(null, "step1 done"), 50); }
function step2(result, cb) { setTimeout(() => cb(null, result + " -> step2"), 50); }
function step3(result, cb) { setTimeout(() => cb(null, result + " -> step3"), 50); }

step1((e, r1) => {
  step2(r1, (e, r2) => {
    step3(r2, (e, r3) => {
      console.log(r3); // "step1 done -> step2 -> step3"
      // ↑ hard to read and maintain (Promises fix this — see file 6)
    });
  });
});


// ─────────────────────────────────────────────
// 8. CLOSURES
// ─────────────────────────────────────────────
// A closure is a function that remembers variables from its outer scope
// even after the outer function has returned

function makeCounter(start = 0) {
  let count = start;  // closed-over variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = start; },
    value: () => count
  };
}

const c1 = makeCounter(10);
const c2 = makeCounter(0);

c1.increment(); c1.increment();
c2.increment();
console.log(c1.value()); // 12  (independent from c2)
console.log(c2.value()); // 1

// Closure for private state
function createBankAccount(initialBalance) {
  let balance = initialBalance;
  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return balance;
    },
    getBalance: () => balance
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.withdraw(30));   // 120
console.log(account.getBalance());   // 120

// Classic loop closure bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var loop:", i), 0);  // prints 3,3,3 (bug!)
}
// Fix 1: use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log("let loop:", i), 0);  // 0,1,2 ✓
}
// Fix 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log("IIFE loop:", j), 0); // 0,1,2 ✓
  })(i);
}


// ─────────────────────────────────────────────
// 9. RECURSION
// ─────────────────────────────────────────────

// Factorial
function factRec(n) {
  if (n <= 1) return 1;    // base case
  return n * factRec(n - 1); // recursive case
}
console.log(factRec(6)); // 720

// Fibonacci
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(10)); // 55

// Flatten nested array recursively
function flatten(arr) {
  return arr.reduce((flat, item) =>
    Array.isArray(item) ? flat.concat(flatten(item)) : flat.concat(item), []);
}
console.log(flatten([1, [2, [3, [4]], 5]])); // [1,2,3,4,5]

// Deep clone (simplified)
function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClone(v)]));
  return value;
}

// Tail-call optimization friendly factorial
function factTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factTail(n - 1, n * acc);
}
console.log(factTail(6)); // 720


// ─────────────────────────────────────────────
// 10. FUNCTION COMPOSITION & CURRYING
// ─────────────────────────────────────────────

// Composition: f(g(x))
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe    = (...fns) => x => fns.reduce((v, f) => f(v), x);

const trim    = s => s.trim();
const toLower = s => s.toLowerCase();
const removeSpaces = s => s.replace(/\s+/g, "-");

const slugify = pipe(trim, toLower, removeSpaces);
console.log(slugify("  Hello World  ")); // "hello-world"

// Currying — transform f(a,b,c) → f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6

// Partial application
function partial(fn, ...preArgs) {
  return (...laterArgs) => fn(...preArgs, ...laterArgs);
}

const addTen = partial(add, 10);
console.log(addTen(5));  // 15


// ─────────────────────────────────────────────
// 11. MEMOIZATION
// ─────────────────────────────────────────────
// Cache expensive function results

function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit");
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFib = memoize(function fib(n) {
  return n <= 1 ? n : expensiveFib(n - 1) + expensiveFib(n - 2);
});

console.log(expensiveFib(40)); // fast with memoization


// ─────────────────────────────────────────────
// 12. GENERATOR FUNCTIONS
// ─────────────────────────────────────────────
// Use function* and yield; produce values lazily

function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

for (const n of range(0, 10, 2)) {
  process.stdout.write(n + " "); // 0 2 4 6 8
}
console.log();

// Infinite generator
function* ids() {
  let id = 1;
  while (true) yield id++;
}

const gen = ids();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3

// Two-way communication with generators
function* calculator() {
  let result = 0;
  while (true) {
    const input = yield result;    // yield sends result, receives input
    result += input;
  }
}
const calc = calculator();
calc.next();      // start
console.log(calc.next(10).value); // 10
console.log(calc.next(5).value);  // 15


// ─────────────────────────────────────────────
// 13. ASYNC FUNCTIONS (intro — details in file 6)
// ─────────────────────────────────────────────

async function fetchUser(id) {
  // await pauses execution until the Promise resolves
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const data = await response.json();
  return data;
}

// async functions always return a Promise
fetchUser(1).then(user => console.log(user.name)).catch(console.error);


// ─────────────────────────────────────────────
// 14. METHOD SHORTHAND IN OBJECTS & CLASSES
// ─────────────────────────────────────────────

const math = {
  PI: 3.14159,
  // method shorthand (ES6)
  square(x) { return x * x; },
  // computed property method
  ["cube"](x) { return x ** 3; },
  // getter / setter
  get twoPi() { return this.PI * 2; },
};

console.log(math.square(4));  // 16
console.log(math.cube(3));    // 27
console.log(math.twoPi);      // 6.28318…


// ─────────────────────────────────────────────
// 15. PURE vs IMPURE FUNCTIONS
// ─────────────────────────────────────────────

// Pure — same input → same output, no side effects
const pureAdd = (a, b) => a + b;

// Impure — depends on external state, has side effects
let runningTotal = 0;
function impureAdd(a) {
  runningTotal += a;  // side effect: mutates external variable
  return runningTotal;
}

// ─────────────────────────────────────────────
// 16. FUNCTION OVERLOADING SIMULATION
// ─────────────────────────────────────────────
// JS doesn't have native overloading — simulate with type checks

function process(input) {
  if (typeof input === "string") return input.toUpperCase();
  if (typeof input === "number") return input * 2;
  if (Array.isArray(input))     return input.map(x => x * 2);
  return input;
}

console.log(process("hello"));    // "HELLO"
console.log(process(5));          // 10
console.log(process([1, 2, 3]));  // [2, 4, 6]


// ─────────────────────────────────────────────
// 17. FUNCTION.PROTOTYPE — call, apply, bind
// ─────────────────────────────────────────────

function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// call — invoke with explicit `this`, args listed
console.log(introduce.call(alice, "Hello", "!"));  // "Hello, I'm Alice!"

// apply — invoke with explicit `this`, args as array
console.log(introduce.apply(bob, ["Hi", "."]));    // "Hi, I'm Bob."

// bind — returns a NEW function with `this` bound
const aliceIntro = introduce.bind(alice, "Hey");
console.log(aliceIntro("?"));  // "Hey, I'm Alice?"

// Practical use: borrowing array methods
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ["a", "b", "c"]


// ─────────────────────────────────────────────
// 18. ADVANCED PATTERNS
// ─────────────────────────────────────────────

// Debounce — delays execution until after wait ms since last call
function debounce(fn, wait) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Throttle — allows execution at most once per wait ms
function throttle(fn, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      return fn.apply(this, args);
    }
  };
}

// Once — function that runs only once
function once(fn) {
  let called = false, result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initOnce = once(() => {
  console.log("Init runs only once!");
  return 42;
});

console.log(initOnce()); // "Init runs only once!" → 42
console.log(initOnce()); // 42  (no log)

// Function that tracks call count
function withCallCount(fn) {
  let count = 0;
  function wrapper(...args) {
    count++;
    console.log(`Called ${count} time(s)`);
    return fn(...args);
  }
  wrapper.getCount = () => count;
  return wrapper;
}

const trackedAdd = withCallCount(add);
trackedAdd(1, 2);
trackedAdd(3, 4);
console.log(trackedAdd.getCount()); // 2

// ============================================================
// FILE 7: Advanced JavaScript Concepts
// Topics: Hoisting, Closures, Scope Chain, this, Prototype Chain,
//         Memory, Design Patterns, Functional Programming,
//         Generators, Metaprogramming, Performance
// ============================================================


// ─────────────────────────────────────────────
// 1. HOISTING
// ─────────────────────────────────────────────
// JS moves declarations (NOT initializations) to the top of their scope.

// ── var hoisting ──
console.log(x); // undefined (NOT ReferenceError)
var x = 5;
console.log(x); // 5

// What JS actually does internally:
// var x;           // declaration hoisted
// console.log(x);  // undefined
// x = 5;           // initialization stays

// ── let/const — Temporal Dead Zone (TDZ) ──
// Declarations ARE hoisted but NOT initialized
// Accessing them before declaration throws ReferenceError

// console.log(y); // ✗ ReferenceError: Cannot access 'y' before initialization
let y = 10;

// ── Function declaration hoisting ──
console.log(sayHi("Alice")); // "Hi, Alice!" ✓ (fully hoisted)

function sayHi(name) {
  return `Hi, ${name}!`;
}

// ── Function expression — NOT hoisted (same as let/const) ──
// console.log(sayHello("Bob")); // ✗ ReferenceError
const sayHello = function(name) { return `Hello, ${name}!`; };

// ── Class — also in TDZ ──
// const a = new Animal("Rex"); // ✗ ReferenceError
class Animal { constructor(name) { this.name = name; } }
const a = new Animal("Rex"); // ✓ after declaration

// ── Practical gotcha ──
function getMultipliers() {
  const result = [];
  for (var i = 1; i <= 3; i++) {
    result.push(function() { return i; });  // all capture the SAME var i
  }
  return result;
}
const fns = getMultipliers();
console.log(fns[0](), fns[1](), fns[2]()); // 4 4 4 ← bug!

// Fix: use let
function getMultipliersFixed() {
  const result = [];
  for (let i = 1; i <= 3; i++) {  // each iteration gets its own `i`
    result.push(function() { return i; });
  }
  return result;
}
const fnsFix = getMultipliersFixed();
console.log(fnsFix[0](), fnsFix[1](), fnsFix[2]()); // 1 2 3 ✓


// ─────────────────────────────────────────────
// 2. SCOPE CHAIN & LEXICAL SCOPE
// ─────────────────────────────────────────────
// Variable lookup goes: local → outer → outer → ... → global → error

const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function middle() {
    const middleVar = "middle";

    function inner() {
      const innerVar = "inner";
      // Can access all outer scopes:
      console.log(innerVar, middleVar, outerVar, globalVar);
    }

    inner();
    // console.log(innerVar); // ✗ ReferenceError
  }

  middle();
}
outer();

// Lexical scope = determined by WHERE code is written, not where it's called
function makeAdder(x) {
  return function(y) {
    return x + y;  // x is from the lexical (writing-time) scope, not call-time
  };
}
const add5 = makeAdder(5);
console.log(add5(3));  // 8
console.log(add5(10)); // 15


// ─────────────────────────────────────────────
// 3. CLOSURES — DEEP DIVE
// ─────────────────────────────────────────────
// A function that "closes over" its lexical scope, retaining access
// to variables from its outer scope even after the outer has returned.

// ── Module pattern via closure ──
const userModule = (() => {
  // Private state
  let users = [];
  let nextId = 1;

  // Private function
  function validate(user) {
    return user.name && user.email;
  }

  // Public interface
  return {
    add(user) {
      if (!validate(user)) throw new Error("Invalid user");
      const newUser = { ...user, id: nextId++ };
      users.push(newUser);
      return newUser;
    },
    remove(id) {
      users = users.filter(u => u.id !== id);
    },
    get(id) { return users.find(u => u.id === id); },
    getAll() { return [...users]; },  // return copy, not reference
    count: () => users.length
  };
})();

userModule.add({ name: "Alice", email: "alice@example.com" });
userModule.add({ name: "Bob", email: "bob@example.com" });
console.log(userModule.count()); // 2
// users is NOT accessible from outside — truly private

// ── Closure for partial application ──
function taxCalculator(taxRate) {
  return function(amount) {
    return amount + amount * taxRate;
  };
}
const withVAT = taxCalculator(0.20);  // 20% VAT
const withGST = taxCalculator(0.18);  // 18% GST

console.log(withVAT(100));  // 120
console.log(withGST(100));  // 118

// ── Stale closure bug ──
function useCounter() {
  let count = 0;
  const increment = () => { count++; };
  const getCount = () => count;

  // Bug example: if we capture `count` directly in a timeout
  setTimeout(() => console.log("timeout count:", count), 1000); // ✓ captures by ref
  increment();
  console.log(getCount()); // 1
}


// ─────────────────────────────────────────────
// 4. `this` KEYWORD
// ─────────────────────────────────────────────
// `this` depends on HOW a function is called, not where it's defined.

// ── Global context ──
// In browser non-strict: `this` === window
// In Node.js: `this` === module.exports (in top level), undefined in functions
// In strict mode: `this` === undefined in functions

// ── Method call — this = the object ──
const obj = {
  name: "Alice",
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};
console.log(obj.greet());  // "Hi, I'm Alice"

// ── Losing `this` — common bug ──
const greet = obj.greet;
// greet();  // ✗ undefined.name — `this` is global or undefined in strict

// ── Binding solutions ──
const bound = obj.greet.bind(obj);      // permanent binding
console.log(bound());  // "Hi, I'm Alice"

// Arrow function — inherits `this` from surrounding lexical scope
const obj2 = {
  name: "Bob",
  greet() {
    const inner = () => `Hi from inner, I'm ${this.name}`; // `this` = obj2
    return inner();
  }
};
console.log(obj2.greet()); // "Hi from inner, I'm Bob"

// ── Constructor — this = new instance ──
function Person(name) {
  this.name = name;
  this.sayHi = function() { return `I'm ${this.name}`; };
}
const p = new Person("Carol");
console.log(p.sayHi());  // "I'm Carol"

// ── Explicit binding ──
function logThis(a, b) {
  console.log(this, a, b);
}
const ctx = { id: 1 };
logThis.call(ctx, 1, 2);   // ctx, 1, 2
logThis.apply(ctx, [1, 2]); // ctx, 1, 2
const logBound = logThis.bind(ctx, 1);
logBound(2);               // ctx, 1, 2

// ── Class `this` ──
class Counter {
  count = 0;

  // Arrow class field method — `this` always bound to instance
  increment = () => { this.count++; };

  // Regular method — `this` can be lost
  decrement() { this.count--; }
}
const counter = new Counter();
const inc = counter.increment;  // detached
inc();  // ✓ still works because it's an arrow function
console.log(counter.count); // 1


// ─────────────────────────────────────────────
// 5. PROTOTYPE CHAIN — DEEP DIVE
// ─────────────────────────────────────────────

// Every object has [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf)
// When you access a property, JS walks the chain:
// obj → obj's prototype → its prototype → ... → Object.prototype → null

function Vehicle(make, model) {
  this.make = make;
  this.model = model;
}
Vehicle.prototype.describe = function() {
  return `${this.make} ${this.model}`;
};
Vehicle.prototype.toString = function() {
  return `[Vehicle: ${this.describe()}]`;
};

function Car(make, model, doors) {
  Vehicle.call(this, make, model);  // call parent constructor
  this.doors = doors;
}

// Set up prototype chain: Car.prototype → Vehicle.prototype
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;  // restore constructor reference

Car.prototype.honk = function() { return "Beep!"; };
Car.prototype.toString = function() { return `[Car: ${this.describe()}, ${this.doors} doors]`; };

const car = new Car("Toyota", "Camry", 4);
console.log(car.describe());  // "Toyota Camry" (inherited)
console.log(car.honk());      // "Beep!" (own)
console.log(car instanceof Car);     // true
console.log(car instanceof Vehicle); // true

// hasOwnProperty / Object.hasOwn
console.log(Object.hasOwn(car, "make"));     // true
console.log(Object.hasOwn(car, "describe")); // false (on prototype)

// Inspect the chain
let proto = car;
while (proto !== null) {
  console.log(proto.constructor?.name || "null", Object.getOwnPropertyNames(proto));
  proto = Object.getPrototypeOf(proto);
}


// ─────────────────────────────────────────────
// 6. EXECUTION CONTEXT & CALL STACK
// ─────────────────────────────────────────────
// Each function call creates an Execution Context containing:
// - Variable Environment (local vars)
// - Lexical Environment (outer scope reference)
// - `this` binding

// Call stack (LIFO — last in, first out)
function c() { console.trace("Stack trace"); }
function b() { c(); }
function a() { b(); }
a();
// Stack: a → b → c → console.trace


// ─────────────────────────────────────────────
// 7. MEMORY MANAGEMENT & GARBAGE COLLECTION
// ─────────────────────────────────────────────
// JS uses Mark-and-Sweep garbage collection.
// Memory is freed when no references point to an object.

// ── Memory leak patterns ──

// 1. Forgotten timers
function leakyTimer() {
  const bigData = new Array(10000).fill("x");
  setInterval(() => {
    // bigData is referenced — never freed
    console.log(bigData.length);
  }, 1000);
  // Fix: store intervalId and clearInterval when done
}

// 2. Detached DOM nodes
let detachedNode;
function createLeak() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  detachedNode = div;  // reference kept even after removal
  document.body.removeChild(div);
  // Fix: set detachedNode = null when done
}

// 3. Closures holding large objects
function heavyClosure() {
  const largeBuffer = new ArrayBuffer(1024 * 1024); // 1MB
  return function() {
    // largeBuffer is captured even if not used
  };
  // Fix: only close over what you actually need
}

// 4. Event listeners not removed
function leakyEventListener() {
  const handler = () => console.log("click");
  document.addEventListener("click", handler);
  // Fix: removeEventListener when component unmounts
  return () => document.removeEventListener("click", handler);
}

// ── WeakRef & FinalizationRegistry for caches ──
const cache = new Map();

function cache_get(key, factory) {
  const ref = cache.get(key);
  const existing = ref?.deref();
  if (existing) return existing;

  const value = factory();
  cache.set(key, new WeakRef(value));
  return value;
}


// ─────────────────────────────────────────────
// 8. DESIGN PATTERNS
// ─────────────────────────────────────────────

// ── Singleton ──
class Database {
  static #instance = null;
  #connection;

  constructor(url) {
    if (Database.#instance) return Database.#instance;
    this.#connection = { url, status: "connected" };
    Database.#instance = this;
  }

  query(sql) { return `Query: ${sql} on ${this.#connection.url}`; }
  static getInstance(url) { return new Database(url); }
}

const db1 = new Database("mongodb://localhost:27017/app");
const db2 = new Database("mongodb://other:27017/other");
console.log(db1 === db2); // true — same instance
console.log(db2.query("SELECT *")); // uses first URL

// ── Factory ──
class NotificationFactory {
  static create(type, options) {
    switch(type) {
      case "email":  return new EmailNotification(options);
      case "sms":    return new SMSNotification(options);
      case "push":   return new PushNotification(options);
      default: throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

class EmailNotification {
  constructor({ to, subject, body }) {
    this.to = to; this.subject = subject; this.body = body;
  }
  send() { console.log(`Email to ${this.to}: ${this.subject}`); }
}
class SMSNotification {
  constructor({ phone, message }) { this.phone = phone; this.message = message; }
  send() { console.log(`SMS to ${this.phone}: ${this.message}`); }
}
class PushNotification {
  constructor({ userId, title }) { this.userId = userId; this.title = title; }
  send() { console.log(`Push to ${this.userId}: ${this.title}`); }
}

const notif = NotificationFactory.create("email", {
  to: "alice@example.com", subject: "Hello", body: "World"
});
notif.send();

// ── Observer / Pub-Sub ──
class EventBus {
  #subscriptions = new Map();

  subscribe(topic, handler) {
    if (!this.#subscriptions.has(topic)) this.#subscriptions.set(topic, new Set());
    this.#subscriptions.get(topic).add(handler);
    return () => this.#subscriptions.get(topic).delete(handler);  // unsubscribe fn
  }

  publish(topic, data) {
    (this.#subscriptions.get(topic) || new Set()).forEach(h => h(data));
  }

  subscribeOnce(topic, handler) {
    const unsub = this.subscribe(topic, (data) => { handler(data); unsub(); });
  }
}

const bus = new EventBus();
const unsubUser = bus.subscribe("user:created", user => console.log("New user:", user.name));
bus.publish("user:created", { id: 1, name: "Alice" });
unsubUser(); // stop listening

// ── Strategy ──
class Sorter {
  #strategy;

  constructor(strategy) { this.#strategy = strategy; }
  setStrategy(strategy) { this.#strategy = strategy; }
  sort(data) { return this.#strategy.sort([...data]); }  // don't mutate input
}

const bubbleSort = {
  sort(arr) {
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length - i - 1; j++)
        if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
    return arr;
  }
};

const quickSort = {
  sort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left   = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right  = arr.filter(x => x > pivot);
    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
};

const sorter = new Sorter(quickSort);
console.log(sorter.sort([3, 1, 4, 1, 5, 9])); // [1,1,3,4,5,9]
sorter.setStrategy(bubbleSort);
console.log(sorter.sort([3, 1, 4, 1, 5, 9]));

// ── Decorator (class-based) ──
class Coffee {
  cost() { return 5; }
  description() { return "Coffee"; }
}

class MilkDecorator {
  #coffee;
  constructor(coffee) { this.#coffee = coffee; }
  cost() { return this.#coffee.cost() + 2; }
  description() { return `${this.#coffee.description()} + Milk`; }
}

class SugarDecorator {
  #coffee;
  constructor(coffee) { this.#coffee = coffee; }
  cost() { return this.#coffee.cost() + 1; }
  description() { return `${this.#coffee.description()} + Sugar`; }
}

const fancy = new SugarDecorator(new MilkDecorator(new Coffee()));
console.log(fancy.description(), "-", fancy.cost()); // "Coffee + Milk + Sugar - 8"


// ─────────────────────────────────────────────
// 9. FUNCTIONAL PROGRAMMING CONCEPTS
// ─────────────────────────────────────────────

// ── Immutability ──
const state = Object.freeze({ count: 0, items: [] });
// state.count = 1; // ✗ silently fails (throws in strict)

// Always return new state instead of mutating
function reducer(state, action) {
  switch(action.type) {
    case "INCREMENT": return { ...state, count: state.count + 1 };
    case "ADD_ITEM":  return { ...state, items: [...state.items, action.item] };
    case "RESET":     return { ...state, count: 0, items: [] };
    default:          return state;
  }
}

let s = { count: 0, items: [] };
s = reducer(s, { type: "INCREMENT" });
s = reducer(s, { type: "INCREMENT" });
s = reducer(s, { type: "ADD_ITEM", item: "apple" });
console.log(s); // { count: 2, items: ["apple"] }

// ── Functor — mappable container ──
class Maybe {
  #value;
  constructor(value) { this.#value = value; }
  static of(value) { return new Maybe(value); }
  isNothing() { return this.#value == null; }
  map(fn) { return this.isNothing() ? this : Maybe.of(fn(this.#value)); }
  getOrElse(defaultVal) { return this.isNothing() ? defaultVal : this.#value; }
  flatMap(fn) { return this.isNothing() ? this : fn(this.#value); }
}

const result2 = Maybe.of(null)
  .map(x => x * 2)       // skipped
  .getOrElse(0);
console.log(result2);  // 0

const result3 = Maybe.of(5)
  .map(x => x * 2)       // 10
  .map(x => x + 1)       // 11
  .getOrElse(0);
console.log(result3);  // 11

// ── Transducer — efficient pipeline without intermediate arrays ──
const map = fn => reducer => (acc, val) => reducer(acc, fn(val));
const filter = pred => reducer => (acc, val) => pred(val) ? reducer(acc, val) : acc;

const append = (acc, val) => [...acc, val];

const xform = compose(
  filter(n => n % 2 === 0),  // even numbers
  map(n => n * n)             // square them
);

function compose(...fns) { return x => fns.reduceRight((v, f) => f(v), x); }

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
// Without transducer: creates 2 intermediate arrays
const r1 = numbers.filter(n => n % 2 === 0).map(n => n * n);

// With transducer: single pass, no intermediate arrays
const r2 = numbers.reduce(xform(append), []);
console.log(r1, r2); // both [4, 16, 36, 64]


// ─────────────────────────────────────────────
// 10. METAPROGRAMMING
// ─────────────────────────────────────────────

// ── Symbol.iterator — make anything iterable ──
class Range {
  constructor(start, end, step = 1) {
    this.start = start; this.end = end; this.step = step;
  }
  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;
    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}
console.log([...new Range(1, 10, 2)]); // [1,3,5,7,9]

// ── Symbol.toPrimitive ──
class Temperature {
  constructor(celsius) { this.celsius = celsius; }
  [Symbol.toPrimitive](hint) {
    if (hint === "number")  return this.celsius;
    if (hint === "string")  return `${this.celsius}°C`;
    return this.celsius;
  }
}
const temp = new Temperature(37);
console.log(+temp);      // 37
console.log(`${temp}`);  // "37°C"
console.log(temp > 36);  // true

// ── Reflect API ──
function createTrackedObject(target) {
  return new Proxy(target, {
    get(t, prop, receiver) {
      console.log(`GET ${prop}`);
      return Reflect.get(t, prop, receiver);
    },
    set(t, prop, value, receiver) {
      console.log(`SET ${prop} = ${JSON.stringify(value)}`);
      return Reflect.set(t, prop, value, receiver);
    },
    deleteProperty(t, prop) {
      console.log(`DELETE ${prop}`);
      return Reflect.deleteProperty(t, prop);
    },
    has(t, prop) {
      console.log(`HAS ${prop}`);
      return Reflect.has(t, prop);
    }
  });
}

const tracked = createTrackedObject({ name: "Alice" });
tracked.name;          // GET name
tracked.age = 30;      // SET age = 30
"name" in tracked;     // HAS name


// ─────────────────────────────────────────────
// 11. PERFORMANCE OPTIMIZATION CONCEPTS
// ─────────────────────────────────────────────

// ── Memoization for expensive computations ──
function memoize(fn, keyFn = JSON.stringify) {
  const cache = new Map();
  return function(...args) {
    const key = keyFn(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ── Lazy evaluation ──
class LazyArray {
  #source;
  #transforms = [];

  constructor(source) { this.#source = source; }

  map(fn) {
    this.#transforms.push({ type: "map", fn });
    return this;
  }

  filter(fn) {
    this.#transforms.push({ type: "filter", fn });
    return this;
  }

  take(n) {
    this.#transforms.push({ type: "take", n });
    return this;
  }

  // Only evaluates when you actually need values
  *[Symbol.iterator]() {
    let count = 0;
    let limit = Infinity;

    for (const val of this.#source) {
      let current = val;
      let skip = false;

      for (const t of this.#transforms) {
        if (t.type === "map")    { current = t.fn(current); }
        if (t.type === "filter") { if (!t.fn(current)) { skip = true; break; } }
        if (t.type === "take")   { limit = t.n; }
      }

      if (!skip) {
        yield current;
        if (++count >= limit) return;
      }
    }
  }

  toArray() { return [...this]; }
}

function* naturals() { let n = 0; while(true) yield n++; }

// Works on infinite sequence — only computes needed values
const result4 = new LazyArray(naturals())
  .filter(n => n % 2 === 0)
  .map(n => n * n)
  .take(5)
  .toArray();
console.log(result4); // [0, 4, 16, 36, 64]

// ── Object pool — reuse objects to avoid GC pressure ──
class ObjectPool {
  #pool = [];
  #factory;
  #reset;

  constructor(factory, reset, initialSize = 10) {
    this.#factory = factory;
    this.#reset = reset;
    for (let i = 0; i < initialSize; i++) {
      this.#pool.push(factory());
    }
  }

  acquire() {
    return this.#pool.length > 0 ? this.#pool.pop() : this.#factory();
  }

  release(obj) {
    this.#reset(obj);
    this.#pool.push(obj);
  }
}

const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (v) => { v.x = 0; v.y = 0; }
);

const v1 = vectorPool.acquire();
v1.x = 10; v1.y = 20;
// use v1...
vectorPool.release(v1);  // back to pool, no GC


// ─────────────────────────────────────────────
// 12. ADVANCED ASYNC PATTERNS
// ─────────────────────────────────────────────

// ── Async queue with drain notification ──
class AsyncQueue {
  #items = [];
  #processing = false;
  #onDrain = null;

  enqueue(item) { this.#items.push(item); this.#processNext(); }

  onDrain(fn) { this.#onDrain = fn; }

  async #processNext() {
    if (this.#processing || !this.#items.length) {
      if (!this.#items.length) this.#onDrain?.();
      return;
    }
    this.#processing = true;
    const item = this.#items.shift();
    await item();
    this.#processing = false;
    this.#processNext();
  }
}

// ── State machine ──
class StateMachine {
  #state;
  #transitions;
  #handlers;

  constructor(initial, transitions, handlers = {}) {
    this.#state = initial;
    this.#transitions = transitions;
    this.#handlers = handlers;
  }

  get state() { return this.#state; }

  transition(event) {
    const stateTransitions = this.#transitions[this.#state];
    if (!stateTransitions || !(event in stateTransitions)) {
      throw new Error(`Invalid transition: ${event} in state ${this.#state}`);
    }
    const nextState = stateTransitions[event];
    this.#handlers.onExit?.[this.#state]?.();
    this.#state = nextState;
    this.#handlers.onEnter?.[nextState]?.();
    return this;
  }

  can(event) {
    return event in (this.#transitions[this.#state] || {});
  }
}

const trafficLight = new StateMachine("red", {
  red:    { go: "green" },
  green:  { slow: "yellow" },
  yellow: { stop: "red" }
}, {
  onEnter: {
    green:  () => console.log("GO!"),
    yellow: () => console.log("SLOW DOWN!"),
    red:    () => console.log("STOP!")
  }
});

trafficLight.transition("go");    // GO!
trafficLight.transition("slow");  // SLOW DOWN!
trafficLight.transition("stop");  // STOP!
console.log(trafficLight.state);  // "red"

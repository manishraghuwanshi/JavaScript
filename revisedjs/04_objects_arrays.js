// ============================================================
// FILE 4: Objects, Arrays & All Reference Types
// Topics: Object literals, Classes, Prototypes, Arrays,
//         Destructuring, Spread, Rest, WeakRef, Proxy, Reflect
// ============================================================


// ─────────────────────────────────────────────
// 1. OBJECTS — BASICS
// ─────────────────────────────────────────────

// Object literal
const person = {
  name: "Alice",
  age: 30,
  "favorite color": "blue",     // key with space — must use quotes
  greet() {                      // method shorthand (ES6)
    return `Hi, I'm ${this.name}`;
  }
};

// Access
console.log(person.name);            // dot notation
console.log(person["favorite color"]); // bracket notation (required for special keys)
console.log(person.greet());

// Modify
person.age = 31;
person.country = "USA";   // add new property
delete person.country;    // remove property

// ── Shorthand property names ──
const name = "Bob";
const age = 25;
const bob = { name, age };   // equivalent to { name: name, age: age }
console.log(bob);

// ── Computed property keys ──
const key = "dynamic";
const obj = {
  [key]: "value",                    // "dynamic": "value"
  [`get${key.toUpperCase()}`]() {   // computed method name
    return this[key];
  }
};
console.log(obj.dynamic);          // "value"
console.log(obj.getDYNAMIC());     // "value"

// ── Property descriptors ──
const strictObj = {};
Object.defineProperty(strictObj, "id", {
  value: 42,
  writable: false,      // cannot change
  enumerable: false,    // won't show in for…in or Object.keys
  configurable: false   // cannot delete or redefine
});
console.log(strictObj.id); // 42

// ── Getters & Setters ──
const temperature = {
  _celsius: 0,
  get fahrenheit() {
    return this._celsius * 9/5 + 32;
  },
  set fahrenheit(f) {
    this._celsius = (f - 32) * 5/9;
  },
  get celsius() { return this._celsius; },
  set celsius(c) { this._celsius = c; }
};

temperature.celsius = 100;
console.log(temperature.fahrenheit); // 212
temperature.fahrenheit = 32;
console.log(temperature.celsius);    // 0


// ─────────────────────────────────────────────
// 2. OBJECT DESTRUCTURING
// ─────────────────────────────────────────────

const user = { firstName: "Alice", lastName: "Smith", role: "admin", age: 30 };

// Basic destructuring
const { firstName, lastName } = user;
console.log(firstName, lastName);  // "Alice" "Smith"

// Rename while destructuring
const { firstName: fName, lastName: lName } = user;
console.log(fName, lName);  // "Alice" "Smith"

// Default values
const { country = "USA", age } = user;
console.log(country, age);  // "USA" 30

// Nested destructuring
const config = {
  server: {
    host: "localhost",
    port: 3000,
    db: { name: "mydb", user: "admin" }
  }
};
const { server: { host, port, db: { name: dbName } } } = config;
console.log(host, port, dbName);  // "localhost" 3000 "mydb"

// Rest in destructuring
const { role, ...rest } = user;
console.log(role);  // "admin"
console.log(rest);  // { firstName:"Alice", lastName:"Smith", age:30 }

// In function parameters
function showUser({ firstName, lastName, role = "viewer" }) {
  console.log(`${firstName} ${lastName} (${role})`);
}
showUser(user);  // "Alice Smith (admin)"

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);  // 2 1


// ─────────────────────────────────────────────
// 3. ARRAY DESTRUCTURING
// ─────────────────────────────────────────────

const [first, second, third] = [10, 20, 30];
console.log(first, second, third);  // 10 20 30

// Skip elements
const [,, last] = [1, 2, 3, 4];
console.log(last);  // 3

// Default values
const [a = 0, b = 0, c = 99] = [1, 2];
console.log(a, b, c);  // 1 2 99

// Rest in array destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head);  // 1
console.log(tail);  // [2,3,4,5]

// Nested array destructuring
const [[p, q], [r, s]] = [[1, 2], [3, 4]];
console.log(p, q, r, s);  // 1 2 3 4

// From function return
function getCoords() { return [52.3676, 4.9041]; }
const [lat, lng] = getCoords();
console.log(lat, lng);  // 52.3676 4.9041


// ─────────────────────────────────────────────
// 4. SPREAD OPERATOR
// ─────────────────────────────────────────────

// Arrays — copy / merge
const original = [1, 2, 3];
const copy = [...original];           // shallow copy
const merged = [...original, 4, 5];  // [1,2,3,4,5]
const combined = [...[1,2], ...[3,4], ...[5,6]];

// Objects — copy / merge (later keys win)
const defaults = { color: "red", size: "M", qty: 1 };
const override = { size: "L", qty: 3 };
const product = { ...defaults, ...override };  // { color:"red", size:"L", qty:3 }
console.log(product);

// Spread in function call
const nums = [5, 3, 8, 1, 9];
console.log(Math.max(...nums));       // 9
console.log(Math.min(...nums));       // 1

// Convert NodeList/arguments to array
// const items = [...document.querySelectorAll("li")];  // browser only

// Spread string to chars
const letters = [..."hello"];  // ["h","e","l","l","o"]


// ─────────────────────────────────────────────
// 5. PROTOTYPES & INHERITANCE
// ─────────────────────────────────────────────

// Every object has a prototype (its "parent")
const animal = {
  type: "animal",
  breathe() { return `${this.name} is breathing`; }
};

// Object.create — explicit prototype chain
const dog = Object.create(animal);
dog.name = "Rex";
dog.bark = function() { return "Woof!"; };

console.log(dog.breathe());         // "Rex is breathing" (inherited)
console.log(dog.bark());            // "Woof!" (own method)
console.log(dog.type);              // "animal" (inherited)
console.log(Object.getPrototypeOf(dog) === animal); // true

// hasOwn vs inherited
console.log(Object.hasOwn(dog, "name"));    // true  (own)
console.log(Object.hasOwn(dog, "breathe")); // false (inherited)

// Prototype chain lookup: dog → animal → Object.prototype → null

// ── Constructor function (old style) ──
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};
Person.prototype.toString = function() {
  return `Person(${this.name}, ${this.age})`;
};

const alice = new Person("Alice", 30);
console.log(alice.greet());    // "Hi, I'm Alice"
console.log(alice instanceof Person); // true


// ─────────────────────────────────────────────
// 6. CLASSES (ES6+)
// ─────────────────────────────────────────────

class Animal {
  // Class field (ES2022)
  #name;   // private field
  species = "Unknown";

  constructor(name, sound) {
    this.#name = name;
    this.sound = sound;
  }

  // Public method
  speak() {
    return `${this.#name} says ${this.sound}`;
  }

  // Getter / setter
  get name() { return this.#name; }
  set name(val) {
    if (typeof val !== "string") throw new TypeError("Name must be a string");
    this.#name = val;
  }

  // Static method — called on class, not instance
  static create(name, sound) {
    return new Animal(name, sound);
  }

  // toString override
  toString() {
    return `Animal(${this.#name})`;
  }
}

class Dog extends Animal {
  #tricks = [];

  constructor(name) {
    super(name, "Woof");   // must call super before using `this`
    this.type = "dog";
  }

  learn(trick) {
    this.#tricks.push(trick);
  }

  perform() {
    return this.#tricks.length
      ? `${this.name} can: ${this.#tricks.join(", ")}`
      : `${this.name} knows no tricks`;
  }

  // Override parent method
  speak() {
    return super.speak() + "! (tail wagging)";
  }
}

const dog2 = new Dog("Buddy");
dog2.learn("sit");
dog2.learn("shake");
console.log(dog2.speak());    // "Buddy says Woof! (tail wagging)"
console.log(dog2.perform());  // "Buddy can: sit, shake"
console.log(dog2 instanceof Dog);    // true
console.log(dog2 instanceof Animal); // true  (chain)

// Static factory
const cat = Animal.create("Whiskers", "Meow");
console.log(cat.speak());  // "Whiskers says Meow"

// Mixin pattern (JS has no multiple inheritance, use mixins)
const Serializable = (Base) => class extends Base {
  serialize() { return JSON.stringify(this); }
  static deserialize(json) { return Object.assign(new this(), JSON.parse(json)); }
};

const Loggable = (Base) => class extends Base {
  log() { console.log(`[LOG] ${this.constructor.name}:`, this); }
};

class User extends Loggable(Serializable(class {})) {
  constructor(name, email) {
    super();
    this.name = name;
    this.email = email;
  }
}

const u = new User("Alice", "alice@example.com");
u.log();
console.log(u.serialize());


// ─────────────────────────────────────────────
// 7. ARRAYS — DEEP DIVE
// ─────────────────────────────────────────────

// Typed Arrays (for binary data / performance)
const int8  = new Int8Array([1, 2, 3]);
const float64 = new Float64Array([1.1, 2.2, 3.3]);
const uint8 = new Uint8ClampedArray([0, 128, 255, 300]); // clamped to 0-255
console.log(uint8); // Uint8ClampedArray [0, 128, 255, 255]

// ArrayBuffer — raw binary
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);
view.setInt32(0, 42);
console.log(view.getInt32(0)); // 42

// Sparse arrays
const sparse = [1,,, 4];   // holes at index 1 and 2
console.log(sparse.length);   // 4
console.log(1 in sparse);     // false — hole, not undefined

// Array-like objects
function demoArgs() {
  console.log(arguments);          // array-like, not an array
  const arr = Array.from(arguments);
  console.log(arr.map(x => x * 2));
}
demoArgs(1, 2, 3);  // [2,4,6]

// Sorting gotchas
console.log([10, 9, 2, 1, 11].sort());            // ["1","10","11","2","9"] ← string sort!
console.log([10, 9, 2, 1, 11].sort((a, b) => a-b)); // [1,2,9,10,11]  ← numeric ✓

// Chaining array methods
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .filter(n => n % 2 === 0)   // [2,4,6,8,10]
  .map(n => n ** 2)            // [4,16,36,64,100]
  .reduce((sum, n) => sum + n, 0); // 220
console.log(result);


// ─────────────────────────────────────────────
// 8. OBJECT CLONING & MERGING
// ─────────────────────────────────────────────

// Shallow copy
const shallow1 = Object.assign({}, original);
const shallow2 = { ...original };  // preferred

// Deep clone (structured clone — modern)
const deep = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
const deepClone = structuredClone(deep);  // ES2022
deepClone.b.c = 99;
console.log(deep.b.c);     // 2 — original untouched!

// ── Gotcha: shallow copy shares nested references ──
const nested = { a: 1, b: { c: 2 } };
const shallowCopy = { ...nested };
shallowCopy.b.c = 99;
console.log(nested.b.c); // 99 — MUTATED!


// ─────────────────────────────────────────────
// 9. ITERATION PROTOCOLS
// ─────────────────────────────────────────────

// Custom iterable object
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        if (current <= last) return { value: current++, done: false };
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) process.stdout.write(n + " ");
console.log(); // 1 2 3 4 5
console.log([...range]); // [1,2,3,4,5]

// Custom iterator class
class LinkedList {
  constructor() { this.head = null; }

  push(val) {
    const node = { val, next: this.head };
    this.head = node;
  }

  [Symbol.iterator]() {
    let current = this.head;
    return {
      next() {
        if (current) {
          const { val } = current;
          current = current.next;
          return { value: val, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const list = new LinkedList();
list.push(1); list.push(2); list.push(3);
console.log([...list]); // [3,2,1]


// ─────────────────────────────────────────────
// 10. PROXY
// ─────────────────────────────────────────────
// Intercept and customize object operations

// Validation proxy
function createValidatedUser(data) {
  return new Proxy(data, {
    set(target, prop, value) {
      if (prop === "age" && (typeof value !== "number" || value < 0)) {
        throw new TypeError("Age must be a non-negative number");
      }
      if (prop === "name" && typeof value !== "string") {
        throw new TypeError("Name must be a string");
      }
      target[prop] = value;
      return true;  // must return true to indicate success
    },
    get(target, prop) {
      if (!(prop in target)) {
        throw new ReferenceError(`Property ${prop} does not exist`);
      }
      return target[prop];
    }
  });
}

const validUser = createValidatedUser({ name: "Alice", age: 30 });
validUser.age = 31;  // ✓
try { validUser.age = -1; } catch(e) { console.log(e.message); }
try { console.log(validUser.unknown); } catch(e) { console.log(e.message); }

// Logging proxy
const logProxy = new Proxy({}, {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} = ${value}`);
    return Reflect.set(target, prop, value);
  }
});

logProxy.name = "test";  // "Setting name = test"
logProxy.name;           // "Getting name"

// Computed / virtual properties
const virtualProps = new Proxy({ firstName: "Alice", lastName: "Smith" }, {
  get(target, prop) {
    if (prop === "fullName") return `${target.firstName} ${target.lastName}`;
    return Reflect.get(target, prop);
  }
});
console.log(virtualProps.fullName); // "Alice Smith"


// ─────────────────────────────────────────────
// 11. REFLECT
// ─────────────────────────────────────────────
// Mirrors Proxy traps; useful in metaprogramming

const obj2 = { a: 1 };
Reflect.set(obj2, "b", 2);
console.log(Reflect.get(obj2, "a"));   // 1
console.log(Reflect.has(obj2, "b"));   // true
Reflect.deleteProperty(obj2, "a");
console.log(Object.keys(obj2));        // ["b"]
console.log(Reflect.ownKeys(obj2));    // ["b"]


// ─────────────────────────────────────────────
// 12. SYMBOLS
// ─────────────────────────────────────────────

const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2);  // false — always unique

const obj3 = {
  [id1]: 123,    // symbol as property key
  name: "Alice"
};

console.log(obj3[id1]);             // 123
console.log(Object.keys(obj3));     // ["name"]  — symbols are hidden!
console.log(Object.getOwnPropertySymbols(obj3)); // [Symbol(id)]

// Well-known symbols
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof MyArray); // true

// Symbol.toPrimitive
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.amount;
    if (hint === "string") return `${this.amount} ${this.currency}`;
    return this.amount;
  }
}

const price = new Money(100, "USD");
console.log(+price);         // 100
console.log(`${price}`);     // "100 USD"
console.log(price + 50);     // 150


// ─────────────────────────────────────────────
// 13. WEAKREF & FINALIZATIONREGISTRY
// ─────────────────────────────────────────────
// For memory-sensitive caching

let heavyObject = { data: new Array(1000).fill("x") };

// WeakRef holds a weak reference (won't prevent garbage collection)
const ref = new WeakRef(heavyObject);

console.log(ref.deref()?.data.length); // 1000

// FinalizationRegistry — callback when object is GC'd
const registry = new FinalizationRegistry((key) => {
  console.log(`Object with key "${key}" was garbage collected`);
});
registry.register(heavyObject, "myObject");

// If heavyObject is set to null and GC runs, the callback fires
// heavyObject = null;


// ─────────────────────────────────────────────
// 14. REAL-WORLD PATTERNS
// ─────────────────────────────────────────────

// Builder pattern
class QueryBuilder {
  #table = "";
  #conditions = [];
  #limit = null;
  #orderBy = null;

  from(table) { this.#table = table; return this; }
  where(condition) { this.#conditions.push(condition); return this; }
  orderBy(field, dir = "ASC") { this.#orderBy = `${field} ${dir}`; return this; }
  limitTo(n) { this.#limit = n; return this; }

  build() {
    let sql = `SELECT * FROM ${this.#table}`;
    if (this.#conditions.length) sql += ` WHERE ${this.#conditions.join(" AND ")}`;
    if (this.#orderBy) sql += ` ORDER BY ${this.#orderBy}`;
    if (this.#limit) sql += ` LIMIT ${this.#limit}`;
    return sql;
  }
}

const query = new QueryBuilder()
  .from("users")
  .where("age > 18")
  .where("active = true")
  .orderBy("name")
  .limitTo(10)
  .build();
console.log(query);
// "SELECT * FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 10"

// Observable pattern (simple)
class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(listener);
    return () => this.off(event, listener);  // returns unsubscribe fn
  }

  off(event, listener) {
    const listeners = this.#events.get(event) || [];
    this.#events.set(event, listeners.filter(l => l !== listener));
  }

  emit(event, ...args) {
    (this.#events.get(event) || []).forEach(l => l(...args));
  }

  once(event, listener) {
    const unsubscribe = this.on(event, (...args) => {
      listener(...args);
      unsubscribe();
    });
  }
}

const emitter = new EventEmitter();
const unsub = emitter.on("data", d => console.log("Received:", d));
emitter.emit("data", { id: 1 });   // "Received: { id: 1 }"
unsub();
emitter.emit("data", { id: 2 });   // nothing — unsubscribed

// ============================================================
// FILE 10 (EXTRA): TypeScript Essentials for JavaScript Devs
// Topics: Types, Interfaces, Generics, Utility Types, Decorators
// Run with: ts-node file.ts  OR  tsc file.ts && node file.js
// ============================================================


// ─────────────────────────────────────────────
// 1. BASIC TYPES
// ─────────────────────────────────────────────

// Primitive types
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;
let bigInt: bigint = 9007199254740991n;
let sym: symbol = Symbol("unique");

// ── any — opt out of type checking (avoid!) ──
let anything: any = "could be anything";
anything = 42;
anything = { key: "value" };

// ── unknown — safer alternative to any ──
let unknown: unknown = "some value";
// unknown.toUpperCase();  // ✗ Error
if (typeof unknown === "string") {
  console.log(unknown.toUpperCase()); // ✓ narrowed to string
}

// ── never — values that never occur ──
function throwError(message: string): never {
  throw new Error(message);  // never returns
}

function infiniteLoop(): never {
  while (true) {}
}

// ── void — function that returns nothing ──
function logMessage(msg: string): void {
  console.log(msg);
}

// ── Type inference — TS often infers types ──
let inferred = "hello";  // TypeScript infers: string
// inferred = 42;  // ✗ Error: Type 'number' is not assignable to type 'string'


// ─────────────────────────────────────────────
// 2. ARRAYS & TUPLES
// ─────────────────────────────────────────────

// Arrays
let nums: number[] = [1, 2, 3];
let strs: Array<string> = ["a", "b", "c"];   // generic syntax
let mixed: (number | string)[] = [1, "two", 3];

// Readonly arrays
const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4);  // ✗ Error

// Tuples — fixed length, typed positions
let point: [number, number] = [10, 20];
let rgb: [number, number, number] = [255, 0, 128];
let entry: [string, number] = ["age", 30];

// Named tuple elements
let coordinate: [x: number, y: number, z?: number] = [10, 20];

// Tuple with rest
let rest: [string, ...number[]] = ["label", 1, 2, 3];


// ─────────────────────────────────────────────
// 3. OBJECTS & INTERFACES
// ─────────────────────────────────────────────

// ── Type alias ──
type Point = { x: number; y: number };
type ID = string | number;  // union type alias

// ── Interface ──
interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "user" | "viewer";  // optional
  readonly createdAt: Date;             // read-only
}

// Interfaces can be extended
interface AdminUser extends User {
  permissions: string[];
  department: string;
}

// Interfaces can be merged (declaration merging)
interface Config {
  host: string;
}
interface Config {
  port: number;
}
const config: Config = { host: "localhost", port: 3000 }; // both required!

// ── Type vs Interface ──
// Interface: extendable, mergeable, for objects/classes
// Type: can be unions, intersections, primitives, computed

// Intersection types
type AdminOnly = User & { permissions: string[] };

// Conditional types
type IsString<T> = T extends string ? true : false;
type Check1 = IsString<string>;  // true
type Check2 = IsString<number>;  // false


// ─────────────────────────────────────────────
// 4. FUNCTIONS
// ─────────────────────────────────────────────

// Function signature
function add(a: number, b: number): number {
  return a + b;
}

// Optional and default parameters
function greet(name: string, greeting: string = "Hello", suffix?: string): string {
  return `${greeting}, ${name}${suffix ?? ""}`;
}

// Rest parameters
function sumAll(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

// Function type
type MathFn = (a: number, b: number) => number;
const multiply: MathFn = (a, b) => a * b;

// Overloads
function format(value: string): string;
function format(value: number, decimals?: number): string;
function format(value: string | number, decimals: number = 2): string {
  if (typeof value === "string") return value.toUpperCase();
  return value.toFixed(decimals);
}

// Generic function
function identity<T>(value: T): T { return value; }
function first<T>(arr: T[]): T | undefined { return arr[0]; }
function pair<A, B>(a: A, b: B): [A, B] { return [a, b]; }

console.log(identity<number>(42));
console.log(identity("hello"));   // inferred
console.log(first([1, 2, 3]));   // 1
console.log(pair("key", 123));   // ["key", 123]


// ─────────────────────────────────────────────
// 5. GENERICS
// ─────────────────────────────────────────────

// Generic class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}

const numStack = new Stack<number>();
numStack.push(1); numStack.push(2);
console.log(numStack.pop()); // 2

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user2 = { id: 1, name: "Alice", role: "admin" };
console.log(getProperty(user2, "name")); // "Alice"
// getProperty(user2, "invalid");  // ✗ Error

// Generic with default type
class Repository<T extends { id: number } = { id: number }> {
  private items: Map<number, T> = new Map();

  add(item: T): void { this.items.set(item.id, item); }
  get(id: number): T | undefined { return this.items.get(id); }
  getAll(): T[] { return Array.from(this.items.values()); }
  delete(id: number): boolean { return this.items.delete(id); }
}

interface Product { id: number; name: string; price: number; }
const repo = new Repository<Product>();
repo.add({ id: 1, name: "Widget", price: 9.99 });


// ─────────────────────────────────────────────
// 6. UNION & INTERSECTION TYPES
// ─────────────────────────────────────────────

// Union
type StringOrNumber = string | number;
type Result<T> = { success: true; data: T } | { success: false; error: string };

// Discriminated union (pattern)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "rect":     return shape.width * shape.height;
    case "triangle": return 0.5 * shape.base * shape.height;
    // TypeScript knows all cases are covered — exhaustive check:
    default: {
      const _exhaustive: never = shape;  // ✗ Error if new case added without handling
      return 0;
    }
  }
}

// Intersection
type Logged = { log(): void };
type Serializable = { serialize(): string };
type LoggedSerializable = Logged & Serializable;


// ─────────────────────────────────────────────
// 7. UTILITY TYPES
// ─────────────────────────────────────────────

interface UserFull {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Partial — all properties optional
type UserUpdate = Partial<UserFull>;

// Required — all properties required
type UserRequired = Required<UserFull>;

// Readonly — all properties read-only
type UserReadonly = Readonly<UserFull>;

// Pick — select subset of properties
type UserPublic = Pick<UserFull, "id" | "name" | "email">;

// Omit — exclude properties
type UserWithoutPassword = Omit<UserFull, "password">;

// Record — key-value map type
type Roles = Record<string, UserFull[]>;
type StatusCode = Record<number, string>;

// Exclude / Extract — filter union types
type NumOrStr = number | string | boolean;
type OnlyStr = Extract<NumOrStr, string>;    // string
type NotStr  = Exclude<NumOrStr, string>;    // number | boolean

// NonNullable — remove null and undefined
type MaybeStr = string | null | undefined;
type DefStr = NonNullable<MaybeStr>;  // string

// ReturnType — extract return type of function
function fetchUser3(): Promise<UserFull> { /* ... */ return Promise.resolve({} as UserFull); }
type FetchReturn = ReturnType<typeof fetchUser3>;  // Promise<UserFull>

// Parameters — extract parameter types
function create(name: string, age: number): UserFull { /* ... */ return {} as UserFull; }
type CreateParams = Parameters<typeof create>;  // [name: string, age: number]

// InstanceType
class MyClass { value = 42; }
type MyInstance = InstanceType<typeof MyClass>;  // MyClass

// Awaited — unwrap Promise type
type UnwrappedFetch = Awaited<FetchReturn>;  // UserFull


// ─────────────────────────────────────────────
// 8. TYPE NARROWING
// ─────────────────────────────────────────────

// typeof guard
function processInput(input: string | number) {
  if (typeof input === "string") {
    return input.toUpperCase();  // narrowed to string
  }
  return input.toFixed(2);  // narrowed to number
}

// instanceof guard
function formatDate(date: Date | string): string {
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
}

// in operator guard
type Bird = { fly(): void; wings: number };
type Fish = { swim(): void; gills: number };

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();  // narrowed to Bird
  } else {
    animal.swim(); // narrowed to Fish
  }
}

// Custom type guard (predicate)
function isUser(obj: unknown): obj is UserFull {
  return (
    typeof obj === "object" && obj !== null &&
    typeof (obj as any).id === "number" &&
    typeof (obj as any).name === "string"
  );
}

// Assertion function
function assertNonNull<T>(val: T | null | undefined, msg: string): asserts val is T {
  if (val == null) throw new Error(msg);
}

// Const assertion
const CONFIG = {
  host: "localhost",
  port: 3000,
  modes: ["development", "production"] as const
} as const;

type Mode = typeof CONFIG.modes[number];  // "development" | "production"


// ─────────────────────────────────────────────
// 9. MAPPED TYPES
// ─────────────────────────────────────────────

// Make all properties optional
type Optional<T> = { [K in keyof T]?: T[K] };

// Make all properties nullable
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Make all properties readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
};

// Getters for each property
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// Filter by value type
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
};

type StringUserFields = OnlyStrings<UserFull>;
// { name: string; email: string; password: string }


// ─────────────────────────────────────────────
// 10. DECORATORS (experimental — needs: experimentalDecorators: true)
// ─────────────────────────────────────────────

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// Method decorator
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${key} with:`, args);
    const result = original.apply(this, args);
    console.log(`${key} returned:`, result);
    return result;
  };
  return descriptor;
}

// Property decorator
function validate(min: number, max: number) {
  return function(target: any, key: string) {
    let value: number;
    Object.defineProperty(target, key, {
      get() { return value; },
      set(newValue: number) {
        if (newValue < min || newValue > max)
          throw new RangeError(`${key} must be between ${min} and ${max}`);
        value = newValue;
      }
    });
  };
}

@sealed
class Calculator {
  @validate(0, 1000)
  memory: number = 0;

  @log
  add(a: number, b: number): number { return a + b; }

  @log
  multiply(a: number, b: number): number { return a * b; }
}

const calc = new Calculator();
console.log(calc.add(3, 4));      // logs call and result
calc.memory = 100;
// calc.memory = 2000;  // ✗ RangeError


// ─────────────────────────────────────────────
// 11. ASYNC TYPESCRIPT
// ─────────────────────────────────────────────

// Typed async function
async function fetchTyped<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Usage with type inference
interface Post { id: number; title: string; body: string; }
const post = await fetchTyped<Post>("https://jsonplaceholder.typicode.com/posts/1");
console.log(post.title);  // TypeScript knows this is a string!

// Typed EventEmitter
type EventMap = {
  "user:created": { id: number; name: string };
  "user:deleted": { id: number };
  "error":        Error;
};

class TypedEmitter<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, Function[]>();

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const list = this.listeners.get(event) || [];
    list.push(handler);
    this.listeners.set(event, list);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    (this.listeners.get(event) || []).forEach(h => h(data));
  }
}

const emitter = new TypedEmitter<EventMap>();
emitter.on("user:created", user => console.log(user.name));  // TypeScript knows user type
emitter.emit("user:created", { id: 1, name: "Alice" });
// emitter.emit("user:created", { id: 1 });  // ✗ Error: missing 'name'

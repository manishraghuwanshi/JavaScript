// ============================================================
// FILE 9 (EXTRA): Error Handling & Debugging
// Topics: Error types, Custom errors, try/catch patterns,
//         Global error handlers, Debugging techniques, Logging
// ============================================================


// ─────────────────────────────────────────────
// 1. BUILT-IN ERROR TYPES
// ─────────────────────────────────────────────

// ── Error (base class) ──
const err = new Error("Something went wrong");
console.log(err.message);    // "Something went wrong"
console.log(err.name);       // "Error"
console.log(err.stack);      // stack trace string

// ── TypeError — wrong type ──
try { null.property; }
catch (e) { console.log(e instanceof TypeError); } // true

// ── ReferenceError — undeclared variable ──
try { undeclaredVariable; }
catch (e) { console.log(e instanceof ReferenceError); } // true

// ── SyntaxError — usually thrown by eval ──
try { eval("{invalid json:"); }
catch (e) { console.log(e instanceof SyntaxError); } // true

// ── RangeError — number out of valid range ──
try { new Array(-1); }
catch (e) { console.log(e instanceof RangeError); } // true

try { (1).toFixed(200); }
catch (e) { console.log(e instanceof RangeError); } // true

// ── URIError — malformed URI ──
try { decodeURIComponent("%"); }
catch (e) { console.log(e instanceof URIError); } // true

// ── EvalError — legacy, rarely used ──

// ── AggregateError — multiple errors (from Promise.any) ──
try {
  await Promise.any([
    Promise.reject("err1"),
    Promise.reject("err2")
  ]);
} catch (e) {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors);  // ["err1", "err2"]
}


// ─────────────────────────────────────────────
// 2. CUSTOM ERROR CLASSES
// ─────────────────────────────────────────────

// Base application error
class AppError extends Error {
  constructor(message, { code, statusCode = 500, context = {} } = {}) {
    super(message);
    this.name = this.constructor.name;  // auto-names to class name
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture V8 stack trace (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message, { field, value, ...rest } = {}) {
    super(message, { code: "VALIDATION_ERROR", statusCode: 400, ...rest });
    this.field = field;
    this.value = value;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id '${id}' not found`, {
      code: "NOT_FOUND",
      statusCode: 404,
      context: { resource, id }
    });
  }
}

class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, { code: "AUTH_ERROR", statusCode: 401 });
  }
}

class NetworkError extends AppError {
  constructor(message, { url, method = "GET", ...rest } = {}) {
    super(message, { code: "NETWORK_ERROR", ...rest });
    this.url = url;
    this.method = method;
  }
}

// Usage
function findUser(id) {
  const users = [{ id: 1, name: "Alice" }];
  const user = users.find(u => u.id === id);
  if (!user) throw new NotFoundError("User", id);
  return user;
}

function validateEmail(email) {
  if (!email?.includes("@")) {
    throw new ValidationError("Invalid email format", {
      field: "email",
      value: email
    });
  }
}

try {
  findUser(999);
} catch (e) {
  if (e instanceof NotFoundError) {
    console.log(`[${e.statusCode}] ${e.message}`);
    console.log(JSON.stringify(e.toJSON(), null, 2));
  }
}


// ─────────────────────────────────────────────
// 3. TRY/CATCH PATTERNS
// ─────────────────────────────────────────────

// ── Basic ──
try {
  throw new Error("oops");
} catch (e) {
  console.error(e.message);
} finally {
  console.log("always runs");
}

// ── Type-based handling ──
function handleError(e) {
  if (e instanceof ValidationError) {
    return { status: 400, message: e.message, field: e.field };
  }
  if (e instanceof NotFoundError) {
    return { status: 404, message: e.message };
  }
  if (e instanceof AuthError) {
    return { status: 401, message: "Please log in" };
  }
  // Unknown error
  console.error("Unexpected error:", e);
  return { status: 500, message: "Internal server error" };
}

// ── Error cause (ES2022) ──
async function fetchUser2(id) {
  try {
    const res = await fetch(`/users/${id}`);
    return res.json();
  } catch (originalError) {
    throw new NetworkError("Failed to fetch user", {
      url: `/users/${id}`,
      cause: originalError   // Error cause chain
    });
  }
}

// Access cause
try {
  await fetchUser2(1);
} catch (e) {
  console.log(e.message);      // "Failed to fetch user"
  console.log(e.cause);        // original fetch error
}

// ── Re-throwing ──
function process(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new ValidationError("Invalid JSON", { field: "data", value: data });
    }
    throw e;  // re-throw unexpected errors
  }
}

// ── Optional catch binding (ES2019) ──
try {
  JSON.parse("{}");
} catch {
  // no `e` needed if you don't use it
  console.log("Parse failed");
}

// ── Async error handling ──
async function safeAsync(fn, ...args) {
  try {
    return [await fn(...args), null];  // [result, null] on success
  } catch (err) {
    return [null, err];                // [null, error] on failure
  }
}

const [user, err2] = await safeAsync(fetchUser2, 1);
if (err2) console.error("Failed:", err2.message);
else console.log(user);


// ─────────────────────────────────────────────
// 4. GLOBAL ERROR HANDLERS
// ─────────────────────────────────────────────

// ── Browser — uncaught errors ──
window.addEventListener("error", (e) => {
  console.error("Uncaught error:", e.error?.message);
  console.error("File:", e.filename, "Line:", e.lineno);
  // return true to suppress default browser error handling
});

// ── Browser — unhandled promise rejections ──
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled rejection:", e.reason);
  e.preventDefault();  // prevent default console error
});

// ── Node.js ──
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);  // exit after uncaught exception (bad state)
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
});

// ── Error boundary concept (without React) ──
class ErrorBoundary {
  #fallback;
  #onError;

  constructor({ fallback = () => null, onError = console.error } = {}) {
    this.#fallback = fallback;
    this.#onError = onError;
  }

  wrap(fn) {
    return (...args) => {
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.catch(e => {
            this.#onError(e);
            return this.#fallback(e);
          });
        }
        return result;
      } catch (e) {
        this.#onError(e);
        return this.#fallback(e);
      }
    };
  }
}

const boundary = new ErrorBoundary({
  fallback: (err) => ({ error: true, message: err.message }),
  onError: (err) => console.error("[Boundary]", err.message)
});

const safeProcess = boundary.wrap((data) => {
  if (!data) throw new Error("No data");
  return { processed: data };
});

console.log(safeProcess(null));    // { error: true, message: "No data" }
console.log(safeProcess("hello")); // { processed: "hello" }


// ─────────────────────────────────────────────
// 5. DEBUGGING TECHNIQUES
// ─────────────────────────────────────────────

// ── debugger statement ──
function buggyFunction(x) {
  debugger;  // execution pauses here in DevTools
  return x * 2;
}

// ── console methods ──
console.log("Basic log");
console.info("Info level");
console.warn("Warning");
console.error("Error");
console.debug("Debug (hidden by default)");

// Formatted output
console.log("%cStyled text", "color: red; font-weight: bold");
console.log("Value: %d, String: %s, Object: %o", 42, "hello", { a: 1 });

// Grouping
console.group("User Data");
console.log("Name: Alice");
console.log("Age: 30");
console.groupCollapsed("Address");  // collapsed by default
console.log("City: NYC");
console.groupEnd();  // Address
console.groupEnd();  // User Data

// Table
console.table([
  { name: "Alice", score: 95 },
  { name: "Bob", score: 87 },
]);

// Timing
console.time("dataProcessing");
const data2 = Array.from({ length: 10000 }, (_, i) => i * 2);
console.timeEnd("dataProcessing");

// Count
function handleRequest() {
  console.count("request");  // prints "request: 1", "request: 2", etc.
}
handleRequest(); handleRequest(); handleRequest();
console.countReset("request");

// Stack trace
function inner() { console.trace("Trace"); }
function outer2() { inner(); }
outer2();

// Assert
console.assert(2 + 2 === 4, "Math is broken");
console.assert(2 + 2 === 5, "This will log");  // "Assertion failed: This will log"

// ── Performance profiling ──
function profileThis() {
  performance.mark("start");

  // Expensive operation
  const result = Array.from({ length: 1000000 }, (_, i) => i).reduce((a, b) => a + b, 0);

  performance.mark("end");
  performance.measure("myOperation", "start", "end");

  const entries = performance.getEntriesByName("myOperation");
  console.log(`Operation took: ${entries[0].duration.toFixed(2)}ms`);
  console.log(`Result: ${result}`);

  performance.clearMarks();
  performance.clearMeasures();
}
profileThis();


// ─────────────────────────────────────────────
// 6. LOGGING SYSTEM
// ─────────────────────────────────────────────

const LogLevel = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, SILENT: 4 };

class Logger {
  #name;
  #level;
  #transports;

  constructor(name, { level = LogLevel.INFO, transports = [] } = {}) {
    this.#name = name;
    this.#level = level;
    this.#transports = transports.length ? transports : [Logger.#consoleTransport];
  }

  static #consoleTransport = {
    log({ level, name, message, data, timestamp }) {
      const methods = { [LogLevel.DEBUG]: "debug", [LogLevel.INFO]: "info",
                        [LogLevel.WARN]: "warn", [LogLevel.ERROR]: "error" };
      const prefix = `[${timestamp}] [${name}]`;
      console[methods[level] || "log"](prefix, message, data !== undefined ? data : "");
    }
  };

  #log(level, message, data) {
    if (level < this.#level) return;

    const entry = {
      level, name: this.#name, message, data,
      timestamp: new Date().toISOString()
    };

    this.#transports.forEach(t => t.log(entry));
  }

  debug(msg, data) { this.#log(LogLevel.DEBUG, msg, data); }
  info(msg, data)  { this.#log(LogLevel.INFO,  msg, data); }
  warn(msg, data)  { this.#log(LogLevel.WARN,  msg, data); }
  error(msg, data) { this.#log(LogLevel.ERROR, msg, data); }

  child(name) {
    return new Logger(`${this.#name}:${name}`, { level: this.#level });
  }
}

const logger = new Logger("App", { level: LogLevel.DEBUG });
const dbLogger = logger.child("Database");

logger.info("Server started", { port: 3000 });
dbLogger.debug("Executing query", { sql: "SELECT * FROM users" });
logger.error("Unhandled error", new Error("oops").stack);


// ─────────────────────────────────────────────
// 7. RESULT TYPE PATTERN (functional error handling)
// ─────────────────────────────────────────────
// Avoids throwing — inspired by Rust's Result<T, E>

class Result {
  #ok;
  #value;
  #error;

  constructor(ok, value, error) {
    this.#ok = ok;
    this.#value = value;
    this.#error = error;
  }

  static ok(value) { return new Result(true, value, null); }
  static err(error) { return new Result(false, null, error); }

  isOk() { return this.#ok; }
  isErr() { return !this.#ok; }

  // Chain: only runs fn if ok
  map(fn) {
    if (this.#ok) {
      try { return Result.ok(fn(this.#value)); }
      catch (e) { return Result.err(e); }
    }
    return this;
  }

  // Chain: if err, try to recover
  recover(fn) {
    if (!this.#ok) {
      try { return Result.ok(fn(this.#error)); }
      catch (e) { return Result.err(e); }
    }
    return this;
  }

  // Async version
  async mapAsync(fn) {
    if (this.#ok) {
      try { return Result.ok(await fn(this.#value)); }
      catch (e) { return Result.err(e); }
    }
    return this;
  }

  // Unwrap — throws if error
  unwrap() {
    if (this.#ok) return this.#value;
    throw this.#error;
  }

  // Unwrap with default
  unwrapOr(defaultValue) {
    return this.#ok ? this.#value : defaultValue;
  }

  // Match — pattern matching
  match({ ok, err }) {
    return this.#ok ? ok(this.#value) : err(this.#error);
  }
}

// Usage
function parseJSON(str) {
  try {
    return Result.ok(JSON.parse(str));
  } catch (e) {
    return Result.err(new ValidationError("Invalid JSON", { value: str }));
  }
}

function validateUser3(data) {
  if (!data.name) return Result.err(new ValidationError("Name required", { field: "name" }));
  if (!data.email) return Result.err(new ValidationError("Email required", { field: "email" }));
  return Result.ok(data);
}

const result5 = parseJSON('{"name":"Alice","email":"alice@example.com"}')
  .map(validateUser3)
  .map(res => res.unwrap())  // unwrap inner Result
  .map(user => ({ ...user, id: crypto.randomUUID() }));

result5.match({
  ok: user => console.log("Created user:", user),
  err: e => console.error("Failed:", e.message)
});

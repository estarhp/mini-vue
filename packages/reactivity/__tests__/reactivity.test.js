import reactivity from "../src/index.ts";
import { strict as assert } from "assert";

assert.strictEqual(reactivity(), "Hello from reactivity");
console.info("reactivity tests passed");

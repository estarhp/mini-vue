import runtimeCore from "../src/runtime-core.ts";
import { strict as assert } from "assert";

assert.strictEqual(runtimeCore(), "Hello from runtimeCore");
console.info("runtimeCore tests passed");

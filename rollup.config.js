import typescript from "@rollup/plugin-typescript";
export default {
  input: "./packages/vue/src/index.ts",
  plugins: [typescript()],
  output: {
    name: "vue",
    format: "es",
    file: "./packages/vue/dist/mini-vue.esm-bundler.js",
    sourcemap: true,
  },
  sourcemap: true,
};

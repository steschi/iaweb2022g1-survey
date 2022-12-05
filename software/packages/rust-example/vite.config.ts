import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";
import FullReload from "vite-plugin-full-reload";

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [wasmPack(["./wasm"]), FullReload(["./wasm/pkg/wasm_bg.wasm"], { delay: 500 })],
});

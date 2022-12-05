import init, { main } from "wasm";

init().then(() => {
  console.log("wasm module initialized");
  main();
});

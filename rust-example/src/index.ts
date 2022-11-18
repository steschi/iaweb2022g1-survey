import init, { greet } from "wasm";

init().then(() => {
  console.log("wasm initialized");
  greet();
});

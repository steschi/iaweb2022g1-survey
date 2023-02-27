# Software demos

Software demos for a research project on Fast and Interactive Web Graphics.
Most of these demos rely on `WebGPU` to be enabled, which must be through a flag until it is standardized.

## Enabling WebGPU

We recommend to use Google Chrome for these demos. A pre-release version of Chrome can be found (here)[https://www.google.com/intl/de/chrome/canary/].
After installing it, navigate to `chrome:flags`, search for `WebGPU` and enable `Unsafe WebGPU`.

## Important Note

The WebGPU spec and the WGSL shader is still **very volatile**, so any of the examples below might stop working **at any point**.
All demos should work with Chrome Canary, version `109.0.5414.25`.
This version can be downloaded for any operating system (here)[https://chromium.cypress.io/].

## Commands

These commands can be executed in the root `software` folder:

| Command                        | Description                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `yarn`                         | Install dependencies and setup workspaces - **has to be executed** once to initialize dependencies |
| `yarn lint`                    | Lint the entire workspace using prettier                                                           |
| `yarn workspace <xxx> build`   | Build workspace `xxx` for production                                                               |
| `yarn workspace <xxx> dev`     | Start development mode for workspace `xxx`                                                         |
| `yarn workspace <xxx> preview` | Start a local preview for the production build of `xxx`                                            |

## List of Available Workspaces

The following workspaces are available:

| Workspace            | Description                                   |
| -------------------- | --------------------------------------------- |
| `webgpu-simple`      | A simple WebGPU example, rendering a triangle |
| `webgl-simple`       | A simple WebGL example, rendering a triangle  |
| `threejs-example`    | A simple ThreeJS example                      |
| `rust-example`       | A rust WebGPU example                         |
| `babylon-js-example` | A BabylonJS example                           |

## Commands Inside Workspaces (mostly for development)

These commands can be executed in a workspace folder (`packages/babylon-js-example`, `packages/rust-example`, `packages/threejs-example`, `packages/webgl-simple`, `packages/webgpu-simple`)

| Command        | Description                      |
| -------------- | -------------------------------- |
| `yarn dev`     | start the dev server             |
| `yarn build`   | build for production             |
| `yarn preview` | locally preview production build |

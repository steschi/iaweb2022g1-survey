import shaderCode from "./shader.wgsl?raw";

import { Vertex, Triangle, encodeVertices } from "shared";
import { createBuffer } from "./helpers";

const render = async (gpu: GPU, canvasContext: GPUCanvasContext) => {
  // configure GPU and render pipeline
  const adapter = await gpu.requestAdapter();

  if (!adapter) {
    return;
  }

  const device = await adapter.requestDevice();

  const encodedData = encodeVertices(Triangle);

  const positionBuffer = createBuffer(device, encodedData, GPUBufferUsage.VERTEX);

  const format = gpu.getPreferredCanvasFormat(); // 'bgra8unorm'
  const commandEncoder = device.createCommandEncoder();
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: device.createShaderModule({ code: shaderCode }),
      entryPoint: "vertex_main",
      buffers: [
        {
          arrayStride: Vertex.byteSize,
          attributes: Vertex.webGPU_attributes,
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({ code: shaderCode }),
      entryPoint: "fragment_main",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  // configure view to display results
  canvasContext.configure({ device, format, alphaMode: "opaque" });
  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: canvasContext.getCurrentTexture().createView(),
        // background color
        clearValue: { r: 0, g: 0.0, b: 0, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, positionBuffer);
  passEncoder.draw(3, 1, 0, 0);
  passEncoder.end();

  // draw
  device.queue.submit([commandEncoder.finish()]);
};

if (!navigator.gpu) {
  alert("WebGPU is not supported or is not enabled, see https://webgpu.io");
  throw new Error("no WebGPU found");
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const wgpu = canvas.getContext("webgpu");

if (!wgpu) {
  throw new Error("no WebGPU context found");
}
await render(navigator.gpu, wgpu);

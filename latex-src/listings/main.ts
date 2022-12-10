const gpu = navigator.gpu;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasContext = canvas.getContext("webgpu")!;

// configure GPU and render pipeline
const adapter = await gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter found");

const device = await adapter.requestDevice();

// setup buffer with vertices data
const encodedData = encodeVertices(Triangle);
const positionBuffer = createBuffer(device, encodedData, GPUBufferUsage.VERTEX);

// setup pipeline
const format = gpu.getPreferredCanvasFormat();
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
      clearValue: { r: 0, g: 0.0, b: 0, a: 1 }, // background color
      loadOp: "clear",
      storeOp: "store",
    },
  ],
});
passEncoder.setPipeline(pipeline);
passEncoder.setVertexBuffer(0, positionBuffer);
passEncoder.draw(3, 1, 0, 0);
passEncoder.end();

// execute the encoded command on the device queue
device.queue.submit([commandEncoder.finish()]);

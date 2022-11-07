export {};

const vertex1Position = [0.0, 0.5];
const vertex2Position = [-0.5, -0.5];
const vertex3Position = [0.5, -0.5];
const positions = new Float32Array([...vertex1Position, ...vertex2Position, ...vertex3Position]);

const vertexShader = /* language=WGSL */ `
  struct VSOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) color: vec4<f32>
  };
  const positions = array<vec2<f32>,3>(
      vec2( 0.0,  0.5), 
      vec2(-0.5, -0.5), 
      vec2( 0.5, -0.5)
  );
 
  @vertex
  fn main(@builtin(vertex_index) vertexIndex: u32) -> VSOutput {
      return VSOutput(
      vec4(positions[vertexIndex], 0.0, 1.0),
      vec4(0.0, 0.0, 1.0, 1.0)
      );
  }`;

const fragmentShader = /* language=WGSL */ `
  @fragment
  fn main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
      return vec4(0.0, 0.0, 0.0, 0.1); // color
  }`;

const render = async (gpu: GPU, canvasContext: GPUCanvasContext) => {
  const adapter = await gpu.requestAdapter();

  if (!adapter) {
    return;
  }
  // canvas independent part
  const device = await adapter.requestDevice();

  const format = gpu.getPreferredCanvasFormat(); // 'bgra8unorm'
  const commandEncoder = device.createCommandEncoder();
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: device.createShaderModule({ code: vertexShader }),
      entryPoint: "main",
    },
    fragment: {
      module: device.createShaderModule({ code: fragmentShader }),
      entryPoint: "main",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  // canvas dependent part
  canvasContext.configure({ device, format, alphaMode: "premultiplied" });
  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: canvasContext.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0.05, b: 0, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  passEncoder.setPipeline(pipeline);
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
render(navigator.gpu, wgpu).then();

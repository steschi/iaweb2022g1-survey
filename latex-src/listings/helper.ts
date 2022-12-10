export function createBuffer(
    device: GPUDevice,
    data: number[],
    usage: GPUBufferUsageFlags
  ): GPUBuffer {
    // Align to 4 bytes
    let desc: GPUBufferDescriptor = {
      size: (data.length * 4 + 3) & ~3,
      usage,
      mappedAtCreation: true,
    };
    let buffer = device.createBuffer(desc);
  
    const writeArray = new Float32Array(buffer.getMappedRange());
  
    writeArray.set(data, 0);
    buffer.unmap();
    return buffer;
  }
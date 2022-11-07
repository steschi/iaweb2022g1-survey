export type Coordinates = {
  x: number;
  y: number;
};

export type Color = [number, number, number];

export class Vertex {
  x: number; // 4 byte
  y: number; // 4 byte
  color: [number, number, number]; // 12 bytes

  static byteSize = 4 + 4 + 12;

  static webGPU_attributes: GPUVertexAttribute[] = [
    {
      // vec2<f32> position
      shaderLocation: 0,
      format: "float32x2",
      offset: 0,
    },
    {
      // vec2<f32> color
      shaderLocation: 1,
      format: "float32x3",
      offset: 4 + 4,
    },
  ];

  encode(): number[] {
    const { x, y, color } = this;
    return [x, y, color[0], color[1], color[2]];
  }

  constructor(position: Coordinates, color: Color) {
    this.x = position.x;
    this.y = position.y;
    this.color = color;
  }
}

export function encodeVertices(vertices: Vertex[]): number[] {
  let result: number[] = [];

  for (const vertex of vertices) {
    result.push(...vertex.encode());
  }
  return result;
}

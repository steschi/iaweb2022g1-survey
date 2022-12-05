import vertexShaderCode from "./vertex-shader.glsl?raw";
import fragmentShaderCode from "./fragment-shader.glsl?raw";
import { encodeVertices, Triangle, Vertex } from "shared";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("webgl");

if (!context) {
  throw new Error("no WebGL context found");
}

// 1. setup vertex shader stage
const vertex_shader = context.createShader(context.VERTEX_SHADER)!;
context.shaderSource(vertex_shader, vertexShaderCode);
context.compileShader(vertex_shader);

// 2. setup fragment shader stage
const fragment_shader = context.createShader(context.FRAGMENT_SHADER)!;
context.shaderSource(fragment_shader, fragmentShaderCode);
context.compileShader(fragment_shader);

// 3. setup overall program
const shader_program = context.createProgram()!;
context.attachShader(shader_program, vertex_shader);
context.attachShader(shader_program, fragment_shader);

context.linkProgram(shader_program);
context.useProgram(shader_program);

// 4. setup buffer for indices
const indices = [0, 1, 2];
const index_buffer = context.createBuffer();
context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, index_buffer);
context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);

// 5. setup buffer for vertices and link them to attributes
const data = encodeVertices(Triangle);
const vertex_buffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer);
context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), context.STATIC_DRAW);

// Get the attribute locations
const coordinatesVariable = context.getAttribLocation(shader_program, "coordinates");
const colorVariable = context.getAttribLocation(shader_program, "color");

// Point an attribute to the currently active entry of the array buffer
context.vertexAttribPointer(coordinatesVariable, 2, context.FLOAT, false, Vertex.byteSize, 0);
context.vertexAttribPointer(colorVariable, 3, context.FLOAT, false, Vertex.byteSize, 8);

// Enable the attributes
context.enableVertexAttribArray(coordinatesVariable);
context.enableVertexAttribArray(colorVariable);

// background color
context.clearColor(0, 0, 0, 1);
context.clear(context.COLOR_BUFFER_BIT);

// Draw the triangle
context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0);

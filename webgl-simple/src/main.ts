export {};

const canvas = document.getElementById("Canvas") as HTMLCanvasElement;
const context = canvas.getContext("webgl");

if (!context) {
  throw new Error("no WebGL context found");
}

context.clearColor(0, 0, 0, 1); // write canvas color into buffer
context.clear(context.COLOR_BUFFER_BIT); //write-out / scan-out of buffer

const vertices = [-0.5, -0.5, 0.0, 0, 0.5, 0.0, 0.5, -0.5, 0.0];
const indices = [0, 1, 2];

const vertex_buffer = context.createBuffer(); //empty buffer to be used as vertex buffer
context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer); //define buffer as array_buffer to save vertex informations
context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW); //write vertices into buffer; define as static to be used multiple times
context.bindBuffer(context.ARRAY_BUFFER, null); // Unbind buffer

//vertex shader source code
const vertex_code = `
  attribute vec3 coordinates;
  void main(void) {
    gl_Position = vec4(coordinates, 1.0);
  }`;

const vertex_shader = context.createShader(context.VERTEX_SHADER)!; // Create vertex shader object
context.shaderSource(vertex_shader, vertex_code); // attach shader code with shader object
context.compileShader(vertex_shader); // Compile vertex shader

//fragment shader source code
const fragment_code = "void main(void) {" + " gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);" + "}";

const fragment_shader = context.createShader(context.FRAGMENT_SHADER)!; // Create fragment shader object
context.shaderSource(fragment_shader, fragment_code); // attach shader code with shader object
context.compileShader(fragment_shader); // Compile fragment shader

const shader_program = context.createProgram()!;
context.attachShader(shader_program, vertex_shader); //attach shader to program
context.attachShader(shader_program, fragment_shader); //attach shader to program
context.linkProgram(shader_program); // link programs

context.useProgram(shader_program); //use program

const index_buffer = context.createBuffer();
context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, index_buffer); //bind index buffer
context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW); //write indices into buffer
context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null); //unbind buffer

context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer); // Bind vertex buffer object
context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, index_buffer); // Bind index buffer object

const coord = context.getAttribLocation(shader_program, "coordinates"); // Get the attribute location

context.vertexAttribPointer(coord, 3, context.FLOAT, false, 0, 0); // Point an attribute to the currently bound VBO

context.enableVertexAttribArray(coord); // Enable the attribute

context.clearColor(0, 0, 0, 1); // write canvas color into buffer
context.clear(context.COLOR_BUFFER_BIT); //write-out / scan-out of buffer
context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0); // Draw the triangle

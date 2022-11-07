attribute vec2 coordinates;
attribute vec3 color;

varying vec4 v_vertex_color;

void main(void) {
  gl_Position = vec4(coordinates, 0.0, 1.0);
  v_vertex_color = vec4(color, 1.0);
}

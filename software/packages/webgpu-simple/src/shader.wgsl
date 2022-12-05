struct VSOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) color: vec4<f32>
  };

@vertex
fn vertex_main(@location(0) position: vec2<f32>, @location(1) color: vec3<f32>) -> VSOutput {
    var output: VSOutput;
    output.position = vec4<f32>(position, 0.0, 1.0);
    output.color = vec4<f32>(color, 1.0);

    return output;
}


@fragment
fn fragment_main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
    return color;
}
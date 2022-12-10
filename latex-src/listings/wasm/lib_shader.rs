log("generating shader");
let shader = device.create_shader_module(include_wgsl!("shader.wgsl"));

log("creating config");
let config = wgpu::SurfaceConfiguration {
    usage: wgpu::TextureUsages::RENDER_ATTACHMENT, // What we want to do with the texture (Render in this case)
    format: surface.get_supported_formats(&adapter)[0], // How to store the texture on the GPU
    width: size.width,
    height: size.height,
    present_mode: wgpu::PresentMode::Fifo, // = V-Sync
    alpha_mode: wgpu::CompositeAlphaMode::Auto,
};
surface.configure(&device, &config);
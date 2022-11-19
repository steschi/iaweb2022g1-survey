use std::iter;

use wgpu::include_wgsl;
use winit::{
    event::Event,
    event_loop::EventLoop,
    window::{Window, WindowBuilder},
};

mod utils;

use wasm_bindgen::prelude::*;

struct State {
    surface: wgpu::Surface,
    device: wgpu::Device,
    queue: wgpu::Queue,
    render_pipeline: wgpu::RenderPipeline,
}

impl State {
    async fn new(window: &Window) -> Self {
        log("initializing state");
        let size = window.inner_size();
        let instance = wgpu::Instance::new(wgpu::Backends::all());

        log("creating surface");
        let surface = unsafe { instance.create_surface(window) };

        log("creating adapter");
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::default(),
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .expect("could not retrieve adapter");

        log("requesting device");
        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: None,
                    features: wgpu::Features::default(),
                    limits: wgpu::Limits::default(),
                },
                None,
            )
            .await
            .expect("failed to create device");

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

        log("creating pipeline layout");
        let pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Render Pipeline Layout"),
            bind_group_layouts: &[],
            push_constant_ranges: &[],
        });

        log("creating swapchain format");
        let swapchain_format = surface.get_supported_formats(&adapter)[0];

        log("creating render pipeline");
        let render_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: None,
            layout: Some(&pipeline_layout),
            vertex: wgpu::VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[],
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader,
                entry_point: "fs_main",
                targets: &[Some(swapchain_format.into())],
            }),
            primitive: wgpu::PrimitiveState::default(),
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
        });

        Self {
            surface,
            device,
            queue,
            render_pipeline,
        }
    }

    fn render(&mut self) -> Result<(), wgpu::SurfaceError> {
        // Get a frame to render to
        let output = self.surface.get_current_texture()?;

        // Create a textureView to control how render interacts with the texture
        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        // Create an encoder that encodes commands into a GPU-supported buffer
        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("Render Encoder"),
            });

        // The extra {} block borrows the encoder mutably (like &mut self)
        {
            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Render Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None, // None means the target is the same as &view
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color::BLACK),
                        store: true,
                    },
                })],
                depth_stencil_attachment: None,
            });

            render_pass.set_pipeline(&self.render_pipeline);
            render_pass.draw(0..3, 0..1); // Draw with 3 vertices in 1 instance
        } // Release the mutable borrow

        self.queue.submit(iter::once(encoder.finish()));
        output.present();

        Ok(())
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str); // Binding for console.log
}

#[wasm_bindgen]
pub fn main() {
    wasm_bindgen_futures::spawn_local(run());
}

pub async fn run() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
    console_log::init().expect("failed to initialize logger");

    let event_loop = EventLoop::new();
    #[cfg(target_arch = "wasm32")]
    {
        let window = WindowBuilder::new().build(&event_loop).unwrap();
        use winit::platform::web::WindowExtWebSys;

        web_sys::window()
            .and_then(|win| win.document())
            .and_then(|doc| {
                let dst = doc.get_element_by_id("wasm-canvas")?;
                let canvas = web_sys::Element::from(window.canvas());
                dst.append_child(&canvas).ok()?;
                Some(())
            })
            .expect("cannot append canvas to body");

        let mut state = State::new(&window).await;
        log("attaching event loop");

        event_loop.run(move |event, _, _| match event {
            Event::RedrawRequested(_) => match state.render() {
                Ok(_) => {}
                _ => {
                    log::warn!("error rendering the scene")
                }
            },
            Event::RedrawEventsCleared => {
                window.request_redraw();
            }
            _ => {}
        });
    }
}

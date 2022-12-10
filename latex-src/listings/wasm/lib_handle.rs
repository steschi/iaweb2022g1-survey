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
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
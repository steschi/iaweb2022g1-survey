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
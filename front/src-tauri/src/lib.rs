use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager,
};

#[derive(Clone, serde::Serialize)]
struct KeyPayload {
    code: String,
    pressed: bool,
}

/// rdev の Key 列挙 → DOM の KeyboardEvent.code 文字列に変換
fn rdev_to_code(key: &rdev::Key) -> Option<&'static str> {
    use rdev::Key::*;
    Some(match key {
        KeyA => "KeyA", KeyB => "KeyB", KeyC => "KeyC", KeyD => "KeyD",
        KeyE => "KeyE", KeyF => "KeyF", KeyG => "KeyG", KeyH => "KeyH",
        KeyI => "KeyI", KeyJ => "KeyJ", KeyK => "KeyK", KeyL => "KeyL",
        KeyM => "KeyM", KeyN => "KeyN", KeyO => "KeyO", KeyP => "KeyP",
        KeyQ => "KeyQ", KeyR => "KeyR", KeyS => "KeyS", KeyT => "KeyT",
        KeyU => "KeyU", KeyV => "KeyV", KeyW => "KeyW", KeyX => "KeyX",
        KeyY => "KeyY", KeyZ => "KeyZ",
        Num0 => "Digit0", Num1 => "Digit1", Num2 => "Digit2",
        Num3 => "Digit3", Num4 => "Digit4", Num5 => "Digit5",
        Num6 => "Digit6", Num7 => "Digit7", Num8 => "Digit8", Num9 => "Digit9",
        Space      => "Space",
        Return     => "Enter",
        Backspace  => "Backspace",
        Tab        => "Tab",
        Escape     => "Escape",
        ShiftLeft  => "ShiftLeft",  ShiftRight  => "ShiftRight",
        ControlLeft => "ControlLeft", ControlRight => "ControlRight",
        Alt        => "AltLeft",    AltGr       => "AltRight",
        CapsLock   => "CapsLock",
        F1 => "F1", F2 => "F2",  F3 => "F3",  F4  => "F4",
        F5 => "F5", F6 => "F6",  F7 => "F7",  F8  => "F8",
        F9 => "F9", F10 => "F10", F11 => "F11", F12 => "F12",
        BackQuote   => "Backquote",
        Minus       => "Minus",
        Equal       => "Equal",
        LeftBracket => "BracketLeft",
        RightBracket => "BracketRight",
        BackSlash   => "Backslash",
        SemiColon   => "Semicolon",
        Quote       => "Quote",
        Comma       => "Comma",
        Dot         => "Period",
        Slash       => "Slash",
        UpArrow    => "ArrowUp",   DownArrow  => "ArrowDown",
        LeftArrow  => "ArrowLeft", RightArrow => "ArrowRight",
        Home => "Home", End => "End",
        PageUp => "PageUp", PageDown => "PageDown",
        Insert => "Insert", Delete => "Delete",
        PrintScreen => "PrintScreen",
        ScrollLock  => "ScrollLock",
        Pause       => "Pause",
        NumLock     => "NumLock",
        _ => return None,
    })
}

/// バックグラウンドスレッドで OS 全体のキーイベントを監視し Tauri イベントに変換する
fn start_global_keyboard(app: tauri::AppHandle) {
    std::thread::spawn(move || {
        let _ = rdev::listen(move |event| {
            let (code, pressed) = match &event.event_type {
                rdev::EventType::KeyPress(k)   => (rdev_to_code(k), true),
                rdev::EventType::KeyRelease(k) => (rdev_to_code(k), false),
                _ => return,
            };
            if let Some(code) = code {
                let _ = app.emit("global_key", KeyPayload {
                    code: code.to_string(),
                    pressed,
                });
            }
        });
    });
}

fn toggle_window(app: &tauri::AppHandle) {
    if let Some(win) = app.get_webview_window("main") {
        if win.is_visible().unwrap_or(false) {
            let _ = win.hide();
        } else {
            let _ = win.show();
            let _ = win.set_focus();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // グローバルキーボード監視を開始
            start_global_keyboard(app.handle().clone());

            // システムトレイ
            let toggle = MenuItem::with_id(app, "toggle", "表示 / 非表示", true, None::<&str>)?;
            let quit   = MenuItem::with_id(app, "quit",   "終了",          true, None::<&str>)?;
            let menu   = Menu::with_items(app, &[&toggle, &quit])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("keyboard-micro-joy")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "toggle" => toggle_window(app),
                    "quit"   => app.exit(0),
                    _        => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        toggle_window(tray.app_handle());
                    }
                })
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

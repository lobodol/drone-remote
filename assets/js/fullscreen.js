function successFunction() {
    console.info("It worked!");
}

function errorFunction(error) {
    console.error(error);
}

function trace(value) {
    console.log(value);
}

// Is this plugin supported?
AndroidFullScreen.isSupported();

// Is immersive mode supported?
AndroidFullScreen.isImmersiveModeSupported(successFunction, errorFunction);

// The width of the screen in immersive mode
AndroidFullScreen.immersiveWidth(trace, errorFunction);

// The height of the screen in immersive mode
AndroidFullScreen.immersiveHeight(trace, errorFunction);

// Hide system UI until user interacts
AndroidFullScreen.leanMode(successFunction, errorFunction);

// Show system UI
AndroidFullScreen.showSystemUI(successFunction, errorFunction);

// Extend your app underneath the status bar (Android 4.4+ only)
AndroidFullScreen.showUnderStatusBar(successFunction, errorFunction);

// Extend your app underneath the system UI (Android 4.4+ only)
AndroidFullScreen.showUnderSystemUI(successFunction, errorFunction);

// Hide system UI and keep it hidden (Android 4.4+ only)
AndroidFullScreen.immersiveMode(successFunction, errorFunction);

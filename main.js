const {
  systemPreferences,
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
} = require("electron");
const path = require("path");
const fixPath = require("fix-path");

fixPath();

let tray;
let window;

app.dock.hide();
app.on("ready", () => {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, "assets/topBarIcon.png")
  );
  tray = new Tray(icon);

  tray.on("click", (event) => {
    toggleWindow();
  });

  window = new BrowserWindow({
    width: 250,
    height: 30,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
  });

  window.loadURL(`file://${path.join(__dirname, "index.html")}`);

  window.on("blur", () => {
    window.hide();
  });

  window.on("show", () => {
    tray.setHighlightMode("always");
  });
  window.on("hide", () => {
    tray.setHighlightMode("never");
  });
});

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x;
  let y;
  if (process.platform === "darwin") {
    x = Math.round(trayPos.x);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  const vibrancy = systemPreferences.isDarkMode() ? "dark" : "medium-light";
  window.setPosition(x, y, false);
  window.setVibrancy(vibrancy);
  window.webContents.send("vibrancy", vibrancy);
  window.show();
  window.focus();
};

ipcMain.on("show-window", () => {
  showWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

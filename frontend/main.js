const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loading;

function createWindow () {
  loading = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true
  });

  loading.once('show', () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1014,
      height: 680,
      show: false,
      frame: false,
      transparent: false,
      title: 'Hakon'
    });
    mainWindow.webContents.once('dom-ready', () => {
      console.log('main loaded');
      mainWindow.show();
      loading.hide();
      loading.close();
    });
    // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, '/dist/index.html'),
    //   protocol: 'file:',
    //   hash: '#index'
    // }));
    mainWindow.loadURL('http://127.0.0.1:8080/#/index/', {});
  });
  loading.loadURL(`file://${__dirname}/dist/loading.html`);
  loading.show();

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('min', e => mainWindow.minimize());
ipcMain.on('max', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('close', e => mainWindow.close());
ipcMain.on('webview', e => {
  let webview = new BrowserWindow({ width: 1014, height: 680, show: true, frame: true, autoHideMenuBar: true });
  webview.loadURL(url.format({
    pathname: path.join(__dirname, '/dist/index.html'),
    protocol: 'file:',
    hash: '#admin/login'
  }));
  webview.webContents.openDevTools();
});

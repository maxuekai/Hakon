const electron = require('electron');
const { ipcMain } = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loading;

function createWindow() {

    loading = new BrowserWindow({ show: false, frame: false });

    loading.once('show', () => {
        // Create the browser window.
        mainWindow = new BrowserWindow({ width: 1014, height: 680, show: false, frame: false, title: 'Hakon' });
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
        //   slashes: true
        // }));
        mainWindow.loadURL('http://127.0.0.1:8080/#/moduleManageTool/', {});
    });
    loading.loadURL(`file://${__dirname}/dist/loading.html`);
    loading.show();

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
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
        let webview = new BrowserWindow({ width: 1014, height: 680, show: true, frame: true, autoHideMenuBar:true });
        webview.loadURL('http://127.0.0.1:8080/#/manage/', {});
        webview.webContents.openDevTools();
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
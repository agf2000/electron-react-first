const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow, imageWindow, settingsWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 680,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => (mainWindow = null));

	imageWindow = new BrowserWindow({
		show: false,
		width: 600,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
		parent: mainWindow,
	});
	imageWindow.loadURL(isDev ? 'http://localhost:3000/image' : `file://${path.join(__dirname, '../build/index.html')}`);
	imageWindow.on('close', (e) => {
		e.preventDefault();
		imageWindow.hide();
	});

	settingsWindow = new BrowserWindow({
		width: 600,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	settingsWindow.loadURL(isDev ? 'http://localhost:3000/settings' : `file://${path.join(__dirname, '../build/index.html')}`);
	settingsWindow.on('close', (e) => {
		e.preventDefault();
		settingsWindow.hide();
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

ipcMain.on('open-image', (event, arg) => {
	imageWindow.show();
	imageWindow.webContents.send('image', arg);
});

ipcMain.on('toggle-settings', () => {
	settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
});

import { BrowserWindow, Menu } from 'electron';
import { isDev } from './util.js';

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'devTools',
        click: () => mainWindow.webContents.openDevTools(),
        visible: isDev(),
      },
    ])
  );
}

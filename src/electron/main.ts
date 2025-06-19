import { app, BrowserWindow } from 'electron';

import { ipcMainHandle, isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { getTaskList, addTask, deleteTask, getTask, updateTaskTime } from './fileOperations.js';

import { createTray } from './tray.js';
import { createMenu } from './menu.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    height: 700,
    minWidth: 1000,
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  createTray(mainWindow);
  createMenu(mainWindow);
  handleCloseEvents(mainWindow);

  ipcMainHandle('getTaskList', () => {
    return getTaskList();
  });
  ipcMainHandle('addTask', async (data) => {
    return await addTask(data);
  });
  ipcMainHandle('deleteTask', async (id) => {
    return await deleteTask(id);
  });
  ipcMainHandle('getTask', (id) => {
    return getTask(id);
  });
  ipcMainHandle('updateTaskTime', async ({ id, time, timestamp }) => {
    return await updateTaskTime(id, time, timestamp);
  });
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }

    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}

import { app, BrowserWindow } from 'electron';

import { ipcMainHandle, isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { getTaskList, addTask } from './fileOperations.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  ipcMainHandle('getTaskList', () => {
    return getTaskList();
  });

  ipcMainHandle('addTask', async (data) => {
    await addTask(data);
  });
});

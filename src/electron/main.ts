import { app, BrowserWindow } from 'electron';

import { ipcMainHandle, isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { getTaskList, addTask, deleteTask, getTask, updateTaskTime } from './fileOperations.js';

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
    return await addTask(data);
  });

  ipcMainHandle('deleteTask', async (id) => {
    return await deleteTask(id);
  });

  ipcMainHandle('getTask', (id) => {
    return getTask(id);
  });

  ipcMainHandle('updateTaskTime', async ({ id, time }) => {
    return await updateTaskTime(id, time);
  });
});

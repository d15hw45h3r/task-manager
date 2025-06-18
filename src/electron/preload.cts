const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  getTaskList: () => ipcInvoke('getTaskList'),
  addTask: (data) => ipcInvoke('addTask', data),
  deleteTask: (id) => ipcInvoke('deleteTask', id),
  getTask: (id) => ipcInvoke('getTask', id),
  updateTaskTime: (id, time, timestamp) => ipcInvoke('updateTaskTime', { id, time, timestamp }),
} satisfies Window['electron']);

// to get async data
function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  args?: any
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, args);
}

// to get static data
function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

import { ipcMain, WebContents, WebFrameMain } from 'electron';
import { getUIPath } from './pathResolver.js';
import { pathToFileURL } from 'url';

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

// type-safe ipc main handler
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (args: any) => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event, args) => {
    event.senderFrame && validateEventFrame(event.senderFrame);
    return handler(args);
  });
}

// type-safe webContents send
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === 'localhost:5123') {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error('Malicious event');
  }
}
// 1:35:44

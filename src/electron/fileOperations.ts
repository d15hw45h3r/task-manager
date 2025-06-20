import { app } from 'electron';
import * as fs from 'fs';
import { nanoid } from 'nanoid';
import * as path from 'path';

const userDataPath = app.getPath('appData');
const igxDirectoryPath = path.join(userDataPath, 'task-manager');
const parentDirectoryPath = path.join(igxDirectoryPath, 'data');

function ensureICSDirectory(): void {
  if (!fs.existsSync(parentDirectoryPath)) {
    fs.mkdirSync(parentDirectoryPath, { recursive: true });
    console.log('Directory created successfully:', parentDirectoryPath);
  } else {
    console.log('Directory already exists:', parentDirectoryPath);
  }
}

// Ensure directory and file existence
function ensureFileExistence(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
  }
}

// Read data from a file
export function getTaskList(): TaskList {
  ensureICSDirectory();
  const filePath = path.join(parentDirectoryPath, 'output.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } else {
    return [];
  }
}

export async function addTask(task: TaskBase): Promise<void> {
  const filePath = path.join(parentDirectoryPath, 'output.json');
  await ensureFileExistence(filePath);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (readErr, data) => {
      if (readErr) return reject(readErr);

      let obj: TaskList = [];

      try {
        obj = JSON.parse(data);
      } catch (parseErr) {
        return reject(parseErr);
      }

      obj.push({ ...task, id: nanoid(), elapsedTime: 0, history: [] });

      fs.writeFile(filePath, JSON.stringify(obj, null, 2), 'utf-8', (writeErr) => {
        if (writeErr) return reject(writeErr);
        resolve();
      });
    });
  });
}

export async function deleteTask(id: string): Promise<void> {
  const filePath = path.join(parentDirectoryPath, 'output.json');
  await ensureFileExistence(filePath);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (readErr, data) => {
      if (readErr) return reject(readErr);

      let obj: TaskList = [];

      try {
        obj = JSON.parse(data);
      } catch (parseErr) {
        return reject(parseErr);
      }

      obj = obj.filter((task) => task.id !== id);

      fs.writeFile(filePath, JSON.stringify(obj, null, 2), 'utf-8', (writeErr) => {
        if (writeErr) return reject(writeErr);
        resolve();
      });
    });
  });
}

export function getTask(id: string): Task | null {
  ensureICSDirectory();
  const filePath = path.join(parentDirectoryPath, 'output.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed: TaskList = JSON.parse(data);
    const found = parsed.find((task) => task.id === id);
    if (found) return found;
    // return JSON.parse(data);
  }

  return null;
}

export async function updateTaskTime(
  id: string,
  time: number,
  timestamp: Timestamp
): Promise<void> {
  const filePath = path.join(parentDirectoryPath, 'output.json');
  await ensureFileExistence(filePath);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (readErr, data) => {
      if (readErr) return reject(readErr);

      let obj: TaskList = [];
      try {
        obj = JSON.parse(data);
      } catch (parseErr) {
        return reject(parseErr);
      }

      const updatedObj = obj.map((task) => {
        if (task.id === id) {
          return { ...task, elapsedTime: time, history: [timestamp, ...task.history] };
        }
        return task;
      });

      fs.writeFile(filePath, JSON.stringify(updatedObj, null, 2), 'utf-8', (writeErr) => {
        if (writeErr) return reject(writeErr);
        resolve();
      });
    });
  });
}

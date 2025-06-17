import { app } from 'electron';
import * as fs from 'fs';
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

export function addTask(task: Task): void {
  // const timestamp = Date.now().toString();
  const directoryPath = path.join(parentDirectoryPath);
  const filePath = path.join(directoryPath, 'output.json');
  ensureFileExistence(filePath);

  let obj: TaskList = [];

  fs.readFile(filePath, (err, data: any) => {
    if (err) {
      throw new Error(err.message);
    } else {
      obj = JSON.parse(data);
      obj.push(task);
      fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf-8');
    }
  });
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

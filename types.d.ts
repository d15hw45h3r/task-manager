type TaskBase = {
  name: string;
};

interface Task extends TaskBase {
  id: string;
  elapsedTime: number;
  history: Timestamp[];
}

type Timestamp = {
  start: Date;
  end: Date;
};

type TaskList = Task[];

type EventPayloadMapping = {
  getTaskList: TaskList;
  addTask: void;
  deleteTask: void;
  getTask: Task | null;
  updateTaskTime: void;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    getTaskList: () => Promise<TaskList>;
    addTask: (data: TaskBase) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    getTask: (id: string) => Promise<Task | null>;
    updateTaskTime: (id: string, time: number, timestamp: Timestamp) => Promise<void>;
  };
}

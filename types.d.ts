type TaskBase = {
  name: string;
};

interface Task extends TaskBase {
  id: string;
  // isCompleted: boolean;
}

type TaskList = Task[];

type EventPayloadMapping = {
  getTaskList: TaskList;
  addTask: void;
  deleteTask: void;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    getTaskList: () => Promise<TaskList>;
    addTask: (data: TaskBase) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
  };
}

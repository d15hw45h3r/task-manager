type Task = {
  name: string;
  // isCompleted: boolean;
};

type TaskList = Task[];

type EventPayloadMapping = {
  getTaskList: TaskList;
  addTask: void;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    getTaskList: () => Promise<TaskList>;
    addTask: (data: any) => Promise<void>;
  };
}

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Sidebar from './components/sidebar/sidebar';
import CurrentTask from './components/currentTask/currentTask';

function App() {
  const [tasks, setTasks] = useState<TaskList>([]);
  const [openTask, setOpenTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (openTask !== null) {
      const found = tasks.find((t) => t.id === openTask?.id);
      if (!found) setOpenTask(null);
    }
  }, [tasks, openTask]);

  const getTasks = async () => {
    const tasks = await window.electron.getTaskList();
    setTasks(tasks);
  };

  const handleAddTask = async (task: TaskBase) => {
    await window.electron.addTask(task);
    await getTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await window.electron.deleteTask(id);
    await getTasks();
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Sidebar
          tasks={tasks}
          onAdd={handleAddTask}
          onDelete={handleDeleteTask}
          onOpen={(task) => setOpenTask(task)}
          openTask={openTask}
        />
        <CurrentTask task={openTask} />
      </div>
    </div>
  );
}

export default App;

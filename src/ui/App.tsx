import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [tasks, setTasks] = useState<TaskList>([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const tasks = await window.electron.getTaskList();
    setTasks(tasks);
  };

  return (
    <div>
      <ul>
        {tasks.map((t) => (
          <li>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import { ChangeEventHandler, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { BiCheck } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

function App() {
  const [tasks, setTasks] = useState<TaskList>([]);
  const [isInputvisible, setIsInputVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const tasks = await window.electron.getTaskList();
    setTasks(tasks);
  };

  const handleAddTask = async () => {
    await window.electron.addTask({ name: input });
    await getTasks();
    handleCloseInput();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: input }) => {
    setInput(input.value);
  };

  const handleCloseInput = () => {
    setInput('');
    setIsInputVisible(false);
  };

  const handleDeleteTask = async (id: string) => {
    await window.electron.deleteTask(id);
    await getTasks();
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          <div className={styles.heading}>
            <h1>Tasks</h1>
            {!isInputvisible && <button onClick={() => setIsInputVisible(true)}>add task</button>}
          </div>

          {isInputvisible && (
            <div className={styles.input}>
              <input placeholder='task name' value={input} onChange={handleChange} />
              <button className={styles.sm} disabled={input.length === 0} onClick={handleAddTask}>
                <BiCheck size='1.3em' color='#eebbc3' />
              </button>
              <button className={styles.sm} onClick={handleCloseInput}>
                <IoClose size='1.3em' color='#eebbc3' />
              </button>
            </div>
          )}

          <ul style={{ marginTop: '3rem' }}>
            {tasks.map((task, index) => (
              <li className={styles.task} key={index}>
                <p>{task.name}</p>
                <button onClick={() => handleDeleteTask(task.id)} className={styles.sm}>
                  <IoClose size='1.3em' color='#eebbc3' />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.main}>main content</div>
      </div>
    </div>
  );
}

export default App;

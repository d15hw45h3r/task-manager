import { ChangeEventHandler, FC, useState } from 'react';
import styles from './sidebar.module.scss';
import { BiCheck } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

interface SidebarProps {
  tasks: TaskList;
  openTask: string | null;
  onDelete: (id: string) => void;
  onOpen: (taskId: string) => void;
  onAdd: (task: TaskBase) => void;
}

const Sidebar: FC<SidebarProps> = ({ tasks, onDelete, openTask, onOpen, onAdd }) => {
  const [isInputvisible, setIsInputVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: input }) => {
    setInput(input.value);
  };

  const handleCloseInput = () => {
    setInput('');
    setIsInputVisible(false);
  };

  const handleAddTask = () => {
    onAdd({ name: input });
    handleCloseInput();
  };

  return (
    <>
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
            <li
              className={`${styles.task} ${openTask === task.id && styles.active}`}
              key={index}
              onClick={() => onOpen(task.id)}
            >
              <p>{task.name}</p>
              <button onClick={() => onDelete(task.id)} className={styles.sm}>
                <IoClose size='1.3em' style={{ fill: '#eebbc3' }} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

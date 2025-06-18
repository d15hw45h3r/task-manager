import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BiPlay, BiStop } from 'react-icons/bi';
import styles from './currentTask.module.scss';
import { format } from 'date-fns';
import { formatDuration } from '../../utils';

interface CurrentTaskProps {
  taskId: string | null;
  onDelete: (taskId: string) => void;
  onUpdate: () => void;
}

const CurrentTask: FC<CurrentTaskProps> = ({ taskId, onDelete, onUpdate }) => {
  const intervalRef = useRef<number>(0);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (taskId === null) setTask(null);
    getTask();
  }, [taskId]);

  const getTask = async () => {
    if (taskId !== null) {
      const task = await window.electron.getTask(taskId);
      setTask(task);

      if (task) {
        setElapsed(task.elapsedTime);
      }
    }
  };

  const clearTimer = useCallback(() => {
    // Only clear if the timer is running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [taskId]);

  const startTimer = () => {
    // Ignore if there's already a timer running
    if (intervalRef.current) clearTimer();

    setStartDate(new Date());
    intervalRef.current = window.setInterval(() => {
      setElapsed((t) => t + 100);
    }, 100);
  };

  const stopTimer = async () => {
    clearTimer();
    if (task !== null && startDate !== null) {
      await window.electron.updateTaskTime(task.id, elapsed, { start: startDate, end: new Date() });
      // console.log({ elapsed });

      await getTask();
      onUpdate();
    }
  };

  useEffect(() => {
    return () => {
      // Clear timer on unmount
      clearTimer();
    };
  }, [clearTimer]);

  return (
    <>
      <div className={styles.main}>
        {task !== null && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => onDelete(task.id)}>delete</button>
            </div>
            <div className={styles.timer}>{formatDuration(elapsed)}</div>
            <div style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '20px' }}>
              {task?.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={startTimer}>
                <BiPlay size='1.3em' /> start
              </button>
              <button onClick={stopTimer}>
                <BiStop size='1.3em' /> <span>stop</span>
              </button>
            </div>

            {task.history.length > 0 && (
              <div className={styles.history}>
                <h3>history</h3>

                <div className={styles.list}>
                  {task.history.map((item, index) => (
                    <div key={index} className={styles.historyItem}>
                      {format(new Date(item.start), 'dd:MM.yyyy')}:{' '}
                      <div style={{ display: 'flex' }}>
                        <BiPlay size='1.3em' />
                        {format(new Date(item.start), 'HH:mm:ss')}
                      </div>
                      <div style={{ display: 'flex' }}>
                        <BiStop size='1.3em' />
                        {format(new Date(item.end), 'HH:mm:ss')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CurrentTask;

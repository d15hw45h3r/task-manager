import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BiPlay, BiStop } from 'react-icons/bi';
import styles from './currentTask.module.scss';

interface CurrentTaskProps {
  taskId: string | null;
}

const CurrentTask: FC<CurrentTaskProps> = ({ taskId }) => {
  const intervalRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
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

    intervalRef.current = window.setInterval(() => {
      setElapsed((t) => t + 100);
    }, 100);
  };

  const stopTimer = async () => {
    clearTimer();
    if (task !== null) {
      await window.electron.updateTaskTime(task.id, elapsed);
      console.log({ elapsed });

      await getTask();
    }
  };

  useEffect(() => {
    return () => {
      // Clear timer on unmount
      clearTimer();
    };
  }, [clearTimer]);

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className={styles.main}>
        {task !== null && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default CurrentTask;

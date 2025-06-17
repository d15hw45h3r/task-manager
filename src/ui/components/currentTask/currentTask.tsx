import { FC } from 'react';
import { BiPlay, BiStop } from 'react-icons/bi';
import styles from './currentTask.module.scss';

interface CurrentTaskProps {
  task: Task | null;
}

const CurrentTask: FC<CurrentTaskProps> = ({ task }) => {
  return (
    <>
      <div className={styles.main}>
        {task !== null && (
          <>
            <div className={styles.timer}>00:00:00</div>
            <div style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '20px' }}>
              {task?.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button>
                <BiPlay size='1.3em' /> start
              </button>
              <button>
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

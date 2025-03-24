import css from './Settings.module.css';

import { Background, Button } from '../../components';
import { useDifficulty, useMarks, useTime } from '../../store';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const nav = useNavigate();

  const { time, setTime } = useTime();
  const { marks, setMarks } = useMarks();
  const { diff, setDiff } = useDifficulty();

  return (
    <Background>
      <h3>Настройка игры с ботом</h3>
      <div className={css.chooseContainer}>
        <div className={css.chooseContent}>
          <p>Ограничение по времени: </p>
          {/* TODO: Переписать этот ужас */}
          <span className={time === 5 ? css.active : css.noActive} onClick={() => setTime(5)}>
            5 мин
          </span>{' '}
          /{' '}
          <span className={time === 10 ? css.active : css.noActive} onClick={() => setTime(10)}>
            10 мин
          </span>{' '}
          /{' '}
          <span className={time === 15 ? css.active : css.noActive} onClick={() => setTime(15)}>
            15 мин
          </span>{' '}
          /{' '}
          <span className={time === null ? css.active : css.noActive} onClick={() => setTime(null)}>
            нет
          </span>
        </div>
        <div className={css.chooseContent}>
          <p>Помечать соседние клетки при потоплении корабля: </p>
          {/* TODO: Переписать этот ужас */}
          <span className={marks ? css.active : css.noActive} onClick={() => setMarks(true)}>
            да
          </span>{' '}
          /{' '}
          <span className={!marks ? css.active : css.noActive} onClick={() => setMarks(false)}>
            нет
          </span>
        </div>
        <div className={css.exampleContent}>здесь должен быть пример</div>
        <div className={css.chooseContent}>
          <p>Интелект у бота: </p>
          {/* TODO: Переписать этот ужас */}
          <span
            className={diff === 'high' ? css.active : css.noActive}
            onClick={() => setDiff('high')}
          >
            высокий
          </span>{' '}
          /{' '}
          <span
            className={diff === 'medium' ? css.active : css.noActive}
            onClick={() => setDiff('medium')}
          >
            средний
          </span>{' '}
          /{' '}
          <span
            className={diff === 'low' ? css.active : css.noActive}
            onClick={() => setDiff('low')}
          >
            низкий
          </span>
        </div>
      </div>
      <div className={css.buttons}>
        <Button status={true} size={'large'} onClick={() => nav('/setup')}>
          Перейти к расстановке
        </Button>
        <Button status={true} size={'large'} onClick={() => nav('/')}>
          Вернуться в меню
        </Button>
      </div>
    </Background>
  );
};

export default Settings;

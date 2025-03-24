import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import css from './Error.module.css';

const Error = () => {
  const nav = useNavigate('/');

  return (
    <div className={css.mainContainer}>
      <h2>Ой!</h2>
      <span className={css.textContainer}>
        <p>Кажется, такой страницы нет</p>
        <p>Вернитесь домой, нажав на кнопку снизу</p>
      </span>
      <Button status={true} size={'large'} onClick={() => nav('/')}>
        Вернуться домой
      </Button>
    </div>
  );
};

export default Error;

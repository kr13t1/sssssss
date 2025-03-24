import css from './ResultModal.module.css';

import { Button } from '../button/Button';

import { useNavigate } from 'react-router-dom';

export const ResultModal = ({ status, result }) => {
  const nav = useNavigate();

  return (
    <div className={status ? css.active : css.noActive}>
      <div className={css.mainContainer}>
        <h2 className={result === 'win' ? css.win : css.loss}>
          {result === 'win' ? 'Вы выиграли!' : 'Вы проиграли!'}
        </h2>
        <hr />
        <Button onClick={() => nav('/')} status={true}>
          Вернуться в меню
        </Button>
      </div>
    </div>
  );
};

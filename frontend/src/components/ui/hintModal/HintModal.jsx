import css from './HintModal.module.css';

import { Button } from '../button/Button';

export const HintModal = ({ status, changeStatus, title, desc }) => {
  return (
    <div className={status ? css.active : css.noActive} onClick={changeStatus}>
      <div className={css.mainContainer} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <hr />
        <p className={css.descContent}>{desc}</p>
        <hr />
        <Button status={true} size={'large'} onClick={changeStatus}>
          Закрыть
        </Button>
      </div>
    </div>
  );
};

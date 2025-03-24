import css from './CellField.module.css';

export const CellField = ({ value, find, whose, onClick }) => {
  return (
    <>
      {whose !== 'enemy' ? (
        <div
          className={
            value > 0 && find ? css.hitting : find ? css.noHitting : value > 0 ? css.ship : css.cell
          }
          style={{ cursor: 'no-drop' }}
          onClick={onClick}
        />
      ) : (
        <div
          className={value > 0 && find ? css.hitting : find ? css.noHitting : css.cell}
          onClick={onClick}
        />
      )}
    </>
  );
};

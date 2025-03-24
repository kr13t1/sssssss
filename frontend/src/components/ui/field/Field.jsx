import css from './Field.module.css';

export const Field = ({ children }) => {
  return (
    <div className={css.container}>
      <div className={css.content}>{children}</div>
    </div>
  );
};

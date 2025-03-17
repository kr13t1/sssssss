import css from './Background.module.css';

export const Background = ({ children }) => {
  return <div className={css.container}>{children}</div>;
};

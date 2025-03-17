import css from './Button.module.css';

export const Button = ({ children, status, size, ...props }) => {
  return (
    <div className={`${status ? css.active : css.noActive} ${css[size]}`} onClick={props.onClick}>
      {children}
    </div>
  );
};

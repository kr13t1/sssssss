import css from './Layout.module.css';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <div className={css.content}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;

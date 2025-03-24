import css from './Home.module.css';

import { Button } from '../../components/ui';

import { useNavigate } from 'react-router-dom';

const Home = () => {
  const nav = useNavigate();

  return (
    <main className={css.mainContent}>
      <div className={css.playButtons}>
        <Button onClick={() => nav('/settings')} status={true} size={'medium'}>
          Играть против компьютера
        </Button>
        <Button onClick={() => nav('/online')} status={true} size={'medium'}>
          Играть с другом
        </Button>
      </div>
    </main>
  );
};

export default Home;

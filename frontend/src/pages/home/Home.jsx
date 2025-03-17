import css from './Home.module.css';
import { Button } from '../../components/ui/button/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const nav = useNavigate();

  return (
    <div className={css.mainContainer}>
      <main className={css.mainContent}>
        <div className={css.playButtons}>
          <Button onClick={() => nav('/bots')} status={true} size={'medium'}>
            Играть против компьютера
          </Button>
          <Button status={false} size={'medium'}>
            Играть с другом
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;

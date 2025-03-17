import { useData } from '../../../store/game';
import { Background } from '../../components/ui/background/Background';
import css from './Play.module.css';

const Play = () => {
  const { data, setData } = useData();

  return (
    <div className={css.mainContainer}>
      <Background>
        {data.map((dt) => (
          <p>{dt.position}</p>
        ))}
      </Background>
    </div>
  );
};

export default Play;

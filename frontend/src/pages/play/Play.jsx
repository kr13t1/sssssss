import { useData } from '../../store/game';
import { Background } from '../../components/ui/background/Background';
import css from './Play.module.css';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const BotField = () => {
  const ships_length = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];  //длины кораблей для расставления потом их на поле
  let field = new Array(10); //поле, куда будут расставляться корабли
  for (let i = 0; i < field.length; i++) {
    field[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      field[i][j] = 0;
    }
  }
  for (let i = 0; i < ships_length.length; i++) {
    let flag = false; //флаг того, что корабль поставлен
    while (!flag) {
      let row = getRandomInt(10);
      let col = getRandomInt(10);
      let orientation = getRandomInt(2); //0 - горизонтально, 1 - вертикально
      let sum = 0; //переменная для расчета того, есть ли рядом с местом, куда хотим встать, другие корабли
      if (orientation == 0) {
        for (let j = col - 1; j < col + ships_length[i] + 1; j++) { //здесь цикл проверки соседних клеток и клеток, куда хочу поставить
          if (j >= 0 && j < 10) {
            sum += field[row][j];
            if (row - 1 >= 0) {
              sum += field[row - 1][j];
            }
            if (row + 1 < 10) {
              sum += field[row + 1][j];
            }
          }
          if (j != col + ships_length[i] && j > 9) {
            sum = 1;
            break;
          }
          if (sum > 0) {
            break;
          }
        }
      }
      else {
        for (let j = row - 1; j < row + ships_length[i] + 1; j++) { //здесь цикл проверки соседних клеток и клеток, куда хочу поставить
          if (j >= 0 && j < 10) {
            sum += field[j][col];
            if (col - 1 >= 0) {
              sum += field[j][col - 1];
            }
            if (col + 1 < 10) {
              sum += field[j][col + 1];
            }
          }
          if (j != row + ships_length[i] && j > 9) {
            sum = 1;
            break;
          }
          if (sum > 0) {
            break;
          }
        }
      }
      if (sum == 0) { //ставим корабль, если вокруг нет никого
        flag = true;
        if (orientation == 0) {
          for (let j = col; j < col + ships_length[i]; j++) {
            field[row][j] = ships_length[i];
          }
        }
        else {
          for (let j = row; j < row + ships_length[i]; j++) {
            field[j][col] = ships_length[i];
          }
        }
      }
    }
    console.log(field);
  };
  return (
    <Background>
      <div className={css.fieldContainer}>
        <div className={css.gameFieldContainer}>
          <div className={css.gameFielContent}>
              {field.map((col, colIndex) =>
                  col.map((cell, rowIndex) => (
                    <div key={rowIndex-colIndex}>
                      {cell > 0 ? '🚢' : null}
                    </div>
                  ))
                )}
          </div>
        </div>
      </div>
    </Background>
  );
};

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

export default BotField;

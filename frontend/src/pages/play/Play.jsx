import { useData } from '../../store/game';
import { Background } from '../../components/ui/background/Background';
import css from './Play.module.css';
import { Ship } from '../../components/ui/ship/Ship';
import { DropField } from '../../components/ui/dropField/dropField';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../components/ui/button/button';
import { useNavigate } from 'react-router-dom';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const BotField = () => {
  const nav = useNavigate();

  const [ships, SetShips] = useState([
    { id: 41, size: 4, position: [] },
    { id: 31, size: 3, position: [] },
    { id: 32, size: 3, position: [] },
    { id: 21, size: 2, position: [] },
    { id: 22, size: 2, position: [] },
    { id: 23, size: 2, position: [] },
    { id: 11, size: 1, position: [] },
    { id: 12, size: 1, position: [] },
    { id: 13, size: 1, position: [] },
    { id: 14, size: 1, position: [] },
  ]);
  const flatField = useMemo(() => {
    const ships_length = [41, 31, 32, 21, 22, 23, 11, 12, 13, 14]; //длины кораблей для расставления потом их на поле
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
          for (let j = col - 1; j < col + Math.floor(ships_length[i] / 10) + 1; j++) {
            //здесь цикл проверки соседних клеток и клеток, куда хочу поставить
            if (j >= 0 && j < 10) {
              sum += field[row][j];
              if (row - 1 >= 0) {
                sum += field[row - 1][j];
              }
              if (row + 1 < 10) {
                sum += field[row + 1][j];
              }
            }
            if (j != col + Math.floor(ships_length[i] / 10) && j > 9) {
              sum = 1;
              break;
            }
            if (sum > 0) {
              break;
            }
          }
        } else {
          for (let j = row - 1; j < row + Math.floor(ships_length[i] / 10) + 1; j++) {
            //здесь цикл проверки соседних клеток и клеток, куда хочу поставить
            if (j >= 0 && j < 10) {
              sum += field[j][col];
              if (col - 1 >= 0) {
                sum += field[j][col - 1];
              }
              if (col + 1 < 10) {
                sum += field[j][col + 1];
              }
            }
            if (j != row + Math.floor(ships_length[i] / 10) && j > 9) {
              sum = 1;
              break;
            }
            if (sum > 0) {
              break;
            }
          }
        }
        if (sum == 0) {
          //ставим корабль, если вокруг нет никого
          flag = true;
          if (orientation == 0) {
            for (let j = col; j < col + Math.floor(ships_length[i] / 10); j++) {
              field[row][j] = ships_length[i];
            }
          } else {
            for (let j = row; j < row + Math.floor(ships_length[i] / 10); j++) {
              field[j][col] = ships_length[i];
            }
          }
        }
      }
    }
    return field.flat();
  }, []);

  useEffect(() => {
    const n = ships.map((s) => {
      const pos = [];
      flatField.forEach((ss, i) => {
        if (ss === s.id) {
          pos.push(i + 1);
        }
      });
      return { ...s, position: pos };
    });
    SetShips(n);
  }, [flatField]);

  const { data } = useData();
  const [hit, setHit] = useState([]);

  // console.log(ships);

  const handleCellClick = (index) => {
    if (hit.includes(index)) {
      return;
    }

    const pos = [];
    if (flatField[index - 1] != 0) {
      for (let i = 0; i < ships.length; i++) {
        // console.log(ships[i].size);
        if (ships[i].id == flatField[index - 1]) {
          // console.log(ships[i].size);
          if (ships[i].size > 1) {
            SetShips((ship) => ship.map((s, ind) => (i === ind ? { ...s, size: s.size - 1 } : s)));
          } else {
            // const pos = [];
            for (let j = 0; j < ships[i].position.length; j++) {
              console.log(ships[i].position.length);
              const line = Math.floor((index - 1) / 10);
              const column = (index - 1) % 10;

              for (let k = -1; k < 2; k++) {
                for (let h = -1; h < 2; h++) {
                  const newLine = k + line;
                  const newColumn = h + column;
                  if (newLine < 0 || newLine >= 10 || newColumn < 0 || newColumn >= 10) {
                    continue;
                  }

                  // console.log(newLine * 10 + newColumn + 1);
                  pos.push(newLine * 10 + newColumn + 1);
                }
              }
              console.log(pos);
            }
            // setHit((hit) => [...hit, ...pos]);
            console.log(hit);
          }
        }
      }
    }
    setHit((hit) => [...hit, ...pos, index]);
  };

  return (
    <div className={css.mainContainer}>
      <Background>
        <h2 className={css.h2text}>Расстановка кораблей</h2>
        <div className={css.fieldContainer}>
          <div className={css.gameFieldContainer}>
            <div className={css.gameFielContent}>
              {Array.from({ length: 100 }, (_, index) => {
                const ship = data.find((s) => s.position.includes(index + 1));
                return (
                  <DropField key={index + 1} id={index + 1}>
                    {ship &&
                      ship.position.map((cell, i) =>
                        cell === index + 1 ? <Ship key={i} id={ship.id} size={ship.size} /> : null,
                      )}
                  </DropField>
                );
              })}
            </div>
          </div>
          <span className={css.TEMP_SPAN} />
          <div className={css.gameFieldContainer}>
            <div className={css.gameFielContent}>
              {flatField.map((id, index) => {
                const findHit = hit.includes(index + 1);
                return (
                  <div
                    key={index + 1}
                    className={
                      id > 0 && findHit
                        ? css.TEMP_KLETKA_EST
                        : findHit
                        ? css.TEMP_KLETKA_NET
                        : css.TEMP_KLETKA
                    }
                    onClick={() => handleCellClick(index + 1)}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={css.buttons}>
          <Button
            onClick={() => {
              nav('/');
            }}
            status={true}
            size={'medium'}
          >
            Выйти в меню
          </Button>
        </div>
      </Background>
    </div>
  );
};

// const Play = () => {
//   const { data, setData } = useData();
//   return (
//     <div className={css.mainContainer}>
//       <Background>
//         {data.map((dt) => (
//           <p>{dt.position}</p>
//         ))}
//       </Background>
//     </div>
//   );
// };

export default BotField;

import { useData } from '../../store/game';
import { Background } from '../../components/ui/background/Background';
import css from './Play.module.css';
import { Ship } from '../../components/ui/ship/Ship';
import { DropField } from '../../components/ui/dropField/dropField';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../components/ui/button/button';
import { generatePath, useNavigate } from 'react-router-dom';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

let start = getRandomInt(4);
let player = "human";

const fourdeckSteps = () => {
  let temp = start;
  poses = [];
  poses.push(temp);
  while (temp < 101) {
    if (temp + 4 > (Math.floor(temp / 10) + 1)*10) {
      temp += 5;
    }
    else if (temp + 4 == (Math.floor(temp / 10) + 1)*10) {
      temp += 1;
    }
    else {
      temp += 4;
    }
    poses.push(temp);
  }
  return poses;
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
  const pcFlatField = useMemo(() => {
    const ships_length = [41, 31, 32, 21, 22, 23, 11, 12, 13, 14]; //длины кораблей для расставления потом их на поле
    let computer_field = new Array(10); //поле, куда будут расставляться корабли
    for (let i = 0; i < computer_field.length; i++) {
      computer_field[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
        computer_field[i][j] = 0;
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
              sum += computer_field[row][j];
              if (row - 1 >= 0) {
                sum += computer_field[row - 1][j];
              }
              if (row + 1 < 10) {
                sum += computer_field[row + 1][j];
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
              sum += computer_field[j][col];
              if (col - 1 >= 0) {
                sum += computer_field[j][col - 1];
              }
              if (col + 1 < 10) {
                sum += computer_field[j][col + 1];
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
              computer_field[row][j] = ships_length[i];
            }
          } else {
            for (let j = row; j < row + Math.floor(ships_length[i] / 10); j++) {
              computer_field[j][col] = ships_length[i];
            }
          }
        }
      }
    }
    return computer_field.flat();
  }, []);

  useEffect(() => {
    const n = ships.map((s) => {
      const pos = [];
      pcFlatField.forEach((ss, i) => {
        if (ss === s.id) {
          pos.push(i + 1);
        }
      });
      return { ...s, position: pos };
    });
    SetShips(n);
  }, [pcFlatField]);

  const { data } = useData();
  const [hit, setHit] = useState([]);

  // console.log(ships);

  const handleCellClick = (index) => {
    if (player == 'human') {
      if (hit.includes(index)) {
        return;
      }

      const pos = [];
      if (pcFlatField[index - 1] != 0) {
        for (let i = 0; i < ships.length; i++) {
          // console.log(ships[i].size);
          if (ships[i].id == pcFlatField[index - 1]) {
            // console.log(ships[i].size);
            if (ships[i].size > 1) {
              SetShips((ship) => ship.map((s, ind) => (i === ind ? { ...s, size: s.size - 1 } : s)));
            } else {
              // const pos = [];
              for (let j = 0; j < ships[i].position.length; j++) {
                //console.log(ships[i].position.length);
                const line = Math.floor((ships[i].position[j] - 1) / 10);
                const column = (ships[i].position[j] - 1) % 10;

                for (let k = -1; k < 2; k++) {
                  for (let h = -1; h < 2; h++) {
                    const newLine = k + line;
                    const newColumn = h + column;
                    if (newLine < 0 || newLine >= 10 || newColumn < 0 || newColumn >= 10) {
                      continue;
                    }

                    //console.log(ships[i].position[j], newLine, newColumn);
                    pos.push(newLine * 10 + newColumn + 1);
                  }
                }
                //console.log(pos);
              }
              // setHit((hit) => [...hit, ...pos]);
              //console.log(hit);
            }
          }
        }
      }
      setHit((hit) => [...hit, ...pos, index]);
      player = "pc";
    }
  };

  let human_field = Array(100);
  for (let i = 0; i < 100; i++) {
    human_field[i] = 0;
  }
  console.log(data);
  data.forEach((num) => {
    num.position.forEach((pos) => {
      human_field[pos - 1] = num.id;
    })
  });
  console.log(human_field);
  
  const [pc_shoots, setShoot] = useState([])
  let not_killed = [];
  const BotStep = () => {
    if (player == 'pc') {
      let next_shoot;
      if (not_killed.length != 0) {
        if (not_killed.length == 1) {
          let variants = [-10, -1, 1, 10];
            next_shoot = variants[getRandomInt(4)];
            while (((not_killed[0] + next_shoot) < 0) || ((not_killed[0] + next_shoot) > 100) || (pc_shoots.includes(next_shoot))) {
              next_shoot = variants[getRandomInt(4)];
            }
        }
        else {
          (not_killed[not_killed.length-1]-not_killed[0]) == 1 ? next_shoot = [not_killed[0]-1, not_killed[not_killed.length-1]+1][getRandomInt(2)] : 
          next_shoot = [not_killed[0]-10, not_killed[not_killed.length-1]+10][getRandomInt(2)]; 
        }
      }
      else {
        if (human_field.find((numb) => numb == 41)) {
          next_shoot = fourdeckSteps[getRandomInt(fourdeckSteps.length)];
          while (pc_shoots.includes(next_shoot)) {
            next_shoot = fourdeckSteps[getRandomInt(fourdeckSteps.length)];
          }
        }
      }
      if (human_field[next_shoot] != 0) {
        not_killed.push(next_shoot);
        human_field[next_shoot] == -1;
        if (not_killed.length == Math.floor(human_field[next_shoot]) / 10) {
          while (not_killed.length != 0) {
            human_field[not_killed[not_killed.length - 1]] = -2;
            not_killed.pop();
          }
        }
      }
      setShoot((shoot) => [...pc_shoots, next_shoot]);
      console.log(pc_shoots);
      console.log(not_killed);
      player = "human";
    }
  };

  return (
    <div className={css.mainContainer}>
      <Background>
        <h2 className={css.h2text}>Бой</h2>
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
              {pcFlatField.map((id, index) => {
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
                    onClick={() => {handleCellClick(index + 1);
                      {human_field.map((id, index) => {
                        const findshoot = pc_shoots.includes(index + 1);
                        return (
                          <div
                            key={index + 1}
                            className={
                              id > 0 && findshoot
                                ? css.TEMP_KLETKA_EST
                                : findshoot
                                ? css.TEMP_KLETKA_NET
                                : css.TEMP_KLETKA
                            } BotStep ></div>)
                      })
                    }}                  }>
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

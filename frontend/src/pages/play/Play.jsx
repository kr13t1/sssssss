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

let start = getRandomInt(4) + 1;
let player = "human";

let fourdeckSteps = () => {
  let temp = start;
  let poses = [];
  poses.push(temp);
  while (temp < 95) {
    if (temp == (Math.floor(temp / 10) + 1) * 10) {
      temp += 1;
    } else if (temp + 4 > (Math.floor(temp / 10) + 1) * 10) {
      temp += 5;
    } else {
      temp += 4;
    }
    poses.push(temp);
  }
  return poses;
};


let tripledeckSteps = (taken_pos) => {
  let temp = start;
  let poses = [];
  while (temp < 95) {
    if (temp == (Math.floor(temp / 10) + 1) * 10) {
      temp += 1;
    } else if (temp + 4 > (Math.floor(temp / 10) + 1) * 10) {
      temp += 3;
    } else {
      temp += 2;
    }
    if (!taken_pos.includes(temp)) {
      poses.push(temp);
    }
  }
  return poses;
}

let restSteps = (taken_pos) => {
  let temp = start;
  let poses = [];
  while (temp < 99) {
    temp += 1;
    if (!taken_pos.includes(temp)) {
      poses.push(temp);
    }
  }
  return poses;
}


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
              SetShips((ship) =>
                ship.map((s, ind) => (i === ind ? { ...s, size: s.size - 1 } : s)),
              );
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
      else {
        player = "pc";
        console.log(player);
      }
      setHit((hit) => [...hit, ...pos, index]);
    }
  };

  // let human_field = Array(100);

  // const [human_field, setHumanField] = useState(() => Array(100).fill(0));

  // for (let i = 0; i < 100; i++) {
  //   setHumanField((f) => {
  //     const nf = [...f];
  //     nf[i] = 0;
  //     return nf;
  //   });
  // }
  // console.log(data);

  // const human_field = useMemo(() => {
  //   const f = Array(100).fill(0);
  //   data.forEach((num) => {
  //     num.position.forEach((pos) => {
  //       f[pos - 1] = num.id;
  //     });
  //   });
  //   return f;
  // }, [data]);

  const [human_field, setHumanField] = useState(() => {
    const f = Array(100).fill(0);
    data.forEach((num) => {
      num.position.forEach((pos) => {
        f[pos - 1] = num.id;
      });
    });
    return f;
  });

  // data.forEach((num) => {
  //   num.position.forEach((pos) => {
  //     setHumanField((f) => {
  //       const nf = [...f];
  //       nf[pos - 1] = num.id;
  //       return nf;
  //     });
  //     // human_field[pos - 1] = num.id;
  //   });
  // });
  console.log(human_field);

  let fourdeckPos = fourdeckSteps();
  let tripledeckPos;
  let flag_fourdeck = 1;


  const [pc_shoots, setShoot] = useState([]);
  const [not_killed, setKill] = useState([]);

  const BotStep = () => {
    if (player == 'pc') {
      console.log("Im pc");
      let next_shoot;
      console.log(not_killed);
      if (not_killed.length != 0) {
        console.log("I have to kill");
        if (not_killed.length == 1) {
          let variants = [];
          if ((not_killed[0] - 10) > 0 && (not_killed[0] - 10 < 100)) { variants.push(-10); }
          if ((not_killed[0] - 1) % 10 != 0 && ((not_killed[0] - 1 > 0) && (not_killed[0] - 1 < 100))) { variants.push(-1); }
          if ((not_killed[0] + 1) % 10 != 1 && ((not_killed[0] + 1 > 0) && (not_killed[0] + 1 < 100))) { variants.push(1); }
          if ((not_killed[0] + 10) < 100 && (not_killed[0] + 10 > 0)) { variants.push(10); }
          let ind = getRandomInt(variants.length);
          next_shoot = not_killed[0] + variants[ind];
          while (pc_shoots.includes(next_shoot)) {
            ind = (ind + 1) % variants.length;
            next_shoot = not_killed[0] + variants[ind];
          }
        } else {
          let mx_el = not_killed[not_killed.indexOf(Math.max(...not_killed))];
          let mn_el = not_killed[not_killed.indexOf(Math.min(...not_killed))]
          let ind = getRandomInt(2);
          mx_el - mn_el < 10
            ? (next_shoot = [mn_el - 1, mx_el + 1][ind])
            : (next_shoot = [mn_el - 10, mx_el + 10][ind]);
          if (pc_shoots.includes(next_shoot)) {
            ind = (ind + 1) % 2;
            mx_el - mn_el < 10
              ? (next_shoot = [mn_el - 1, mx_el + 1][ind])
              : (next_shoot = [mn_el - 10, mx_el + 10][ind]);
          }
          console.log(mn_el, mx_el, ind, next_shoot);
        }
      } else {
        console.log("I didnt hit anything");
        if (!human_field.find((numb) => numb == 41)) {
          if (flag_fourdeck == 1) {
            flag_fourdeck = 0;
            tripledeckPos = tripledeckSteps(pc_shoots);
          }
          if ((!human_field.find((numb) => numb == 31)) && (!human_field.find((numb) => numb == 32))) {
            if (flag_tripledeck == 1) {
              flag_tripledeck = 0;
              restPos = restSteps(pc_shoots);
            }
          }
        }


        if (human_field.find((numb) => numb == 41)) {
          console.log(fourdeckPos);
          let ind = getRandomInt(fourdeckPos.length);
          next_shoot = fourdeckPos[ind];
          while (pc_shoots.includes(next_shoot)) {
            ind = (ind + getRandomInt(fourdeckPos.length)) % fourdeckPos.length;
            next_shoot = fourdeckPos[ind];
          }
        }
        else if ((human_field.find((numb) => numb == 31)) || (human_field.find((numb) => numb == 32))) {
          let ind = getRandomInt(tripledeckPos.length);
          next_shoot = tripledeckPos[ind];
          while (pc_shoots.includes(next_shoot)) {
            ind = (ind + getRandomInt(tripledeckPos.length)) % tripledeckPos.length;
            next_shoot = tripledeckPos[ind];
          }
        }
        else {
          let ind = getRandomInt(restPos.length);
          next_shoot = restPos[ind];
          while (pc_shoots.includes(next_shoot)) {
            ind = (ind + getRandomInt(restPos.length)) % restPos.length;
            next_shoot = restPos[ind];
          }
        }
      }
      console.log(next_shoot);
      const pos = [];
      if (human_field[next_shoot - 1] != 0) {
        console.log("I hit");
        console.log('Размер до у not_killed')
        console.log(not_killed.length)
        setKill((kill) => [...kill, next_shoot]);
        console.log("not_killed", not_killed, next_shoot);
        console.log(`not_killed array ${not_killed}`)
        const f = [...not_killed, next_shoot];
        console.log(`f array ${f}`)
        // human_field[next_shoot] = -1;
        console.log('Размер после у f')
        console.log(f.length)
        console.log('Размер у not_killed')
        console.log(not_killed.length)
        if (f.length == Math.floor(human_field[next_shoot - 1] / 10)) {
          console.log("I clear array");
          console.log(`f array clear ${f}`)
          for (let i = 0; i < f.length; i++) {
            let line = Math.floor((f[i] - 1) / 10);
            let column = (f[i] - 1) % 10;
            console.log(`line ${line}, not_killed ${not_killed[i]}`);
            console.log(`column ${column}, f ${f[i]}`);
            setHumanField((ss) => {
              const s = [...ss];
              console.log(`f[f[i] - 1] f ${not_killed}`);
              s[f[i] - 1] = Math.floor((human_field[f[i] - 1]) / 10);
              console.warn(`f[f[i] -1] ${f[i] - 1}`)
              console.warn(`f[f[i] -1] human field ${human_field[f[i] - 1]}`)
              console.warn(`f[f[i] -1] math floor ${Math.floor((human_field[f[i] - 1]) / 10)}`)
              console.warn(`f[f[i] -1] ${s[f[i] - 1]}`)
              return s;
            });
            for (let k = -1; k < 2; k++) {
              for (let h = -1; h < 2; h++) {
                const newLine = k + line;
                const newColumn = h + column;
                console.log(not_killed, newLine, newColumn);
                if (newLine < 0 || newLine >= 10 || newColumn < 0 || newColumn >= 10) {
                  continue;
                }

                pos.push(newLine * 10 + newColumn + 1);
              }
            }
          }
          const line = Math.floor((next_shoot - 1) / 10);
          const column = (next_shoot - 1) % 10;
          for (let k = -1; k < 2; k++) {
            for (let h = -1; h < 2; h++) {
              const newLine = k + line;
              const newColumn = h + column;
              if (newLine < 0 || newLine >= 10 || newColumn < 0 || newColumn >= 10) {
                continue;
              }
              pos.push(newLine * 10 + newColumn + 1);
            }
          }
          setHumanField((s) => {
            const f = [...s];
            f[next_shoot - 1] = Math.floor((human_field[next_shoot - 1]) / 10);
            return f;
          });
          console.log(`позиция ${pos}`);
          setKill([]);
        }
      }
      else {
        player = "human";
      }
      console.log(pos);
      console.log(typeof next_shoot)
      setShoot((shoot) => [...shoot, ...pos, next_shoot]);
      console.log(`human ${human_field}`)
      console.log(pc_shoots);
      console.log(not_killed);
      console.log(player);
    }
  };

  console.log(pc_shoots);
  console.log(player);

  useEffect(() => { }, [player])

  return (
    <div className={css.mainContainer}>
      <Background>
        <h2 className={css.h2text}>Сейчас ходит: {player !== 'pc' ? "игрок" : "бот"}</h2>
        <div className={css.fieldContainer}>
          <div className={css.gameFieldContainer}>
            <div className={css.gameFielContent}>
              {/* {Array.from({ length: 100 }, (_, index) => {
                const ship = data.find((s) => s.position.includes(index + 1));
                return (
                  <DropField key={index + 1} id={index + 1}>
                    {ship &&
                      ship.position.map((cell, i) =>
                        cell === index + 1 ? <Ship key={i} id={ship.id} size={ship.size} /> : null,
                      )}
                  </DropField>
                );
              })} */}
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
                          : id > 0
                            ? css.SHIP
                            : css.TEMP_KLETKA
                    }
                  >
                  </div>
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
                    onClick={() => {
                      handleCellClick(index + 1);
                      BotStep();
                    }}
                  ></div>
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
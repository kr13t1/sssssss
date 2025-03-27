import css from './Play.module.css';

import { useData } from '../../store/game';
import { generateRandomNum, getNeighbors, getRandomPos } from '../../utils';
import { Background, Button, ResultModal } from '../../components/ui';
import { GameField } from '../../components';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDifficulty, useMarks, useTime } from '../../store';

let start = generateRandomNum(1, 4);
let player = 'human';

const strategyOne = (
  not_killed,
  pc_shoots,
  graycells,
  human_field,
  fourdeckPos,
  tripledeckPos,
  restPos,
  flag_fourdeck,
  flag_tripledeck,
) => {
  let next_shoot;
  if (not_killed.length != 0) {
    console.log('I have to kill');
    if (not_killed.length == 1) {
      let variants = [];
      if (not_killed[0] - 10 > 0 && not_killed[0] - 10 < 100) {
        variants.push(-10);
      }
      if ((not_killed[0] - 1) % 10 != 0 && not_killed[0] - 1 > 0 && not_killed[0] - 1 < 100) {
        variants.push(-1);
      }
      if ((not_killed[0] + 1) % 10 != 1 && not_killed[0] + 1 > 0 && not_killed[0] + 1 < 100) {
        variants.push(1);
      }
      if (not_killed[0] + 10 < 100 && not_killed[0] + 10 > 0) {
        variants.push(10);
      }
      let ind = generateRandomNum(0, variants.length - 1);
      next_shoot = not_killed[0] + variants[ind];
      while (pc_shoots.includes(next_shoot) || graycells.includes(next_shoot)) {
        ind = (ind + generateRandomNum(1, variants.length - 1)) % variants.length;
        next_shoot = not_killed[0] + variants[ind];
      }
    } else {
      let mx_el = not_killed[not_killed.indexOf(Math.max(...not_killed))];
      let mn_el = not_killed[not_killed.indexOf(Math.min(...not_killed))];
      let variants = [];
      if (mx_el - mn_el < 10) {
        if ((mn_el - 1) % 10 != 0 && mn_el - 1 > 0 && mn_el - 1 < 100) {
          variants.push(mn_el - 1);
        }
        if ((mx_el + 1) % 10 != 1 && mx_el + 1 > 0 && mx_el - 1 < 100) {
          variants.push(mx_el + 1);
        }
      } else {
        if (mn_el - 10 > 0 && mn_el - 10 < 100) {
          variants.push(mn_el - 10);
        }
        if (mx_el + 10 > 0 && mx_el + 10 < 100) {
          variants.push(mx_el + 10);
        }
      }
      console.log(not_killed, mx_el, mn_el, variants);
      let ind = generateRandomNum(0, variants.length - 1);
      next_shoot = variants[ind];
      if (pc_shoots.includes(next_shoot) || graycells.includes(next_shoot)) {
        ind = (ind + 1) % 2;
        next_shoot = variants[ind];
      }
      console.log(mn_el, mx_el, ind, next_shoot);
    }
  } else {
    console.log('I didnt hit anything');
    if (!human_field.find((numb) => numb == 41)) {
      if (flag_fourdeck == 1) {
        flag_fourdeck = 0;
        if (start < 3) {
          tripledeckPos = findShips(start, 2, 3, pc_shoots, graycells);
        } else if (start == 3) {
          tripledeckPos = findShips(1, 2, 3, pc_shoots, graycells);
        } else {
          tripledeckPos = findShips(2, 2, 3, pc_shoots, graycells);
        }
      }
      if (!human_field.find((numb) => numb == 31) && !human_field.find((numb) => numb == 32)) {
        if (flag_tripledeck == 1) {
          flag_tripledeck = 0;
          restPos = findShips(1, 1, 1, pc_shoots, graycells);
        }
      }
    }

    if (human_field.find((numb) => numb == 41)) {
      console.log(fourdeckPos);
      next_shoot = doStep(pc_shoots, graycells, fourdeckPos);
    } else if (human_field.find((numb) => numb == 31) || human_field.find((numb) => numb == 32)) {
      next_shoot = doStep(pc_shoots, graycells, tripledeckPos);
    } else {
      next_shoot = doStep(pc_shoots, graycells, restPos);
    }
  }
  return [next_shoot, flag_fourdeck, flag_tripledeck, fourdeckPos, tripledeckPos, restPos];
};

const findShips = (start, basic_step, step_for_next_row, taken_pos, neighbors) => {
  let temp = start;
  let poses = [start];
  while (temp <= 100 - basic_step) {
    if (temp == Math.floor(temp / 10) * 10) {
      temp += 1;
    } else if (temp + basic_step > (Math.floor(temp / 10) + 1) * 10) {
      temp += step_for_next_row;
    } else {
      temp += basic_step;
    }
    if (!taken_pos.includes(temp) && !neighbors.includes(temp)) {
      poses.push(temp);
    }
  }
  return poses;
};

const doStep = (taken_pos, neighbors, steps_arr) => {
  let ind = generateRandomNum(0, steps_arr.length - 1);
  let res = steps_arr[ind];
  while (taken_pos.includes(res) || neighbors.includes(res)) {
    ind = (ind + generateRandomNum(0, steps_arr.length - 1)) % steps_arr.length;
    res = steps_arr[ind];
  }
  return res;
};

const fillField = (data) => {
  const f = Array(100).fill(0);
  data.forEach((num) => {
    num.position.forEach((pos) => {
      f[pos - 1] = num.id;
    });
  });
  return f;
};

const Play = () => {
  const nav = useNavigate();
  const [result, setResult] = useState('');
  const [activeResult, setActiveResult] = useState(false);

  const { time } = useTime(); // время, которое выбрал игрок
  const { marks } = useMarks(); // флаг для показа соседних клеток, по умолчанию true
  const { diff } = useDifficulty(); // сложность бота

  const [countHuman, setCountHuman] = useState(0);
  const [countBot, setCountBot] = useState(0);
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

  useEffect(() => {
    SetShips(getRandomPos(ships));
  }, []);

  const pcFlatField = fillField(ships);

  console.log('ships', ships);
  console.log('pcflatfield', pcFlatField);

  const { data } = useData();
  const [hit, setHit] = useState([]);

  const handleCellClick = (index) => {
    if (player == 'human') {
      if (hit.includes(index)) {
        return;
      }

      const pos = [];
      if (pcFlatField[index - 1] != 0) {
        for (let i = 0; i < ships.length; i++) {
          if (ships[i].id == pcFlatField[index - 1]) {
            if (ships[i].size > 1) {
              SetShips((ship) =>
                ship.map((s, ind) => (i === ind ? { ...s, size: s.size - 1 } : s)),
              );
              setCountHuman((count) => count + 1);
            } else {
              if (marks) {
                for (let j = 0; j < ships[i].position.length; j++) {
                  let neighbors = getNeighbors(ships[i].position[j]);
                  neighbors.forEach((el) => pos.push(el));
                }
                setCountHuman((count) => count + 1);
              }
            }
          }
        }
      } else {
        player = 'pc';
      }
      setHit((hit) => [...hit, ...pos, index]);
    }
  };

  const [human_field, setHumanField] = useState([]);
  useEffect(() => {
    setHumanField(fillField(data));
  }, []);
  console.log('human field', human_field);

  const [pc_shoots, setShoot] = useState([]);
  const [graycells, setGrayCells] = useState([]);
  const [not_killed, setKill] = useState([]);

  let fourdeckPos = findShips(start, 4, 5, pc_shoots, graycells);
  let tripledeckPos;
  let restPos;
  let flag_fourdeck = 1;
  let flag_tripledeck = 1;

  const BotStep = () => {
    if (player == 'pc') {
      let next_shoot;
      console.log('Im pc');
      [next_shoot, flag_fourdeck, flag_tripledeck, fourdeckPos, tripledeckPos, restPos] = strategyOne(
        not_killed,
        pc_shoots,
        graycells,
        human_field,
        fourdeckPos,
        tripledeckPos,
        restPos,
        flag_fourdeck,
        flag_tripledeck,
      );
      console.log('not_killed', not_killed);
      console.log('flags', flag_fourdeck, flag_tripledeck);
      console.log('fourdeckpos', fourdeckPos);
      console.log('tripledeck', tripledeckPos);
      console.log('rest', restPos);
      console.log('graycells', graycells);
      console.log(next_shoot);
      const pos = [];
      if (human_field[next_shoot - 1] != 0) {
        console.log('I hit');
        setCountBot((count) => count + 1);
        setKill((kill) => [...kill, next_shoot]);
        const f = [...not_killed, next_shoot];
        if (f.length == Math.floor(human_field[next_shoot - 1] / 10)) {
          console.log('I clear array');
          for (let i = 0; i < f.length; i++) {
            setHumanField((ss) => {
              const s = [...ss];
              s[f[i] - 1] = Math.floor(human_field[f[i] - 1] / 10);
              return s;
            });
            let neighbors = getNeighbors(f[i]);
            neighbors.forEach((el) => pos.push(el));
          }
          let neighbors = getNeighbors(next_shoot);
          neighbors.forEach((el) => pos.push(el));

          setHumanField((s) => {
            const f = [...s];
            f[next_shoot - 1] = Math.floor(human_field[next_shoot - 1] / 10);
            return f;
          });
          console.log(`соседи ${pos}`);
          setKill([]);
        }
      } else {
        player = 'human';
      }
      if (marks) {
        setShoot((shoot) => [...shoot, ...pos, next_shoot]);
      } else {
        setShoot((shoot) => [...shoot, next_shoot]);
        setGrayCells((cell) => [...cell, ...pos]);
      }
    }
  };

  useEffect(() => {
    if (countBot === 20) {
      setResult('loss');
      setActiveResult(true);
    }
    if (countHuman === 20) {
      setResult('win');
      setActiveResult(true);
    }
  }, [countBot, countHuman]);

  return (
    <>
      <ResultModal status={activeResult} result={result} />
      <Background>
        <h2 className={css.h2text}>Сейчас ходит: {player !== 'pc' ? 'игрок' : 'противник'}</h2>
        <div className={css.fieldContainer}>
          <GameField data={human_field} hit={pc_shoots} whose={'player'} />
          <span className={css.TEMP_SPAN} />
          <GameField
            data={pcFlatField}
            hit={hit}
            whose={'enemy'}
            onCellClick={(index) => {
              handleCellClick(index);
              BotStep();
            }}
          />
        </div>
        <Button
          onClick={() => {
            nav('/');
          }}
          status={true}
          size={'medium'}
        >
          Выйти в меню
        </Button>
      </Background>
    </>
  );
};

export default Play;

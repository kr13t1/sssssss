import css from './Bots.module.css';
import { Button } from '../../components/ui/button/button';
import { useNavigate } from 'react-router-dom';
import { Ship } from '../../components/ui/ship/Ship';
import { DndContext } from '@dnd-kit/core';
import { Fragment, useState } from 'react';
import { DropField } from '../../components/ui/dropField/dropField';
// import { useData } from '../../store/game';
import { Background } from '../../components/ui/background/Background';
import { HintModal } from '../../components/ui/hintModal/HintModal';

// TODO: удалить, перенести в стор
const TEMP_DATA = [
  { id: 'ship1', size: 4, position: [] },
  { id: 'ship2', size: 4, position: [] },
  { id: 'ship3', size: 3, position: [] },
  { id: 'ship4', size: 3, position: [] },
  { id: 'ship5', size: 3, position: [] },
  { id: 'ship6', size: 2, position: [] },
  { id: 'ship7', size: 2, position: [] },
  { id: 'ship8', size: 2, position: [] },
  { id: 'ship9', size: 1, position: [] },
  { id: 'ship10', size: 1, position: [] },
  { id: 'ship11', size: 1, position: [] },
  { id: 'ship12', size: 1, position: [] },
];

// TODO: вынести
const generateRandomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// TODO: вынести
const fillPositions = (data) => {
  let newShips = data.map((ship) => ({ ...ship, position: [] }));

  const taken_pos = new Set();

  newShips = newShips.map((ship) => {
    let newPos;

    check: while (true) {
      let line = generateRandomNum(0, 9) * 10;
      let column = generateRandomNum(1, 10 - ship.size + 1);

      newPos = Array.from({ length: ship.size }, (_, i) => line + column + i);

      if (newPos.every((pos) => !taken_pos.has(pos))) {
        break check;
      }
    }

    newPos.forEach((pos) => taken_pos.add(pos));

    return { ...ship, position: newPos };
  });

  return newShips;
};

const Bots = () => {
  const nav = useNavigate();

  const [data, setData] = useState(TEMP_DATA);
  const [dragCurrShip, setDragCurrShip] = useState(null);
  const [activeHint, setActiveHint] = useState(false);

  const handleDragStart = ({ active }) => {
    const ship = data.find((s) => s.id === active.id);

    if (ship) {
      setDragCurrShip(ship);
    }
  };

  // TODO: переделать, т.к проблема с перетаскиванием
  const handleDragEnd = ({ active, over }) => {
    if (!over || !dragCurrShip) {
      return;
    }

    const startIndex = Number(over.id);

    const startLine = Math.floor((startIndex - 1) / 10) * 10 + 1;
    const endLine = startLine + 10 - 1;

    const newPosition =
      startIndex + dragCurrShip.size - 1 > endLine
        ? Array.from({ length: dragCurrShip.size }, (_, i) => endLine - dragCurrShip.size + 1 + i)
        : Array.from({ length: dragCurrShip.size }, (_, i) => startIndex + i);

    const taken_pos = new Set(data.flatMap((ship) => (ship.id !== active.id ? ship.position : [])));

    if (newPosition.some((pos) => taken_pos.has(pos))) {
      return;
    }

    setData((prevShips) =>
      prevShips.map((ship) => (ship.id === active.id ? { ...ship, position: newPosition } : ship)),
    );

    setDragCurrShip(null);
  };

  return (
    <>
      <HintModal
        status={activeHint}
        title={'Это подсказка'}
        desc={
          'Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. '
        }
        changeStatus={() => {
          setActiveHint(false);
        }}
      />
      <div className={css.mainContainer}>
        <div className={css.hintContent}>
          <Button status={true} size={'medium'} onClick={() => setActiveHint(true)}>
            ?
          </Button>
        </div>
        <Background>
          <h2 className={css.h2text}>Расстановка кораблей</h2>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={css.fieldContainer}>
              <div className={css.gameFieldContainer}>
                <div className={css.gameFielContent}>
                  {Array.from({ length: 100 }, (_, index) => {
                    const ship = data.find((s) => s.position.includes(index + 1));

                    return (
                      <DropField key={index + 1} id={index + 1}>
                        {ship &&
                          ship.position.map((cell, i) =>
                            cell === index + 1 ? (
                              <Ship key={i} id={ship.id} size={ship.size} />
                            ) : null,
                          )}
                      </DropField>
                    );
                  })}
                </div>
              </div>
              <div className={css.selectContainer}>
                <h3 className={css.h3text}>Перетащите корабли на игровое поле</h3>
                <div className={css.selectContent}>
                  {data.map((ship) =>
                    ship.position.length === 0 ? (
                      <Ship key={ship.id} id={ship.id} size={ship.size} />
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          </DndContext>
          <Button
            status={true}
            size={'small'}
            onClick={() => {
              setData(fillPositions(data));
            }}
          >
            Случайным образом
          </Button>
          <div className={css.buttons}>
            <Button status={true} size={'medium'} onClick={() => nav('/play')}>
              Играть
            </Button>
            <Button status={true} size={'medium'} onClick={() => nav('/')}>
              Выйти в меню
            </Button>
          </div>
        </Background>
      </div>
    </>
  );
};

export default Bots;

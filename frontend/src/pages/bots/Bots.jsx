import css from './Bots.module.css';
import { Button } from '../../components/ui/button/button';
import { useNavigate } from 'react-router-dom';
import { Ship } from '../../components/ui/ship/Ship';
import { DndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { DropField } from '../../components/ui/dropField/dropField';
import { useData } from '../../store/game';
import { Background } from '../../components/ui/background/Background';
import { HintModal } from '../../components/ui/hintModal/HintModal';

const generateRandomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getNeighbors = (cell) => {
  const line = Math.floor((cell - 1) / 10);
  const column = (cell - 1) % 10;

  const neighbors = [];

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newLine = i + line;
      const newColumn = j + column;

      if (newLine < 0 || newLine >= 10 || newColumn < 0 || newColumn >= 10) {
        continue;
      }

      neighbors.push(newLine * 10 + newColumn + 1);
    }
  }

  return neighbors;
};

const fillPositions = (data) => {
  let newShips = data.map((ship) => ({ ...ship, position: [] }));

  const taken_pos = new Set();

  newShips = newShips.map((ship) => {
    let newPos = [];

    check: while (true) {
      let line = generateRandomNum(0, 9) * 10;
      let column = generateRandomNum(1, 10 - ship.size + 1);

      newPos = Array.from({ length: ship.size }, (_, i) => line + column + i);

      const taken_zone = new Set([...taken_pos]);

      taken_pos.forEach((pos) => getNeighbors(pos).forEach((n) => taken_zone.add(n)));

      if (newPos.every((pos) => !taken_zone.has(pos))) {
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
  const { data, setData, updateShipPosition } = useData();
  const [dragCurrShip, setDragCurrShip] = useState(null);
  const [activeHint, setActiveHint] = useState(false);

  const [goPlay, setGoPlay] = useState(false);

  useEffect(() => {
    if (data.every((dt) => dt.position.length !== 0)) {
      setGoPlay(true);
    }
  }, [data]);

  const handleDragStart = ({ active }) => {
    const ship = data.find((s) => s.id === active.id);

    if (ship) {
      setDragCurrShip(ship);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || !dragCurrShip) {
      return;
    }

    console.log(over);
    // console.log(active);

    const startIndex = Number(over.id);

    const startLine = Math.floor((startIndex - 1) / 10) * 10 + 1;
    const endLine = startLine + 9;

    let newPosition = [];

    if (dragCurrShip.position.length > 0) {
      const tailIndex = startIndex;
      const headIndex = tailIndex - dragCurrShip.size + 1;

      if (headIndex < startLine) {
        return;
      }

      newPosition = Array.from({ length: dragCurrShip.size }, (_, i) => headIndex + i);
    } else {
      const headIndex = startIndex;

      if (headIndex + dragCurrShip.size - 1 > endLine) {
        return;
      }

      newPosition = Array.from({ length: dragCurrShip.size }, (_, i) => headIndex + i);
    }

    const taken_ships = data.filter((ship) => ship.id !== active.id);

    const taken = new Set();

    taken_ships.forEach((ship) => {
      ship.position.forEach((cell) => {
        getNeighbors(cell).forEach((n) => taken.add(n));
      });
    });

    if (newPosition.some((pos) => taken.has(pos))) {
      return;
    }

    updateShipPosition(active.id, newPosition);
    setDragCurrShip(null);
  };

  return (
    <>
      <HintModal
        status={activeHint}
        title={'Это подсказка'}
        desc={
          'Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки. Это описание данной подсказки.'
        }
        changeStatus={() => {
          setActiveHint(false);
        }}
      />
      <div className={css.mainContainer}>
        <div className={css.hintContent}>
          <Button
            status={true}
            size={'medium'}
            onClick={() => {
              setActiveHint(true);
            }}
          >
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
            <Button status={goPlay} size={'medium'} onClick={() => (goPlay ? nav('/play') : null)}>
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

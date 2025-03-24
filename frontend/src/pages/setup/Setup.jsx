import css from './Setup.module.css';

import { useData } from '../../store';
import { Background, Button, DropField, HintModal, Ship } from '../../components/ui';
import { getRandomPos, getNeighbors } from '../../utils';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SetupField } from '../../components/setupField/SetupField';

const Setup = () => {
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
            <SetupField data={data} />
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
            setData(getRandomPos(data));
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
    </>
  );
};

export default Setup;

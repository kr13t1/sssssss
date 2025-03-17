import css from './Ship.module.css';
import { useDraggable } from '@dnd-kit/core';

export const Ship = ({ id, size }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const DynamicStyle = {
    width: `${33 * size}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
  };

  return (
    <div
      ref={setNodeRef}
      className={css.mainStyle}
      style={DynamicStyle}
      {...listeners}
      {...attributes}
    />
  );
};

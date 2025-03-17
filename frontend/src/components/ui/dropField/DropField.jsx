import css from './DropField.module.css';
import { useDroppable } from '@dnd-kit/core';

export const DropField = ({ children, id }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={css.mainStyle}>
      {children}
    </div>
  );
};

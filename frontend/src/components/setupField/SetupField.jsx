import css from './SetupField.module.css';

import { DropField, Field, Ship } from '../ui';

export const SetupField = ({ data }) => {
  return (
    <Field>
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
    </Field>
  );
};

import css from './GameField.module.css';

import { CellField, Field } from '../ui';

export const GameField = ({ data, hit, whose, onCellClick }) => {
  return (
    <Field>
      {data.map((id, index) => {
        const findHit = hit.includes(index + 1);
        return (
          <CellField
            key={index + 1}
            find={findHit}
            value={id}
            whose={whose}
            onClick={() => onCellClick(index + 1)}
          />
        );
      })}
    </Field>
  );
};

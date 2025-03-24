import { generateRandomNum } from "./generateRandomNum";
import { getNeighbors } from "./getNeighbors";

export const getRandomPos = (data) => {
  let newShips = data.map((ship) => ({ ...ship, position: [] }));

  const taken_pos = new Set();

  newShips = newShips.map((ship) => {
    let newPos = [];
    let flag = false;
    while (!flag) {
      let line = generateRandomNum(0, 9);
      let column = generateRandomNum(0, 9);
      let orientation = generateRandomNum(0, 1);
      let err = 0;
      if ((column + ship.size) > 10 || (line + ship.size) > 10) {
        err = 1;
      }
      orientation == 0 ? newPos = Array.from({ length: ship.size }, (_, i) => 10* line + column + i + 1) : 
      newPos = Array.from({ length: ship.size }, (_, i) => 10 * line + column + 10 * i + 1);

      const taken_zone = new Set([...taken_pos]);

      taken_pos.forEach((pos) => getNeighbors(pos).forEach((n) => taken_zone.add(n)));

      if (newPos.every((pos) => !taken_zone.has(pos)) && err != 1) {
        flag = true;
      }
    }

    newPos.forEach((pos) => taken_pos.add(pos));

    return { ...ship, position: newPos };
  });
  return newShips;
};

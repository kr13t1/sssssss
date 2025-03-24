export const getNeighbors = (cell) => {
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
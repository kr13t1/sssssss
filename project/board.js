const board = document.getElementsByClassName('gameboard');
const startGameButton = document.getElementById('start-game');
const boardSize = 10;
let ships = [];

function createBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => placeShip(cell));
        board.appendChild(cell);
    }
}

function placeShip(cell) {
    if (!cell.classList.contains('ship')) {
        cell.classList.add('ship');
        ships.push(cell.dataset.index);
        console.log('Корабль размещен на клетке:', cell.dataset.index);
    } else {
        alert('Корабль уже размещен на этой клетке!');
    }
}

startGameButton.addEventListener('click', () => {
    alert('Игра началась!'); // Здесь можно добавить логику для начала игры
});

createBoard();

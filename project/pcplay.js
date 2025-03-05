;(function() {
	'use strict';
    const getElement = id => document.getElementById(id);
    let game_start = false;
    let all_ships_on_board = false;
    let compShot = false;

    //считаем координаты
    const getCoordinates = el => {
        const coords = el.getBoundingClientRect();
        return {
            left: coords.left + window.scrollX,
            right: coords.right + window.scrollX,
            top: coords.top + window.scrollY,
            bottom: coords.bottom + window.scrollY
        };
    };

    class Field {
        static FIELD_SIDE = 330; //px
        static SHIP_SIDE = 33; //px
        //[количество кораблей, количество палуб]
        static SHIP_DATA = {
            fourdeck: [1, 4],
            tripledeck: [2, 3],
            doubledeck: [3, 2],
            singledeck: [4, 1]
        };
    
        constructor(field) {
            this.field = field;
            this.squadron = {}; //данные по каждому созданному кораблю
            this.matrix = []; //координаты кораблей
            let { left, right, top, bottom } = getCoordinates(this.field); //координаты рамок игрового поля
            this.fieldLeft = left;
            this.fieldRight = right;
            this.fieldTop = top;
            this.fieldBottom = bottom;
        }
    }



    const shipsCollection = getElement('ships_collection');
    const initialShips = getElement('initial-ships');
    const buttonPlay = getElement('play');

    const humanfield = getElement('field_human');
    const human = new Field(humanfield);

    const computerfield = getElement('field_computer');
    let computer = {};
})();
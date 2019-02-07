/* ***** GAME OF LIFE ***** */
/*jslint browser:true */
/*jslint node: true */
var gridWidth, gridHeight, newArray, getComputedStyle, x, y, drawGame, countNeighbours, aliveColour, $, neighbours, tempboard, randomcell, populationDensity, randomQ, game, clearBoard, playRound, i, j, newCell, block, posx, posy, total, posAdj, board, length;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var cellsX = 200; // Use for both width and height to keep square
var cellSize = Math.floor(width / cellsX);
var move = 0;
var timer;

/********************* GAME FUNCTIONS *********************/
function randomQ() {
    "use strict";
    var populationDensity = 0.4;
    if (Math.random() < populationDensity) {
        return 1;
    }
    return 0;
}

function makeArray(width, height, arg) {
    "use strict";
    var x, y;
    newArray = [];
    for (x = 0; x < height; x += 1) {
        newArray.push([]);
        for (y = 0; y < width; y += 1) {
            if (arg === 'empty') {
                newArray[x].push(0);
            } else {
                newArray[x].push(randomQ());
            }
        }
    }
    return newArray;
}

function resetCount() {
    "use strict";
    move = 0;
    $("#count span").text(move);
}

function clearBoard() {
    "use strict";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGame(game) {
    "use strict";
    var x, y;
    // clear canvas and set colours
    clearBoard(game);
    ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent');

    // Fill in living cells
    for (x = 0; x < game.length; x += 1) {
        for (y = 0; y < game[x].length; y += 1) {
            if (game[x][y]) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function randomise() {
    "use strict";
    resetCount();
    game = makeArray(cellsX, cellsX, 'full');
    drawGame(game);
}

function playRound() {
    "use strict";
    var neighbours;
    tempboard = makeArray(cellsX, cellsX, 'empty');


  // Calculate next board
    for (x = 0; x < game.length; x += 1) {
        for (y = 0; y < game[x].length; y += 1) {
            neighbours = countNeighbours(x, y);

            if (game[x][y]) {
                if (neighbours === 2 || neighbours === 3) {
                    tempboard[x][y] = true;
                } else {
                    tempboard[x][y] = false;
                }
            } else {
                if (neighbours === 3) {
                    tempboard[x][y] = true;
                }
            }
        }
    }

    game = tempboard;
    move += 1;
    $("#count span").text(move);
    drawGame(game);
}

function countNeighbours(posx, posy) {
    "use strict";
    var x, y;
    neighbours = 0;

    for (x = posx - 1; x <= posx + 1; x += 1) {
        for (y = posy - 1; y <= posy + 1; y += 1) {
            if (x === posx && y === posy) {
                continue;  // Ignore centre cell to be checked
            }
            if (x < 0 || x >= game.length || y < 0 || y >= game[x].length) {
                continue;  // Ignore cells outside the matrix (edge of grid)
            }
            if (game[x][y]) {
                neighbours += 1;
            }
        }
    }
    return neighbours;
}

/********************* USER FUNCTIONS *********************/

// Start/Stop the game
$("#startstop").click(function () {
    "use strict";
    var drawRate = 50;
    if (timer === undefined) {
        timer = setInterval(playRound, drawRate);
        $(this).text("Stop");
    } else {
        clearInterval(timer);
        timer = undefined;
        $(this).text("Start");
    }
});

// Step through once
$("#step").click(function () {
    "use strict";
    if (timer === undefined) {
        playRound(game);
        $("#count span").text(move);
    }
});

// Change size of grid
function resizeGrid() {
    "use strict";
    cellSize = (width / cellsX);
    $("#size").text(cellsX);
    randomise();
}

$("#plussize").click(function () {
    "use strict";
    cellsX += 10;
    resizeGrid();
});

$("#lesssize").click(function () {
    "use strict";
    cellsX -= 10;
    resizeGrid();
});

// Resize the canvas to match the window
function resizeCanvasHeight() {
    "use strict";
    cellsX = ctx.canvas.width;
    ctx.canvas.height = cellsX;
    cellSize = Math.round(cellSize);
    randomise(game);
}

$(document).ready(function () {
    "use strict";
    resizeCanvasHeight();
    $(window).on("resize", function () {
        resizeCanvasHeight();
    });
});

// Empty the board
$("#clear").click(function () {
    "use strict";
    clearBoard();
});

// Generate new random board
$("#rand").click(function () {
    "use strict";
    randomise();
});

// Show/hide rules
function displayRules() {
    "use strict";
    var x = document.getElementById("rules");
    y = document.getElementById("rules-hidden");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "block";
    }
}


/********************* START GAME *********************/

var game = makeArray(cellsX, cellsX, 'full');

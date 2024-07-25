document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.querySelector('.status');
    const restartBtn = document.querySelector('.restart-btn');
    const scoresElement = document.querySelector('.scores');

    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let playerScore = 0;
    let computerScore = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (clickedCellEvent) => {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        updateCell(clickedCell, currentPlayer);

        if (checkWin(currentPlayer)) {
            handleGameEnd(false);
        } else if (checkDraw()) {
            handleGameEnd(true);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === 'O' && gameActive) {
                setTimeout(computerMove, 500); 
            }
        }
    };

    const updateCell = (cell, value) => {
        cell.textContent = value;
        cell.style.color = value === 'X' ? 'yellow' : 'red';
       
    };

    const computerMove = () => {
        let emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const cellIndex = emptyCells[randomIndex];
            gameState[cellIndex] = 'O';
            updateCell(cells[cellIndex], 'O');

            if (checkWin('O')) {
                handleGameEnd(false);
            } else if (checkDraw()) {
                handleGameEnd(true);
            } else {
                currentPlayer = 'X';
                status.textContent = `Player ${currentPlayer}'s turn`;
            }
        }
    };

    const checkWin = (player) => {
        return winningConditions.some((condition) => {
            return condition.every((index) => {
                return gameState[index] === player;
            });
        });
    };

    const checkDraw = () => {
        return gameState.every((cell) => {
            return cell !== '';
        });
    };

    const handleGameEnd = (draw) => {
        gameActive = false;
        if (draw) {
            status.textContent = "It's a draw!";
        } else {
            const winner = currentPlayer === 'X' ? 'Player X' : 'Computer';
            status.textContent = `${winner} wins!`;
            if (winner === 'Player X') {
                playerScore++;
            } else {
                computerScore++;
            }
            updateScores();
        }
    };

    const updateScores = () => {
        scoresElement.textContent = `Player: ${playerScore} - Computer: ${computerScore}`;
    };

    const handleRestartGame = () => {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.color = '#333';
        });
    };

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartBtn.addEventListener('click', handleRestartGame);
});


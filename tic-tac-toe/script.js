document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const board = document.querySelector('.board');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

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

    const checkWinner = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                status.textContent = `Player ${currentPlayer} wins!`;
                return;
            }
        }
        if (!gameBoard.includes('')) {
            gameActive = false;
            status.textContent = 'It\'s a tie!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
    };

    const handleClick = (e) => {
        const cell = e.target;
        const index = cell.id;
        if (gameBoard[index] || !gameActive) return;

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWinner();
    };

    const resetGame = () => {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = '');
        board.querySelectorAll('.win-line').forEach(line => line.remove()); // Remove any existing lines
    };

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame);
});

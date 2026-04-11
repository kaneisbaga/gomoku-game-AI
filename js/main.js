const statusEl = document.getElementById('status');
const canvasEl = document.getElementById('chessBoard');

function updateUI(winnerColor = null) {
    if (winnerColor) {
        statusEl.innerText = `🎉 ${winnerColor === 1 ? '黑棋' : '白棋'}獲勝！`;
        canvasEl.className = "";
        canvasEl.style.cursor = "default";
        return;
    }
    statusEl.innerText = `輪到${GameLogic.isBlackTurn ? '黑' : '白'}棋下子`;
    canvasEl.className = GameLogic.isBlackTurn ? 'cursor-black' : 'cursor-white';

    // 觸發 AI 檢查
    checkAI();
}

function checkAI() {
    if (GameLogic.isGameOver) return;
    
    const isBlack = GameLogic.isBlackTurn;
    const playerType = isBlack ? document.getElementById('blackPlayer').value : document.getElementById('whitePlayer').value;

    if (playerType === 'ai') {
        // 讀取各自顏色的難度等級
        const levelID = isBlack ? 'blackLevel' : 'whiteLevel';
        const level = parseInt(document.getElementById(levelID).value);
        
        const move = GameLogic.getBestMove(level);
        if (move) {
            // 切換成 AI 後 2 秒立刻落子
            setTimeout(() => {
                handleMove(move.i, move.j);
            }, 2000);
        }
    }
}

function handleMove(i, j) {
    if (!GameLogic.canPlace(i, j)) return;
    const isBlack = GameLogic.isBlackTurn;
    const result = GameLogic.place(i, j);
    Board.drawPiece(i, j, isBlack);
    updateUI(result.win ? result.color : null);
}

canvasEl.onclick = (e) => {
    if (GameLogic.isGameOver) return;
    const isBlack = GameLogic.isBlackTurn;
    const playerType = isBlack ? document.getElementById('blackPlayer').value : document.getElementById('whitePlayer').value;
    
    // 真人才有權點擊
    if (playerType === 'human') {
        const i = Math.round((e.offsetX - Board.padding) / Board.step);
        const j = Math.round((e.offsetY - Board.padding) / Board.step);
        handleMove(i, j);
    }
};

function initGame() {
    Board.init();
    GameLogic.init();
    updateUI();
}

document.getElementById('resetBtn').onclick = initGame;
initGame();
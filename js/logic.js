/**
 * GameLogic - 專業五子棋博弈引擎 (啟發式評估版)
 * 包含 L1~L5 等級分佈
 */
const GameLogic = {
    // --- 基礎設定 ---
    size: 15,
    board: [],
    isBlackTurn: true,
    isGameOver: false,

    // --- 權重常量表 (專業級) ---
    SCORE: {
        FIVE: 1000000,   // 連五 / 衝五 (絕殺)
        ALIVE_FOUR: 100000, // 活四 (必勝)
        DEAD_FOUR: 10000,   // 衝四 (需防範)
        ALIVE_THREE: 10000, // 活三 (進攻主力)
        DEAD_THREE: 1000,   // 衝三
        ALIVE_TWO: 1000,    // 活二
        DEAD_TWO: 100       // 衝二
    },

    /**
     * 初始化棋盤
     */
    init() {
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.isBlackTurn = true;
        this.isGameOver = false;
    },

    /**
     * 檢查座標是否可落子
     */
    canPlace(i, j) {
        return !this.isGameOver && i >= 0 && i < 15 && j >= 0 && j < 15 && this.board[i][j] === 0;
    },

    /**
     * 落子操作
     */
    place(i, j) {
        if (!this.canPlace(i, j)) return { color: null, win: false };
        const color = this.isBlackTurn ? 1 : 2;
        this.board[i][j] = color;
        const win = this.checkWin(i, j, color);
        if (win) this.isGameOver = true;
        else this.isBlackTurn = !this.isBlackTurn;
        return { color, win };
    },

    /**
     * 勝利判定
     */
    checkWin(i, j, color) {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (let [dx, dy] of directions) {
            let count = 1;
            for (let dir of [1, -1]) {
                let x = i + dx * dir, y = j + dy * dir;
                while (x >= 0 && x < 15 && y >= 0 && y < 15 && this.board[x][y] === color) {
                    count++; x += dx * dir; y += dy * dir;
                }
            }
            if (count >= 5) return true;
        }
        return false;
    },

    /**
     * 獲取當前等級的最佳落子
     * @param {number|string} level 等級 1~5
     */
    getBestMove(level) {
        const myColor = this.isBlackTurn ? 1 : 2;
        const opColor = this.isBlackTurn ? 2 : 1;
        const lv = parseInt(level);

        // 黑子開局首步固定天元，避免無效搜尋
        if (this.isBlackTurn && this.board.every(row => row.every(c => c === 0))) {
            return { i: 7, j: 7 };
        }

        const candidates = this.getInterestingMoves();
        if (candidates.length === 0) return { i: 7, j: 7 };

        let bestScore = -Infinity;
        let moves = [];

        for (let {i, j} of candidates) {
            const myS = this.evaluatePoint(i, j, myColor);
            const opS = this.evaluatePoint(i, j, opColor);
            
            let score = this.calculateStrategy(lv, myS, opS);

            if (score > bestScore) {
                bestScore = score;
                moves = [{ i, j }];
            } else if (score === bestScore) {
                moves.push({ i, j });
            }
        }
        return moves[Math.floor(Math.random() * moves.length)];
    },

    /**
     * 等級策略轉換器
     */
    calculateStrategy(lv, myS, opS) {
        switch(lv) {
            case 5: // 頂級 AI: 絕對防禦 + 強勢進攻
                if (myS >= this.SCORE.FIVE) return myS * 100;
                if (opS >= this.SCORE.FIVE) return opS * 80;
                if (myS >= this.SCORE.ALIVE_FOUR) return myS * 50;
                if (opS >= this.SCORE.ALIVE_FOUR) return opS * 40;
                return myS * 2.5 + opS; 
            case 4: // 進攻型
                return myS * 1.8 + opS;
            case 3: // 平衡型
                return myS + opS;
            case 2: // 新手型: 主要看自己，偶爾隨機
                return myS + opS * 0.1 + (Math.random() * 50);
            default: // 入門型: 隨機為主
                return Math.random() * 500 + myS * 0.1;
        }
    },

    /**
     * 單點分數評估 (啟發式)
     */
    evaluatePoint(i, j, color) {
        let score = 0;
        const opColor = color === 1 ? 2 : 1;
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

        for (let [dx, dy] of directions) {
            let count = 0, side1 = 0, side2 = 0;

            let x = i + dx, y = j + dy;
            while (x >= 0 && x < 15 && y >= 0 && y < 15 && this.board[x][y] === color) { count++; x += dx; y += dy; }
            if (x < 0 || x >= 15 || y < 0 || y >= 15 || this.board[x][y] === opColor) side1 = 1;

            x = i - dx; y = j - dy;
            while (x >= 0 && x < 15 && y >= 0 && y < 15 && this.board[x][y] === color) { count++; x -= dx; y -= dy; }
            if (x < 0 || x >= 15 || y < 0 || y >= 15 || this.board[x][y] === opColor) side2 = 1;

            if (count >= 4) score += this.SCORE.FIVE;
            else if (count === 3) {
                score += (side1 === 0 && side2 === 0) ? this.SCORE.ALIVE_FOUR : this.SCORE.DEAD_FOUR;
            } else if (count === 2) {
                score += (side1 === 0 && side2 === 0) ? this.SCORE.ALIVE_THREE : this.SCORE.DEAD_THREE;
            } else if (count === 1) {
                if (side1 === 0 && side2 === 0) score += this.SCORE.ALIVE_TWO;
            }
        }
        return score;
    },

    /**
     * 獲取感興趣的落子點 (鄰近區域)
     */
    getInterestingMoves() {
        const moves = [];
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.board[i][j] === 0) {
                    let has = false;
                    for (let dx = -2; dx <= 2 && !has; dx++) {
                        for (let dy = -2; dy <= 2 && !has; dy++) {
                            if (dx === 0 && dy === 0) continue;
                            let x = i + dx, y = j + dy;
                            if (x >= 0 && x < 15 && y >= 0 && y < 15 && this.board[x][y] !== 0) has = true;
                        }
                    }
                    if (has) moves.push({i, j});
                }
            }
        }
        return moves;
    }
};
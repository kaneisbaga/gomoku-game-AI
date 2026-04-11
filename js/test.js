const GameTest = {
    // 斷言測試結果
    assert(condition, message) {
        if (condition) {
            console.log(`✅ [PASS] ${message}`);
        } else {
            console.error(`❌ [FAIL] ${message}`);
        }
    },

    // 1. 測試初始化
    testInit() {
        GameLogic.init();
        this.assert(GameLogic.board.length === 15, "棋盤長度應為 15");
        this.assert(GameLogic.isBlackTurn === true, "初始應為黑棋回合");
        this.assert(GameLogic.isGameOver === false, "初始遊戲狀態應為未結束");
    },

    // 2. 測試落子邏輯
    testPlacement() {
        GameLogic.init();
        GameLogic.place(7, 7);
        this.assert(GameLogic.board[7][7] === 1, "座標 (7,7) 應紀錄為黑子");
        this.assert(GameLogic.isBlackTurn === false, "落子後應切換至白棋回合");
    },

    // 3. 測試勝負判定
    testWinHorizontal() {
        GameLogic.init();
        // 模擬連五
        for(let i=0; i<4; i++) {
            GameLogic.board[i][5] = 1;
        }
        GameLogic.isBlackTurn = true;
        const result = GameLogic.place(4, 5); 
        this.assert(result.win === true, "橫向五子連線應判定為勝利");
    },

    // 4. 執行基礎測試
    runAll() {
        console.log("%c--- 開始執行基礎測試 ---", "color: blue; font-weight: bold;");
        this.testInit();
        this.testPlacement();
        this.testWinHorizontal();
    },

    // 5. 模擬對戰統計 (修正了語法錯誤的部分)
    simulateGames(rounds = 100, blackLevel = 5, whiteLevel = 5) {
        console.log(`%c--- 開始模擬 ${rounds} 場 (黑L${blackLevel} vs 白L${whiteLevel}) ---`, "color: purple; font-weight: bold;");
        
        let stats = { blackWins: 0, whiteWins: 0, draws: 0, totalMoves: 0 };
        const startTime = performance.now();

        for (let r = 1; r <= rounds; r++) {
            GameLogic.init();
            let moveCount = 0;
            let isGameOver = false;

            while (!isGameOver && moveCount < 225) {
                const level = GameLogic.isBlackTurn ? blackLevel : whiteLevel;
                const move = GameLogic.getBestMove(level);
                if (move) {
                    const result = GameLogic.place(move.i, move.j);
                    moveCount++;
                    if (result.win) {
                        if (result.color === 1) stats.blackWins++;
                        else stats.whiteWins++;
                        isGameOver = true;
                    }
                } else {
                    isGameOver = true;
                }
            }
            if (moveCount === 225 && !isGameOver) stats.draws++;
            stats.totalMoves += moveCount;
        }

        const duration = ((performance.now() - startTime) / 1000).toFixed(2);

        // 這裡使用了 ES6 的計算屬性名 [key] 修正了你遇到的 SyntaxError
        const report = {
            "總場數": rounds,
            [`黑棋勝利(L${blackLevel})`]: stats.blackWins,
            [`白棋勝利(L${whiteLevel})`]: stats.whiteWins,
            "平手": stats.draws,
            "黑棋勝率": ((stats.blackWins / rounds) * 100).toFixed(1) + "%",
            "耗時(秒)": duration
        };

        console.table(report);
    }
};

// 確保腳本載入成功
console.log("✅ 測試模組 js/test.js 載入成功，輸入 GameTest.runAll() 或 GameTest.simulateGames(100, 1, 5) 進行測試。");
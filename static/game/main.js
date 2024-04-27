const EMPTY = 0;
const DARK = 1;
const LIGHT = 2;

const WINNER_DRAW = 0;
const WINNER_DARK = 1;
const WINNER_LIGHT = 2;

const boardElement = document.getElementById('board');
const nextDiscElement = document.getElementById('next-disc-message');
const warningMessageElement = document.getElementById('warning-message');
let _board = [];

const showBoard = async (turnCount, previousDisc) => {
  // 盤面を取得する
  const response = await fetch(`/api/games/latest/turns/${turnCount}`);
  const responseBody = await response.json();
  const board = responseBody.board;
  const nextDisc = responseBody.nextDisc;
  const winnerDisc = responseBody.winnerDisc;

  console.log(`nextDisc=${nextDisc}`);
  console.log(`previousDisc=${previousDisc}`);
  console.log(`winnerDisc=${winnerDisc}`);

  showWarningMessage(previousDisc, nextDisc, winnerDisc);

  showNextDiscMessage(nextDisc);

  // 盤面の子要素をすべて削除
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  board.forEach((line, y) => {
    line.forEach((square, x) => {
      const squareElement = document.createElement('div');
      squareElement.className = 'square';

      if (square !== EMPTY) {
        const stoneElement = document.createElement('div');
        const color = square === DARK ? 'dark' : 'light';
        stoneElement.className = `stone ${color}`;
        squareElement.appendChild(stoneElement);
      } else {
        // クリックしたマス目をターンに登録
        squareElement.addEventListener('click', async () => {
          const nextTurnCount = turnCount + 1;
          const registerTurnResponse = await registerTurn(
            nextTurnCount,
            nextDisc,
            x,
            y
          );
          if (registerTurnResponse.ok) {
            await showBoard(nextTurnCount, nextDisc); // 次のターンを表示
          }
        });
      }

      boardElement.appendChild(squareElement);
    });
  });
};

const discToString = (disc) => {
  return disc === DARK ? '黒' : '白';
};

// 次の石を表示
const showNextDiscMessage = (nextDisc) => {
  if (nextDisc) {
    nextDiscElement.innerText = `次の番は${discToString(nextDisc)}です`;
  } else {
    nextDiscElement.innerText = '';
  }
};

const warningMessage = (previousDisc, nextDisc, winnerDisc) => {
  if (nextDisc !== null) {
    if (previousDisc === nextDisc) {
      const skipped = nextDisc === DARK ? LIGHT : DARK;
      return `${discToString(skipped)}の番はスキップです`;
    } else {
      return null;
    }
  } else {
    if (winnerDisc === WINNER_DRAW) {
      return '引き分けです';
    } else {
      return `${discToString(winnerDisc)}の勝ちです`;
    }
  }
};

// 警告を表示
const showWarningMessage = (previousDisc, nextDisc, winnerDisc) => {
  const message = warningMessage(previousDisc, nextDisc, winnerDisc);

  warningMessageElement.innerText = message;

  if (message === null) {
    warningMessageElement.style.display = 'none';
  } else {
    warningMessageElement.style.display = 'block';
  }
};

// ゲームを登録
const registerGame = async () => {
  await fetch('/api/games', {
    method: 'POST',
  });
};

// ターンを登録
const registerTurn = async (turnCount, disc, x, y) => {
  const requestBody = {
    turnCount,
    move: {
      disc,
      x,
      y,
    },
  };

  return await fetch('/api/games/latest/turns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

const main = async () => {
  await registerGame();
  await showBoard(0);
};

main();

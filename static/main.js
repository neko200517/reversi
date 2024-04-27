const gamesTableBodyElement = document.getElementById('games-table-body');

const showGames = async () => {
  const response = await fetch('/api/games');
  const responseBody = await response.json();
  const games = responseBody.games;

  // 事前に全要素を削除
  while (gamesTableBodyElement.firstChild) {
    gamesTableBodyElement.removeChild(gamesTableBodyElement.firstChild);
  }

  games.forEach((game) => {
    const trElement = document.createElement('tr');

    const appnedTdElement = (innerText) => {
      const tdElement = document.createElement('td');
      tdElement.innerText = innerText;
      trElement.appendChild(tdElement);
    };

    appnedTdElement(game.darkMoveCount);
    appnedTdElement(game.lightMoveCount);
    appnedTdElement(getWinnerDiscColor(game.winnerDisc));
    appnedTdElement(game.startedAt);
    appnedTdElement(game.endAt);

    gamesTableBodyElement.appendChild(trElement);
  });
};

const getWinnerDiscColor = (winnerDisc) => {
  if (winnerDisc === 1) {
    return '黒';
  } else if (winnerDisc === 2) {
    return '白';
  } else {
    return '';
  }
};

const main = async () => {
  await showGames();
};

main();

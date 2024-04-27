import express from 'express';
import { StartNewGameUseCase } from '../application/useCase/StartNewGameUseCase';
import { GameMySQLRepository } from '../infrastructure/repsitory/game/gameMySQLRepository';
import { TurnMySQLRepository } from '../infrastructure/repsitory/turn/turnMySQLRepository';
import { FindLastGamesUseCase } from '../application/useCase/findLastGamesUseCase';
import { findLastGamesMySQLQueryService } from '../infrastructure/query/findLastGamesMySQLQueryService';

export const gameRouter = express.Router();

const startNewGameUseCase = new StartNewGameUseCase(
  new GameMySQLRepository(),
  new TurnMySQLRepository()
);

const findGamesQueryUseCase = new FindLastGamesUseCase(
  new findLastGamesMySQLQueryService()
);

interface GetGamesResponseBody {
  games: {
    id: number;
    darkMoveCount: number;
    lightMoveCount: number;
    winnerDisc: number;
    startedAt: Date;
    endAt: Date;
  }[];
}

// ゲームを保存する
gameRouter.post('/api/games', async (req, res) => {
  await startNewGameUseCase.run();

  res.status(201).end();
});

// ゲーム履歴を取得する
gameRouter.get(
  '/api/games',
  async (req, res: express.Response<GetGamesResponseBody>) => {
    const output = await findGamesQueryUseCase.run();

    const responseBodyGames = output.map((g) => {
      return {
        id: g.gameId,
        darkMoveCount: g.darkMoveCount,
        lightMoveCount: g.lightMoveCount,
        winnerDisc: g.winnerDisc,
        startedAt: g.startedAt,
        endAt: g.endAt,
      };
    });

    const responseBody = { games: responseBodyGames };

    res.json(responseBody);
  }
);

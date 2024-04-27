import express from 'express';
import { FindLatestGameTurnByTurnCountUseCase } from '../application/useCase/findLatestGameTurnByTurnCountUseCase';
import { RegisterTurnUseCase } from '../application/useCase/registerTurnUseCase';
import { Point } from '../domian/model/turn/point';
import { toDisc } from '../domian/model/turn/disc';
import { TurnMySQLRepository } from '../infrastructure/repsitory/turn/turnMySQLRepository';
import { GameMySQLRepository } from '../infrastructure/repsitory/game/gameMySQLRepository';
import { GameResultMySQLRepository } from '../infrastructure/repsitory/gameResult/gameResultMySQLRepository';

export const turnRouter = express.Router();

const findLatestGameTurnByTurnCountUseCase =
  new FindLatestGameTurnByTurnCountUseCase(
    new TurnMySQLRepository(),
    new GameMySQLRepository(),
    new GameResultMySQLRepository()
  );

const registerTurnUseCase = new RegisterTurnUseCase(
  new TurnMySQLRepository(),
  new GameMySQLRepository(),
  new GameResultMySQLRepository()
);

interface TurnGetResponseBody {
  turnCount: number;
  board: any[][];
  nextDisc: number | null;
  winnerDisc: number | null;
}

// ターンを取得
turnRouter.get(
  '/api/games/latest/turns/:turnCount',
  async (req, res: express.Response<TurnGetResponseBody>) => {
    const turnCount = parseInt(req.params.turnCount);

    const output = await findLatestGameTurnByTurnCountUseCase.run(turnCount);

    const responseBody: TurnGetResponseBody = {
      turnCount: output.turnCount,
      board: output.borad,
      nextDisc: output.nextDisc ?? null, // undefinedならnullを返す
      winnerDisc: output.winnerDisc ?? null, // undefinedならnullを返す
    };

    return res.json(responseBody);
  }
);

interface TurnPostRequestBody {
  turnCount: number;
  move: {
    disc: number;
    x: number;
    y: number;
  };
}

// ターンを保存
turnRouter.post(
  '/api/games/latest/turns',
  async (req: express.Request<{}, {}, TurnPostRequestBody>, res) => {
    const turnCount = req.body.turnCount;
    const disc = toDisc(req.body.move.disc);
    const point = new Point(req.body.move.x, req.body.move.y);

    await registerTurnUseCase.run(turnCount, disc, point);

    res.status(201).end();
  }
);

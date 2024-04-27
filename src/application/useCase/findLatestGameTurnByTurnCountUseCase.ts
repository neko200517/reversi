import { connectMySql } from '../../infrastructure/connection';
import { ApplicationError } from '../error/applicationError';
import { GameResult } from '../../domian/model/gameResult/gameResult';
import { TurnRepository } from '../../domian/model/turn/turnRepository';
import { GameRepository } from '../../domian/model/game/gameRepository';
import { GameResultRepository } from '../../domian/model/gameResult/gameResultRepository';

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | undefined,
    private _winnerDisc: number | undefined
  ) {}

  get turnCount() {
    return this._turnCount;
  }

  get borad() {
    return this._board;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

export class FindLatestGameTurnByTurnCountUseCase {
  constructor(
    private _turnRepository: TurnRepository,
    private _gameRepository: GameRepository,
    private _gameResultRepositry: GameResultRepository
  ) {}

  async run(turnCount: number): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectMySql();
    try {
      // 最新ゲームを取得
      const game = await this._gameRepository.findLatest(conn);
      if (!game) {
        throw new ApplicationError(
          'LatestGameNotFound',
          'Latest game not found'
        );
      }
      if (!game.id) {
        throw new Error('game.id not exist');
      }

      // 指定したターンを取得
      const turn = await this._turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        turnCount
      );

      // ゲーム結果の取得
      let gameResult: GameResult | undefined;
      if (turn.gameEnded()) {
        gameResult = await this._gameResultRepositry.findForGameId(
          conn,
          game.id
        );
      }

      // レスポンスを作成
      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        gameResult?.winnerDisc
      );
    } finally {
      await conn.end();
    }
  }
}

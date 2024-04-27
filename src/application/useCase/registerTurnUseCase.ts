import { connectMySql } from '../../infrastructure/connection';
import { Disc } from '../../domian/model/turn/disc';
import { Point } from '../../domian/model/turn/point';
import { ApplicationError } from '../error/applicationError';
import { GameResult } from '../../domian/model/gameResult/gameResult';
import { TurnRepository } from '../../domian/model/turn/turnRepository';
import { GameRepository } from '../../domian/model/game/gameRepository';
import { GameResultRepository } from '../../domian/model/gameResult/gameResultRepository';

export class RegisterTurnUseCase {
  constructor(
    private _turnRepository: TurnRepository,
    private _gameRepository: GameRepository,
    private _gameResultRepositry: GameResultRepository
  ) {}

  async run(turnCount: number, disc: Disc, point: Point) {
    const conn = await connectMySql();
    try {
      await conn.beginTransaction();

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

      // 1つ前のターンを取得する
      const previousTurnCount = turnCount - 1;
      const previousTurn = await this._turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        previousTurnCount
      );

      // 石を置く
      const newTurn = previousTurn.placeNext(disc, point);

      // 次のターンを保存
      await this._turnRepository.save(conn, newTurn);

      // 勝敗が決した場合、対戦結果を保存
      if (newTurn.gameEnded()) {
        const winnerDisc = newTurn.winnerDisc();
        const gameResult = new GameResult(game.id, winnerDisc, newTurn.endAt);
        await this._gameResultRepositry.save(conn, gameResult);
      }

      // コミット
      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}

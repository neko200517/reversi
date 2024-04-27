import { connectMySql } from '../../infrastructure/connection';
import { Game } from '../../domian/model/game/game';
import { firstTurn } from '../../domian/model/turn/turn';
import { GameRepository } from '../../domian/model/game/gameRepository';
import { TurnRepository } from '../../domian/model/turn/turnRepository';

export class StartNewGameUseCase {
  constructor(
    private _gameRepository: GameRepository,
    private _turnRepository: TurnRepository
  ) {}

  async run() {
    const now = new Date();
    const conn = await connectMySql();

    try {
      await conn.beginTransaction();

      // ゲームを保存
      const game = await this._gameRepository.save(
        conn,
        new Game(undefined, now)
      );
      if (!game.id) {
        throw new Error('game.id not exist');
      }

      // ゲームの最初のターンを登録
      const turn = firstTurn(game.id, now);
      await this._turnRepository.save(conn, turn);

      // コミット
      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}

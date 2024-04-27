import mysql from 'mysql2/promise';
import { GameGateway } from './gameGateway';
import { Game } from '../../../domian/model/game/game';
import { GameRepository } from '../../../domian/model/game/gameRepository';

const gameGateway = new GameGateway();

export class GameMySQLRepository implements GameRepository {
  // 最初のゲームを取得
  async findLatest(conn: mysql.Connection): Promise<Game | undefined> {
    const gameRecord = await gameGateway.findLatest(conn);

    if (!gameRecord) {
      return undefined;
    }

    return new Game(gameRecord.id, gameRecord.startedAt);
  }

  // ゲームを保存
  async save(conn: mysql.Connection, game: Game): Promise<Game> {
    const gameRecord = await gameGateway.insert(conn, game.startedAt);

    return new Game(gameRecord.id, gameRecord.startedAt);
  }
}

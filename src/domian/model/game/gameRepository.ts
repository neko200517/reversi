import mysql from 'mysql2/promise';
import { Game } from './game';

export interface GameRepository {
  // 最初のゲームを取得
  findLatest(conn: mysql.Connection): Promise<Game | undefined>;
  // ゲームを保存
  save(conn: mysql.Connection, game: Game): Promise<Game>;
}

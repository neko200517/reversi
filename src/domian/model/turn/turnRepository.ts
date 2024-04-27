import mysql from 'mysql2/promise';
import { Turn } from './turn';

export interface TurnRepository {
  // 指定したターンを取得
  findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number
  ): Promise<Turn>;

  // 次のターンを保存
  save(conn: mysql.Connection, turn: Turn): Promise<void>;
}

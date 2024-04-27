import mysql from 'mysql2/promise';
import { TurnGateway } from './turnGateway';
import { SquareGateway } from './squareGateway';
import { MoveGateway } from './moveGateway';
import { Turn } from '../../../domian/model/turn/turn';
import { toDisc } from '../../../domian/model/turn/disc';
import { Board } from '../../../domian/model/turn/board';
import { Move } from '../../../domian/model/turn/move';
import { Point } from '../../../domian/model/turn/point';
import { DomainError } from '../../../domian/error/domainError';
import { TurnRepository } from '../../../domian/model/turn/turnRepository';

const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

export class TurnMySQLRepository implements TurnRepository {
  // 指定したターンを取得
  async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number
  ): Promise<Turn> {
    const turnRecord = await turnGateway.findForGameIdAndTurnCount(
      conn,
      gameId,
      turnCount
    );
    if (!turnRecord) {
      throw new DomainError(
        'SpecifiedTurnNotFound',
        'Specified turn not found'
      );
    }

    // 盤面を取得
    const squareRecords = await squareGateway.findForTurnId(
      conn,
      turnRecord.id
    );

    // 盤面の値を 8 x 8 の2次元配列にマッピング
    const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
    squareRecords.forEach((s) => {
      board[s.y][s.x] = s.disc;
    });

    // 現在のMoveを取得
    const moveRecord = await moveGateway.findForTurnId(conn, turnRecord.id);
    let move: Move | undefined;
    if (moveRecord) {
      move = new Move(
        toDisc(moveRecord.disc),
        new Point(moveRecord.x, moveRecord.y)
      );
    }

    const nextDisc =
      turnRecord.nextDisc === null ? undefined : toDisc(turnRecord.nextDisc);

    return new Turn(
      gameId,
      turnCount,
      nextDisc,
      move,
      new Board(board),
      turnRecord.endAt
    );
  }

  // 次のターンを保存
  async save(conn: mysql.Connection, turn: Turn) {
    const turnRecord = await turnGateway.insert(
      conn,
      turn.gameId,
      turn.turnCount,
      turn.nextDisc,
      turn.endAt
    );

    // 盤面を保存
    await squareGateway.insertAll(conn, turnRecord.id, turn.board.discs);

    // moveの登録
    if (turn.move) {
      await moveGateway.insert(
        conn,
        turnRecord.id,
        turn.move.disc,
        turn.move.point.x,
        turn.move.point.y
      );
    }
  }
}

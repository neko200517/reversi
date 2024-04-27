import { DomainError } from '../../error/domainError';
import { WinnerDisc } from '../gameResult/winnerDisc';
import { Board, initialBoard } from './board';
import { Disc } from './disc';
import { Move } from './move';
import { Point } from './point';

export class Turn {
  constructor(
    private _gameId: number,
    private _turnCount: number,
    private _nextDisc: Disc | undefined,
    private _move: Move | undefined,
    private _board: Board,
    private _endAt: Date
  ) {}

  get gameId() {
    return this._gameId;
  }

  get turnCount() {
    return this._turnCount;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get move() {
    return this._move;
  }

  get board() {
    return this._board;
  }

  get endAt() {
    return this._endAt;
  }

  // 次の石を返す
  private decideNextDisc(board: Board, previousDisc: Disc): Disc | undefined {
    const existDarkValidMove = board.existValidMove(Disc.Dark);
    const existLightValidMove = board.existValidMove(Disc.Light);

    if (existDarkValidMove && existLightValidMove) {
      // 両方置ける場合は前の石と反対の石
      return previousDisc === Disc.Dark ? Disc.Light : Disc.Dark;
    } else if (!existDarkValidMove && !existLightValidMove) {
      // 両方置けない場合は次の石はない
      return undefined;
    } else if (existDarkValidMove) {
      // 黒が置ける場合は黒
      return Disc.Dark;
    } else {
      // 白が置ける場合は白
      return Disc.Light;
    }
  }

  // 次のターンの処理
  placeNext(disc: Disc, point: Point): Turn {
    // 次に打とうとしている石が、次の石ではない場合置くことはできない
    if (disc !== this._nextDisc) {
      throw new DomainError(
        'SelectedDiscIsNextDisc',
        'Selected disc is not next disc'
      );
    }

    const move = new Move(disc, point);
    const nextBoard = this._board.place(move);

    let nextDisc = this.decideNextDisc(nextBoard, disc);

    return new Turn(
      this._gameId,
      this._turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      new Date()
    );
  }

  // ゲームが終了した場合
  gameEnded(): boolean {
    return this.nextDisc === undefined;
  }

  // 勝者を返す
  winnerDisc(): WinnerDisc {
    const darkCount = this._board.count(Disc.Dark);
    const lightCount = this._board.count(Disc.Light);

    if (darkCount > lightCount) {
      return WinnerDisc.Dark;
    } else if (lightCount > darkCount) {
      return WinnerDisc.Light;
    } else {
      return WinnerDisc.Draw;
    }
  }
}

// ゲームの最初のターンを登録
export const firstTurn = (gameId: number, endAt: Date) => {
  return new Turn(gameId, 0, Disc.Dark, undefined, initialBoard, endAt);
};

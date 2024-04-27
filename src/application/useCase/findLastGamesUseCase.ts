import { connectMySql } from '../../infrastructure/connection';
import {
  FindLastGamesQueryModel,
  FindLastGamesQueryService,
} from '../query/findLastGamesQueryService';

const FIND_COUNT = 10;

export class FindLastGamesUseCase {
  constructor(private _findLastGamesMySQLService: FindLastGamesQueryService) {}

  async run(): Promise<FindLastGamesQueryModel[]> {
    const conn = await connectMySql();
    try {
      return await this._findLastGamesMySQLService.query(conn, FIND_COUNT);
    } finally {
      await conn.end();
    }
  }
}

import db from './db';

export function getAll<T>(sql: string, params: unknown[] = []): T[] {
  return db.prepare(sql).all(...params) as T[];
}

export function getOne<T>(sql: string, params: unknown[] = []): T | undefined {
  return db.prepare(sql).get(...params) as T | undefined;
}

export function execute(sql: string, params: unknown[] = []) {
  return db.prepare(sql).run(...params);
}

import Dexie, { Table } from 'dexie';
import { DayLog, Session } from './types';

export class FocusDatabase extends Dexie {
  days!: Table<DayLog>;
  sessions!: Table<Session>;

  constructor() {
    super('FocusTrackerDB');
  }
}

export const db = new FocusDatabase();

// Define schema outside of constructor to avoid TypeScript issues with 'this' context
db.version(1).stores({
  days: '++id, date',
  sessions: '++id, dayId, tag'
});
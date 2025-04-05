import { openDB, type IDBPDatabase } from 'idb'
import type { DBStructure } from './schema'

const DB_NAME = 'checklist-app-db'
const DB_VERSION = 1

export const initDB = async (): Promise<IDBPDatabase<DBStructure>> => {
  return openDB<DBStructure>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('checklist_masters')) {
        db.createObjectStore('checklist_masters', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('checklist_items')) {
        const store = db.createObjectStore('checklist_items', { keyPath: 'id' })
        store.createIndex('checklistMasterId', 'checklistMasterId')
      }
      if (!db.objectStoreNames.contains('checklists')) {
        db.createObjectStore('checklists', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('checklist_entries')) {
        const store = db.createObjectStore('checklist_entries', { keyPath: 'id' })
        store.createIndex('checklistId', 'checklistId')
      }
    }
  })
}

export const addChecklistMaster = async (master: DBStructure['checklist_masters']) => {
  const db = await initDB()
  await db.add('checklist_masters', master)
}

export const getChecklistMasters = async (): Promise<DBStructure['checklist_masters'][]> => {
  const db = await initDB()
  return await db.getAll('checklist_masters')
}

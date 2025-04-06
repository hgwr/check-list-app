export interface ChecklistMaster {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  usageCount: number
}

export interface ChecklistItem {
  id: string
  checklistMasterId: string
  index: number
  indentLevel: number
  content: string
}

export interface Checklist {
  id: string
  checklistMasterId: string
  title: string
  startedAt: number
  finishedAt: number | null
}

export interface ChecklistEntry {
  id: string
  checklistId: string
  originalItemId: string | null
  index: number
  indentLevel: number
  content: string
  checked: boolean
  checkedAt: number | null
}

export interface DBStructure {
  checklist_masters: ChecklistMaster
  checklist_items: ChecklistItem
  checklists: Checklist
  checklist_entries: ChecklistEntry
}

import type { ChecklistItem } from '@/db/schema'

export function parseMarkdownToItems(md: string): ChecklistItem[] {
  const lines = md.split('\n')
  const items: ChecklistItem[] = []
  let index = 0
  for (const line of lines) {
    // Skip empty lines and header lines
    if (line.trim() === '' || line.trim().startsWith('#')) continue
    const match = line.match(/^(\s*)- \[( |x)\] (.*)$/)
    if (match) {
      const indentSpaces = match[1]
      const indentLevel = Math.floor(indentSpaces.length / 2)
      const content = match[3]
      items.push({
        id: crypto.randomUUID(),
        checklistMasterId: '', // will be set later
        index: index,
        indentLevel,
        content,
      })
      index++
    }
  }
  return items
}

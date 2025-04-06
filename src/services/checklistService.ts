import { initDB } from '@/db/db'
import type { ChecklistMaster, Checklist } from '@/db/schema'
import type { Router } from 'vue-router'

export async function startUsingChecklist(master: ChecklistMaster, router: Router) {
  try {
    const db = await initDB()
    const checklistId = crypto.randomUUID()
    const now = Date.now()

    // 使用中チェックリスト（チェックリスト実行）の作成
    const newChecklist: Checklist = {
      id: checklistId,
      checklistMasterId: master.id,
      title: master.title,
      startedAt: now,
      finishedAt: null,
    }
    await db.put('checklists', newChecklist)

    // マスターのチェックリスト項目を取得し、並び替え
    const masterItems = await db.getAllFromIndex('checklist_items', 'checklistMasterId', master.id)
    const sortedItems = masterItems.slice().sort((a, b) => a.index - b.index)

    // 使用中チェックリストのエントリーとして各項目をコピー
    for (const item of sortedItems) {
      const entry = {
        id: crypto.randomUUID(),
        checklistId: checklistId,
        originalItemId: item.id,
        index: item.index,
        indentLevel: item.indentLevel,
        content: item.content,
        checked: false,
        checkedAt: null,
      }
      await db.add('checklist_entries', entry)
    }

    // 使用開始時に、テンプレートの使用回数（usageCount）をインクリメント
    master.usageCount = (master.usageCount || 0) + 1
    // Reactiveなオブジェクトをプレーンなオブジェクトに変換して保存
    await db.put('checklist_masters', JSON.parse(JSON.stringify(master)))

    // 使用中チェックリスト詳細画面に遷移
    router.push(`/actives/${checklistId}`)
  } catch (error) {
    console.error('使用開始処理でエラー:', error)
    throw error
  }
}

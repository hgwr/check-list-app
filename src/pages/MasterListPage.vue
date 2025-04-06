<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ChecklistMaster, Checklist, ChecklistEntry } from '@/db/schema'
import { getChecklistMasters, initDB } from '@/db/db'

const router = useRouter()
const masters = ref<ChecklistMaster[]>([])

onMounted(async () => {
  masters.value = await getChecklistMasters()
})

const createNewMaster = () => {
  router.push('/masters/new')
}

const goToImportExport = () => {
  router.push('/masters/import-export')
}

const startUsingChecklist = async (master: ChecklistMaster) => {
  try {
    const db = await initDB()
    const checklistId = crypto.randomUUID()
    const now = Date.now()

    // 1. 使用中チェックリスト（checklists）の作成
    const newChecklist: Checklist = {
      id: checklistId,
      checklistMasterId: master.id,
      title: master.title,
      startedAt: now,
      finishedAt: null,
    }
    await db.put('checklists', newChecklist)

    // 2. マスター項目（checklist_items）を取得し、並び替え
    const masterItems = await db.getAllFromIndex('checklist_items', 'checklistMasterId', master.id)
    const sortedItems = masterItems.sort((a, b) => a.index - b.index)

    // 3. 取得した項目を使用中項目（checklist_entries）として複製
    for (const item of sortedItems) {
      const entry: ChecklistEntry = {
        id: crypto.randomUUID(),
        checklistId: checklistId,
        originalItemId: item.id,
        index: item.index,
        indentLevel: item.indentLevel,
        content: item.content,
        checked: false,       // 初期状態は未チェック
        checkedAt: null,
      }
      await db.add('checklist_entries', entry)
    }

    master.usageCount = (master.usageCount || 0) + 1
    await db.put('checklist_masters', master)

    // 4. 使用中チェックリスト詳細画面に遷移（例: /actives/:id）
    router.push(`/actives/${checklistId}`)
  } catch (error) {
    console.error('使用開始処理でエラー:', error)
    alert('チェックリストの使用開始に失敗しました。')
  }
}
</script>

<template>
  <div>
    <h1>マスター一覧</h1>

    <div style="margin-bottom: 1rem;">
      <button @click="createNewMaster">＋ 新規作成</button>
      <button @click="goToImportExport">⬆⬇ インポート・エクスポート</button>
    </div>

    <ul v-if="masters.length">
      <li v-for="master in masters" :key="master.id" style="margin-bottom: 0.5rem;">
        <strong>{{ master.title }}</strong><br />
        <small>{{ new Date(master.updatedAt).toLocaleString() }}</small><br />
        <router-link :to="`/masters/${master.id}`">✏ 編集</router-link>
        |
        <button @click="startUsingChecklist(master)">▶ 使用を開始</button>
      </li>
    </ul>
    <p v-else>まだチェックリストマスターがありません。</p>
  </div>
</template>

<style scoped lang="scss">
button {
  margin-right: 0.5rem;
}
</style>

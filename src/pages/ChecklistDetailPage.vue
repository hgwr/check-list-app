<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { initDB } from '@/db/db'
import type { Checklist, ChecklistEntry } from '@/db/schema'

const route = useRoute()
const checklistId = route.params.id as string

const checklist = ref<Checklist | null>(null)
const entries = ref<ChecklistEntry[]>([])

onMounted(async () => {
  const db = await initDB()
  // チェックリスト（使用中）の取得
  checklist.value = await db.get('checklists', checklistId)
  // 対応するチェックリスト項目の取得と並び替え
  const fetchedEntries = await db.getAllFromIndex('checklist_entries', 'checklistId', checklistId)
  console.log(fetchedEntries)
  entries.value = fetchedEntries.sort((a, b) => a.index - b.index)
})

// チェックボックスのオン／オフで、項目の状態を更新
const toggleCheck = async (entry: ChecklistEntry) => {
  try {
    entry.checkedAt = entry.checked ? Date.now() : null
    const db = await initDB()
    await db.put('checklist_entries', JSON.parse(JSON.stringify(entry)))
  } catch (error) {
    console.error('チェック状態の更新でエラー:', error)
  }
}
</script>

<template>
  <div>
    <h1>チェックリスト詳細</h1>
    <div v-if="checklist">
      <h2>{{ checklist.title }}</h2>
      <p>開始: {{ new Date(checklist.startedAt).toLocaleString() }}</p>
      <ul>
        <li
          v-for="entry in entries"
          :key="entry.id"
          style="margin-bottom: 0.5rem;"
        >
          <label>
            <input
              type="checkbox"
              v-model="entry.checked"
              @change="toggleCheck(entry)"
            />
            {{ entry.content }}
          </label>
          <span v-if="entry.checkedAt">
            （チェック: {{ new Date(entry.checkedAt).toLocaleString() }}）
          </span>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>チェックリストが見つかりませんでした。</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
}
label {
  flex: 1;
}
input[type='checkbox'] {
  margin-right: 0.5rem;
}
</style>

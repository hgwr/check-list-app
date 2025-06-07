<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { initDB } from '@/db/db'
import type { Checklist, ChecklistEntry } from '@/db/schema'

const router = useRouter()
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

const markAsFinished = async () => {
  if (!checklist.value) return
  const db = await initDB()
  checklist.value.finishedAt = Date.now()
  await db.put('checklists', JSON.parse(JSON.stringify(checklist.value)))
  alert('チェックリストを使用済みにしました。')
  router.push('/finished')
}

</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">実行状況</h1>
    <div v-if="checklist" class="space-y-2">
      <h2 class="text-xl font-semibold">{{ checklist.title }}</h2>
      <p>開始: {{ new Date(checklist.startedAt).toLocaleString() }}</p>
      <ul class="space-y-2 list-none p-0">
        <li
          v-for="entry in entries"
          :key="entry.id"
          class="flex items-center"
        >
          <label class="flex-1 flex items-center gap-2">
            <input
              type="checkbox"
              v-model="entry.checked"
              @change="toggleCheck(entry)"
              class="mr-2"
            />
            {{ entry.content }}
          </label>
          <span v-if="entry.checkedAt" class="text-sm">
            （チェック: {{ new Date(entry.checkedAt).toLocaleString() }}）
          </span>
        </li>
      </ul>
      <button class="btn" @click="markAsFinished">使用済みにする</button>
    </div>
    <div v-else>
      <p>チェックリストが見つかりませんでした。</p>
    </div>
  </div>
</template>



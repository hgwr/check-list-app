<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initDB } from '@/db/db'
import type { Checklist } from '@/db/schema'

const router = useRouter()
const activeChecklists = ref<Checklist[]>([])

// 使用中チェックリストを IndexedDB から取得する関数
const fetchActiveChecklists = async () => {
  const db = await initDB()
  const allChecklists = await db.getAll('checklists')
  // finishedAt が null のものだけをフィルタ
  activeChecklists.value = allChecklists.filter((checklist) => checklist.finishedAt === null)
  // 開始日時で昇順にソート（必要に応じて降順に変更可能）
  activeChecklists.value.sort((a, b) => a.startedAt - b.startedAt)
}

onMounted(() => {
  fetchActiveChecklists()
})

// 更新ボタンでリストを再取得する処理
const refreshList = async () => {
  await fetchActiveChecklists()
}

const goToActiveDetail = (checklistId: string) => {
  router.push(`/actives/${checklistId}`)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">実行中</h1>
    <button class="btn" @click="refreshList">更新</button>
    <ul v-if="activeChecklists.length" class="space-y-2 list-none p-0">
      <li
        v-for="checklist in activeChecklists"
        :key="checklist.id"
        class="border p-4 rounded bg-white shadow"
      >
        <strong class="block">{{ checklist.title }}</strong>
        <small class="block">開始: {{ new Date(checklist.startedAt).toLocaleString() }}</small>
        <button class="btn mt-2" @click="goToActiveDetail(checklist.id)">実行状況</button>
      </li>
    </ul>
    <p v-else>現在、実行中のチェックリストはありません。</p>
  </div>
</template>



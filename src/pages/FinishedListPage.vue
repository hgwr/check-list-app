<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initDB } from '@/db/db'
import type { Checklist } from '@/db/schema'

const router = useRouter()
const finishedChecklists = ref<Checklist[]>([])

const fetchFinishedChecklists = async () => {
  const db = await initDB()
  const allChecklists = await db.getAll('checklists')
  // finishedAt が null でないもの（完了済み）をフィルタ
  finishedChecklists.value = allChecklists.filter(cl => cl.finishedAt !== null)
  // 完了日時の降順にソートする例
  finishedChecklists.value.sort((a, b) => (b.finishedAt || 0) - (a.finishedAt || 0))
}

onMounted(() => {
  fetchFinishedChecklists()
})

const reactivateChecklist = async (checklist: Checklist) => {
  const db = await initDB()
  checklist.finishedAt = null  // アクティブ状態に戻す
  await db.put('checklists', JSON.parse(JSON.stringify(checklist)))
  alert(`「${checklist.title}」を使用中に戻しました。`)
  await fetchFinishedChecklists()
}

const goToActiveDetail = (checklistId: string) => {
  router.push(`/actives/${checklistId}`)
}

</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">履歴</h1>
    <ul v-if="finishedChecklists.length" class="space-y-2 list-none p-0">
      <li v-for="cl in finishedChecklists" :key="cl.id" class="border p-4 rounded bg-white shadow">
        <strong class="block">{{ cl.title }}</strong>
        <small class="block">
          開始: {{ new Date(cl.startedAt).toLocaleString() }}<br />
          完了: {{ cl.finishedAt ? new Date(cl.finishedAt).toLocaleString() : '未完了' }}
        </small>
        <div class="mt-2 space-x-2">
          <button class="btn" @click="goToActiveDetail(cl.id)">実行状況</button>
          <button class="btn" @click="reactivateChecklist(cl)">使用中に戻す</button>
        </div>
      </li>
    </ul>
    <p v-else>現在、使用済みのチェックリストはありません。</p>
  </div>
</template>



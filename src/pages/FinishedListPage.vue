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
  <div>
    <h1>履歴</h1>
    <ul v-if="finishedChecklists.length">
      <li v-for="cl in finishedChecklists" :key="cl.id" style="margin-bottom: 0.5rem;">
        <strong>{{ cl.title }}</strong><br />
        <small>
          開始: {{ new Date(cl.startedAt).toLocaleString() }}<br />
          完了: {{ cl.finishedAt ? new Date(cl.finishedAt).toLocaleString() : '未完了' }}
        </small>
        <br />
        <button @click="goToActiveDetail(cl.id)">実行状況</button>
        <button @click="reactivateChecklist(cl)">使用中に戻す</button>
      </li>
    </ul>
    <p v-else>現在、使用済みのチェックリストはありません。</p>
  </div>
</template>

<style scoped lang="scss">
button {
  margin-right: 0.5rem;
}
</style>

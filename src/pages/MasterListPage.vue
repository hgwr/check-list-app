<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ChecklistMaster } from '@/db/schema'
import { getChecklistMasters } from '@/db/db'

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

const startUsingChecklist = (master: ChecklistMaster) => {
  alert(`「${master.title}」の使用開始機能は未実装です！`) // 後で処理追加
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

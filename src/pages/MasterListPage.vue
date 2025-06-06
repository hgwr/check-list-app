<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ChecklistMaster } from '@/db/schema'
import { getChecklistMasters } from '@/db/db'
import { startUsingChecklist } from '@/services/checklistService'

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

const goToEditMaster = (master: ChecklistMaster) => {
  router.push(`/masters/${master.id}`)
}

</script>

<template>
  <div>
    <h1>テンプレート</h1>

    <div style="margin-bottom: 1rem;">
      <button @click="createNewMaster">＋ 新規作成</button>
      <button @click="goToImportExport">⬆⬇ インポート・エクスポート</button>
    </div>

    <ul v-if="masters.length">
      <li v-for="master in masters" :key="master.id" style="margin-bottom: 0.5rem;">
        <strong>{{ master.title }}</strong><br />
        <small>{{ new Date(master.updatedAt).toLocaleString() }}</small><br />
        <button @click="goToEditMaster(master)" >✏ 編集</button>
        |
        <button @click="startUsingChecklist(master, router)">▶ 使用を開始</button>
      </li>
    </ul>
    <p v-else>まだテンプレートがありません。</p>
  </div>
</template>

<style scoped lang="scss">
button {
  margin-right: 0.5rem;
}
</style>

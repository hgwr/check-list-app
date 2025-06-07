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
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">テンプレート</h1>

    <div class="space-x-2">
      <button class="btn" @click="createNewMaster">＋ 新規作成</button>
      <button class="btn" @click="goToImportExport">⬆⬇ インポート・エクスポート</button>
    </div>

    <ul v-if="masters.length" class="space-y-2 list-none p-0">
      <li v-for="master in masters" :key="master.id" class="border p-4 rounded bg-white shadow">
        <strong class="block">{{ master.title }}</strong>
        <small class="block">{{ new Date(master.updatedAt).toLocaleString() }}</small>
        <div class="mt-2 space-x-2">
          <button class="btn" @click="goToEditMaster(master)">✏ 編集</button>
          <button class="btn" @click="startUsingChecklist(master, router)">▶ 使用を開始</button>
        </div>
      </li>
    </ul>
    <p v-else>まだテンプレートがありません。</p>
  </div>
</template>



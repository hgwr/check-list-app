<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initDB } from '@/db/db'
import type { Checklist, ChecklistMaster } from '@/db/schema'
import { startUsingChecklist } from '@/services/checklistService'

const router = useRouter()
const recentActives = ref<Checklist[]>([])
const frequentMasters = ref<ChecklistMaster[]>([])

const loadDashboardData = async () => {
  const db = await initDB()

  // アクティブなチェックリスト（finishedAt === null）のうち、
  // 開始日時が新しい順に並べて上位3件を取得
  const allChecklists = await db.getAll('checklists')
  recentActives.value = allChecklists
    .filter((cl: Checklist) => cl.finishedAt === null)
    .sort((a: Checklist, b: Checklist) => b.startedAt - a.startedAt)
    .slice(0, 3)

  // チェックリストマスターを使用回数（usageCount）で降順に並べ、
  // 上位3件を取得
  const allMasters = await db.getAll('checklist_masters')
  frequentMasters.value = allMasters.sort((a: ChecklistMaster, b: ChecklistMaster) => b.usageCount - a.usageCount).slice(0, 3)
}

const onStartUsingTemplate = (master: ChecklistMaster) => {
  startUsingChecklist(master, router)
}

onMounted(() => {
  loadDashboardData()
})

const goToActiveList = () => {
  router.push('/actives')
}

const goToMasterList = () => {
  router.push('/masters')
}

const goToActiveDetail = (checklistId: string) => {
  router.push(`/actives/${checklistId}`)
}

</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold mb-4">ダッシュボード</h1>

    <!-- 最近の使用中チェックリストセクション -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-2">最近の実行中チェックリスト</h2>
      <ul class="list-none p-0">
        <li
          v-for="active in recentActives"
          :key="active.id"
          class="mb-4"
        >
          <strong>{{ active.title }}</strong><br />
          <small>開始: {{ new Date(active.startedAt).toLocaleString() }}</small><br />
          <button class="mt-1 px-2 py-1 bg-blue-600 text-white rounded" @click="goToActiveDetail(active.id)">実行状況</button>
        </li>
      </ul>
      <button class="btn-primary mt-2" @click="goToActiveList">すべての実行中チェックリストを見る</button>
    </section>

    <!-- よく使うチェックリストマスターセクション -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-2">よく使うテンプレート</h2>
      <ul class="list-none p-0">
        <li
          v-for="master in frequentMasters"
          :key="master.id"
          class="mb-4"
        >
          <strong>{{ master.title }}</strong><br />
          <small>使用回数: {{ master.usageCount }}</small><br />
          <button class="mt-1 px-2 py-1 bg-blue-600 text-white rounded" @click="onStartUsingTemplate(master)">使用を開始</button>
        </li>
      </ul>
      <button class="btn-primary mt-2" @click="goToMasterList">すべてのテンプレートを見る</button>
    </section>
  </div>
</template>

<style scoped>
</style>

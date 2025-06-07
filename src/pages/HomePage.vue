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
    <h1 class="text-2xl font-bold">ダッシュボード</h1>

    <!-- 最近の使用中チェックリストセクション -->
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">最近の実行中チェックリスト</h2>
      <ul class="space-y-4 list-none p-0">
        <li
          v-for="active in recentActives"
          :key="active.id"
          class="border p-4 rounded bg-white shadow"
        >
          <strong class="block">{{ active.title }}</strong>
          <small class="block">開始: {{ new Date(active.startedAt).toLocaleString() }}</small>
          <button class="btn mt-2" @click="goToActiveDetail(active.id)">実行状況</button>
        </li>
      </ul>
      <button class="btn" @click="goToActiveList">すべての実行中チェックリストを見る</button>
    </section>

    <!-- よく使うチェックリストマスターセクション -->
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">よく使うテンプレート</h2>
      <ul class="space-y-4 list-none p-0">
        <li
          v-for="master in frequentMasters"
          :key="master.id"
          class="border p-4 rounded bg-white shadow"
        >
          <strong class="block">{{ master.title }}</strong>
          <small class="block">使用回数: {{ master.usageCount }}</small>
          <button class="btn mt-2" @click="onStartUsingTemplate(master)">使用を開始</button>
        </li>
      </ul>
      <button class="btn" @click="goToMasterList">すべてのテンプレートを見る</button>
    </section>
  </div>
</template>



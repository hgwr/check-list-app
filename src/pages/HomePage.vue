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
</script>

<template>
  <div>
    <h1>ダッシュボード</h1>

    <!-- 最近の使用中チェックリストセクション -->
    <section>
      <h2>最近の実行中チェックリスト</h2>
      <ul>
        <li
          v-for="active in recentActives"
          :key="active.id"
          style="margin-bottom: 1rem"
        >
          <strong>{{ active.title }}</strong
          ><br />
          <small>開始: {{ new Date(active.startedAt).toLocaleString() }}</small
          ><br />
          <router-link :to="`/actives/${active.id}`">実行状況</router-link>
        </li>
      </ul>
      <button @click="goToActiveList">すべての実行中チェックリストを見る</button>
    </section>

    <!-- よく使うチェックリストマスターセクション -->
    <section>
      <h2>よく使うテンプレート</h2>
      <ul>
        <li
          v-for="master in frequentMasters"
          :key="master.id"
          style="margin-bottom: 1rem"
        >
          <strong>{{ master.title }}</strong
          ><br />
          <small>使用回数: {{ master.usageCount }}</small
          ><br />
          <button @click="onStartUsingTemplate(master)">使用を開始</button>
        </li>
      </ul>
      <button @click="goToMasterList">すべてのテンプレートを見る</button>
    </section>
  </div>
</template>

<style scoped lang="scss">
section {
  margin-bottom: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
button {
  margin-top: 0.5rem;
}
</style>

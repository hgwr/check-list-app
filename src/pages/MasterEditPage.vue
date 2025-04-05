<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { initDB } from '@/db/db'
import type { ChecklistMaster, ChecklistItem } from '@/db/schema'
import ChecklistItemEditor from '@/features/checklistMaster/ChecklistItemEditor.vue'

const router = useRouter()
const route = useRoute()

const isEditing = ref(false)
const title = ref('')
const checklistItems = ref<ChecklistItem[]>([])

const id = route.params.id as string | undefined

onMounted(async () => {
  if (id) {
    isEditing.value = true
    const db = await initDB()
    const existing = await db.get('checklist_masters', id)
    if (existing) {
      title.value = existing.title
      const items = await db.getAllFromIndex('checklist_items', 'checklistMasterId', id)
      checklistItems.value = items.sort((a, b) => a.index - b.index)
    } else {
      alert('指定されたチェックリストマスターが見つかりませんでした。')
      router.push('/masters')
    }
  }
})

const saveMasterAndItems = async () => {
  const db = await initDB()
  const now = Date.now()
  const newId = id ?? crypto.randomUUID()

  const master: ChecklistMaster = {
    id: newId,
    title: title.value.trim(),
    createdAt: now,
    updatedAt: now,
  }

  await db.put('checklist_masters', master)

  if (id) {
    const existing = await db.getAllFromIndex('checklist_items', 'checklistMasterId', id)
    for (const old of existing) {
      await db.delete('checklist_items', old.id)
    }
  }
  for (let i = 0; i < checklistItems.value.length; i++) {
    await db.add('checklist_items', {
      ...checklistItems.value[i],
      checklistMasterId: newId,
      index: i,
    })
  }

  alert('保存しました！')
  router.push('/masters')
}
</script>

<template>
  <div>
    <h1>マスター{{ isEditing ? '編集' : '新規作成' }}</h1>

    <div>
      <label for="title-input">タイトル:</label><br />
      <input id="title-input" v-model="title" type="text" placeholder="チェックリストのタイトルを入力" />
    </div>

    <ChecklistItemEditor v-model="checklistItems" :master-id="id ?? 'temp'" />

    <div style="margin-top: 1rem;">
      <button @click="saveMasterAndItems">💾 保存</button>
      <router-link to="/masters">キャンセル</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 1rem;
}
button {
  margin-right: 1rem;
}
</style>

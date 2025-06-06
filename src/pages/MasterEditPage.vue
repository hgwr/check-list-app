<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { initDB } from '@/db/db'
import type { ChecklistMaster, ChecklistItem } from '@/db/schema'
import ChecklistItemEditor from '@/features/checklistMaster/ChecklistItemEditor.vue'

const router = useRouter()
const route = useRoute()

const isEditing = reactive({ value: false })

// 状態を1つの reactive オブジェクトにまとめる
const masterForm = reactive({
  title: '',
  checklistItems: [] as ChecklistItem[],
  createdAt: 0,
  usageCount: 0,
})

const id = route.params.id as string | undefined

onMounted(async () => {
  if (id) {
    isEditing.value = true
    const db = await initDB()
    const existing = await db.get('checklist_masters', id)
    if (existing) {
      masterForm.title = existing.title
      masterForm.createdAt = existing.createdAt
      masterForm.usageCount = existing.usageCount
      const items = await db.getAllFromIndex('checklist_items', 'checklistMasterId', id)
      // チェックリスト項目をインデックス順に並べる
      masterForm.checklistItems = items.sort((a, b) => a.index - b.index)
    } else {
      isEditing.value = false
      alert('指定されたテンプレートが見つかりませんでした。')
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
    title: masterForm.title.trim(),
    createdAt: isEditing.value ? masterForm.createdAt : now,
    updatedAt: now,
    usageCount: isEditing.value ? masterForm.usageCount : 0,
  }

  await db.put('checklist_masters', master)

  if (id) {
    const existing = await db.getAllFromIndex('checklist_items', 'checklistMasterId', id)
    for (const old of existing) {
      await db.delete('checklist_items', old.id)
    }
  }

  for (let i = 0; i < masterForm.checklistItems.length; i++) {
    await db.add('checklist_items', {
      ...masterForm.checklistItems[i],
      checklistMasterId: newId,
      index: i,
    })
  }

  alert('保存しました！')
  router.push('/masters')
}

const cancel = () => {
  router.push('/masters')
}

</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">テンプレート{{ isEditing.value ? '編集' : '新規作成' }}</h1>

    <div class="space-y-1">
      <label for="title-input">タイトル:</label>
      <input
        id="title-input"
        v-model="masterForm.title"
        type="text"
        placeholder="チェックリストのタイトルを入力"
        class="border rounded p-2 w-full max-w-md"
      />
    </div>

    <ChecklistItemEditor
      v-model="masterForm.checklistItems"
      :master-id="id ?? 'temp'"
    />

    <div class="mt-4 space-x-2">
      <button class="btn" @click="saveMasterAndItems">💾 保存</button>
      <button class="btn" @click="cancel">❌ キャンセル</button>
    </div>
  </div>
</template>



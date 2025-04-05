<!-- src/features/checklistMaster/ChecklistItemEditor.vue -->
<template>
  <div>
    <h2>チェック項目</h2>
    <button @click="addItem">＋ 項目追加</button>

    <ul style="margin-top: 1rem">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        style="margin-bottom: 0.5rem"
      >
        <input
          v-model="item.content"
          style="width: 60%"
        />
        <button @click="indentItem(index, -1)">◀</button>
        <button @click="indentItem(index, 1)">▶</button>
        <button @click="moveItem(index, -1)">↑</button>
        <button @click="moveItem(index, 1)">↓</button>
        <button @click="removeItem(index)">🗑</button>
        <span style="margin-left: 1rem">インデント: {{ item.indentLevel }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChecklistItem } from '@/db/schema'

interface Props {
  modelValue: ChecklistItem[]
  masterId: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const items = computed({
  get: () => props.modelValue,
  set: (newItems: ChecklistItem[]) => {
    emit('update:modelValue', newItems)
  }
})

const addItem = () => {
  items.value.push({
    id: crypto.randomUUID(),
    checklistMasterId: props.masterId,
    index: items.value.length,
    indentLevel: 0,
    content: ''
  })
}

const removeItem = (i: number) => {
  items.value.splice(i, 1)
}

const indentItem = (i: number, delta: number) => {
  items.value[i].indentLevel = Math.max(0, items.value[i].indentLevel + delta)
}

const moveItem = (i: number, delta: number) => {
  const j = i + delta
  if (j < 0 || j >= items.value.length) return
  const temp = items.value[i]
  items.value[i] = items.value[j]
  items.value[j] = temp
}
</script>

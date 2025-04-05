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
import { reactive, watch } from 'vue'
import type { ChecklistItem } from '@/db/schema'

interface Props {
  modelValue: ChecklistItem[]
  masterId: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const items = reactive([...props.modelValue])

watch(
  items,
  () => {
    updateParent()
  },
  { deep: true }
)

const updateParent = () => {
  emit('update:modelValue', [...items])
}

const addItem = () => {
  const newItem: ChecklistItem = {
    id: crypto.randomUUID(),
    checklistMasterId: props.masterId,
    index: items.length,
    indentLevel: 0,
    content: ''
  }
  items.push(newItem)
  updateParent()
}

const removeItem = (i: number) => {
  items.splice(i, 1)
  updateParent()
}

const indentItem = (i: number, delta: number) => {
  items[i].indentLevel = Math.max(0, items[i].indentLevel + delta)
  updateParent()
}

const moveItem = (i: number, delta: number) => {
  const j = i + delta
  if (j < 0 || j >= items.length) return
  const temp = items[i]
  items[i] = items[j]
  items[j] = temp
  updateParent()
}
</script>

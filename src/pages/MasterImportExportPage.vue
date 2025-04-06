<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initDB } from '@/db/db'
import type { ChecklistMaster, ChecklistItem } from '@/db/schema'

// For export section
const exportMasterId = ref<string>('')
const availableMasters = ref<ChecklistMaster[]>([])
const exportMarkdown = ref<string>('')

// Load available checklist masters from IndexedDB
const loadMasters = async () => {
  const db = await initDB()
  availableMasters.value = await db.getAll('checklist_masters')
}

// Convert a checklist master and its items into markdown text
const exportMasterToMarkdown = async (masterId: string) => {
  const db = await initDB()
  const master = await db.get('checklist_masters', masterId)
  if (!master) return
  // Get checklist items associated with the master
  const items: ChecklistItem[] = await db.getAllFromIndex('checklist_items', 'checklistMasterId', masterId)
  items.sort((a, b) => a.index - b.index)
  // Create markdown text: use header for title and list for items
  let md = `# ${master.title}\n\n`
  for (const item of items) {
    // Each indentLevel corresponds to 2 spaces
    const indent = ' '.repeat(item.indentLevel * 2)
    // Export as unchecked items regardless of current state
    md += `${indent}- [ ] ${item.content}\n`
  }
  exportMarkdown.value = md
}

// For import section
const importMarkdown = ref<string>('')
const importTitle = ref<string>('')

// Function to parse markdown text into checklist items
const parseMarkdownToItems = (md: string): ChecklistItem[] => {
  const lines = md.split('\n')
  const items: ChecklistItem[] = []
  let index = 0
  for (const line of lines) {
    // Skip empty lines and header lines
    if (line.trim() === '' || line.trim().startsWith('#')) continue
    // Regex: optional spaces, "- [ ]" or "- [x]" then a space and content
    const match = line.match(/^(\s*)- \[( |x)\] (.*)$/)
    if (match) {
      const indentSpaces = match[1]
      const indentLevel = Math.floor(indentSpaces.length / 2)
      const content = match[3]
      items.push({
        id: crypto.randomUUID(),
        checklistMasterId: '', // will be set later
        index: index,
        indentLevel,
        content,
      })
      index++
    }
  }
  return items
}

// Import a checklist master from markdown text
const importMaster = async () => {
  if (!importTitle.value || !importMarkdown.value) {
    alert('タイトルとマークダウンテキストを入力してください。')
    return
  }
  const db = await initDB()
  const newMasterId = crypto.randomUUID()
  const now = Date.now()
  const newMaster: ChecklistMaster = {
    id: newMasterId,
    title: importTitle.value,
    createdAt: now,
    updatedAt: now,
    usageCount: 0,
  }
  await db.put('checklist_masters', newMaster)
  const items = parseMarkdownToItems(importMarkdown.value)
  // Set checklistMasterId and proper index for each item
  for (let i = 0; i < items.length; i++) {
    items[i].checklistMasterId = newMasterId
    items[i].index = i
    await db.add('checklist_items', items[i])
  }
  alert('インポートが完了しました！')
  router.push('/masters')
}

const router = useRouter()

onMounted(() => {
  loadMasters()
})
</script>

<template>
  <div>
    <h1>インポート・エクスポート</h1>
    <hr />

    <!-- Export Section -->
    <section>
      <h2>エクスポート</h2>
      <div>
        <label for="export-select">テンプレートを選択:</label>
        <select
          id="export-select"
          v-model="exportMasterId"
          @change="exportMasterToMarkdown(exportMasterId)"
        >
          <option value="" disabled selected>選択してください</option>
          <option
            v-for="master in availableMasters"
            :key="master.id"
            :value="master.id"
          >
            {{ master.title }}
          </option>
        </select>
      </div>
      <div style="margin-top: 1rem;">
        <textarea
          v-model="exportMarkdown"
          rows="10"
          style="width: 100%;"
          readonly
        ></textarea>
      </div>
      <div>
        <button @click="navigator.clipboard.writeText(exportMarkdown)">クリップボードにコピー</button>
      </div>
    </section>

    <hr />

    <!-- Import Section -->
    <section>
      <h2>インポート</h2>
      <div>
        <label for="import-title">新規テンプレートのタイトル:</label><br />
        <input id="import-title" v-model="importTitle" type="text" placeholder="タイトルを入力" />
      </div>
      <div style="margin-top: 1rem;">
        <label for="import-markdown">マークダウン形式のテキスト:</label><br />
        <textarea
          id="import-markdown"
          v-model="importMarkdown"
          rows="10"
          style="width: 100%;"
        ></textarea>
      </div>
      <div style="margin-top: 1rem;">
        <button @click="importMaster">インポート</button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
section {
  margin-bottom: 2rem;
}
textarea {
  font-family: monospace;
}
</style>

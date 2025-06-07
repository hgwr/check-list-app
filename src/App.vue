<script setup lang="ts">

</script>

<template>
  <div class="container mx-auto min-h-screen flex flex-col">
    <header class="bg-gray-100 border-b p-4 text-center text-xl font-bold flex items-center justify-center gap-2">
      <img src="/checklist-icon.png" alt="☑️" class="w-6 h-6" />
      <span>チェックリスト</span>
    </header>
    <nav class="flex justify-center gap-4 py-2">
      <router-link class="text-blue-600 hover:underline" to="/">ホーム</router-link>
      <router-link class="text-blue-600 hover:underline" to="/masters">テンプレート</router-link>
      <router-link class="text-blue-600 hover:underline" to="/actives">実行中</router-link>
      <router-link class="text-blue-600 hover:underline" to="/finished">履歴</router-link>
    </nav>

    <main class="flex-1 p-4 overflow-y-auto">
      <router-view />
    </main>

    <footer class="text-center text-xs text-gray-500 border-t p-2">
      <small>© 2025 moreslowly.jp</small>
    </footer>
  </div>
</template>


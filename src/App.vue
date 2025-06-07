<script setup lang="ts">

</script>

<template>
  <div class="container mx-auto max-w-4xl p-4 flex flex-col min-h-screen">
    <header class="bg-gray-100 border-b p-4 text-center text-xl font-bold flex flex-col items-center gap-2">
      <p class="flex items-center gap-2">
        <img src="/checklist-icon.png" alt="☑️" class="w-6 h-6" />
        チェックリスト
      </p>
      <nav class="flex gap-4 justify-center">
        <router-link class="text-blue-500 hover:underline" to="/">ホーム</router-link>
        <router-link class="text-blue-500 hover:underline" to="/masters">テンプレート</router-link>
        <router-link class="text-blue-500 hover:underline" to="/actives">実行中</router-link>
        <router-link class="text-blue-500 hover:underline" to="/finished">履歴</router-link>
      </nav>
    </header>

    <main class="flex-1 p-4">
      <router-view />
    </main>

    <footer class="text-center p-2 bg-gray-50 border-t text-xs">
      <small>© 2025 moreslowly.jp</small>
    </footer>
  </div>
</template>



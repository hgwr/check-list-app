<script setup lang="ts">

</script>

<template>
  <div class="container">
    <header class="app-header">
      <p><img src="/checklist-icon.png" alt="☑️" class="app-icon"> チェックリスト</p>
      <nav class="navbar">
        <router-link to="/">ホーム</router-link>
        <router-link to="/masters">テンプレート</router-link>
        <router-link to="/actives">実行中</router-link>
        <router-link to="/finished">履歴</router-link>
      </nav>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <small>© 2025 moreslowly.jp</small>
    </footer>
  </div>
</template>

<style scoped>

.app-icon {
  width: 1.5rem;
  height: 1.5rem;
  vertical-align: middle;
}

.app-header {
  background-color: #f4f4f4;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.app-main {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.app-footer {
  text-align: center;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-top: 1px solid #ccc;
  font-size: 0.75rem;
}
</style>

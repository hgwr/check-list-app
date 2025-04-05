<script setup lang="ts">

</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📝 チェックリストアプリ</h1>
      <nav class="nav">
        <router-link to="/">ホーム</router-link>
        <router-link to="/masters">テンプレート</router-link>
        <router-link to="/actives">使用中</router-link>
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
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  background-color: #f4f4f4;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.nav {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
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

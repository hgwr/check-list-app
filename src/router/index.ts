import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import MasterListPage from '@/pages/MasterListPage.vue'
import MasterEditPage from '@/pages/MasterEditPage.vue'
import MasterImportExportPage from '@/pages/MasterImportExportPage.vue'
import ActiveListPage from '@/pages/ActiveListPage.vue'
import FinishedListPage from '@/pages/FinishedListPage.vue'
import ChecklistDetailPage from '@/pages/ChecklistDetailPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/masters',
    name: 'master-list',
    component: MasterListPage,
  },
  {
    path: '/masters/new',
    name: 'master-create',
    component: MasterEditPage,
  },
  {
    path: '/masters/:id',
    name: 'master-edit',
    component: MasterEditPage,
    props: true,
  },
  {
    path: '/masters/import-export',
    name: 'master-import-export',
    component: MasterImportExportPage,
  },
  {
    path: '/actives',
    name: 'active-list',
    component: ActiveListPage,
  },
  {
    path: '/actives/:id',
    name: 'active-detail',
    component: ChecklistDetailPage,
    props: true,
  },
  {
    path: '/finished',
    name: 'finished-list',
    component: FinishedListPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

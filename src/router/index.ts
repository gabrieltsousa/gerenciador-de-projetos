import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'project-list',
      component: () => import('@/project/pages/ProjectListPage.vue'),
    },
    {
      path: '/projetos/novo',
      name: 'project-create',
      component: () => import('@/project/pages/ProjectFormPage.vue'),
    },
    {
      path: '/projetos/:id/editar',
      name: 'project-edit',
      component: () => import('@/project/pages/ProjectFormPage.vue'),
      props: true,
    },
    {
      path: '/busca',
      name: 'search-results',
      component: () => import('@/project/pages/SearchResultsPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/project/pages/NotFoundPage.vue'),
    },
  ],
})

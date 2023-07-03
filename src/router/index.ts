import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue';
import Video from '../views/VideoView.vue';
import Login from '../views/LoginView.vue';
import VideoMaker from '../views/VideoMakerView.vue';
import Role from '../views/RoleView.vue';
import SnapShot from '../views/SnapShotView.vue';
import { useAuthStore } from '@/stores/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true } // 需要身份驗證

    },

    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    { path: '/video/:id', component: Video, meta: { requiresAuth: true } },
    { path: '/video', component: VideoMaker, meta: { requiresAuth: true } },
    { path: '/user', component: Role, meta: { requiresAuth: true } },
    { path: '/snapshots', component: SnapShot, meta: { requiresAuth: true } },
  ]
})

// 處理登入邏輯
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token && to.path !== '/login' && import.meta.env.VITE_APP_MODE !== 'dev') {
    // 如果路由需要身份驗證且使用者未登入，導向登入頁面
    next('/login');
  } else {
    // 否則正常進入
    next();
  }
});

export default router

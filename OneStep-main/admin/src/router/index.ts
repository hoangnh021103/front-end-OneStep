import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    MainRoutes,
    PublicRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/login1', '/register', '/error'];
  const auth = useAuthStore();

  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  // User not logged in and trying to access a restricted page
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath; // Save the intended page
    next('/login');
  } else if (auth.user && to.path === '/login') {
    // User logged in and trying to access the login page
    next('/dashboard/default');
  } else if (auth.user && to.path === '/') {
    // User logged in and accessing root path
    next('/dashboard/default');
  } else {
    // All other scenarios, either public page or authorized access
    next();
  }
});

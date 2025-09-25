const PublicRoutes = {
  path: '/',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Authentication',
      path: '/login',
      component: () => import('@/views/xac-thuc/LoginPage.vue')
    },
    {
      name: 'Login',
      path: '/login1',
      component: () => import('@/views/xac-thuc/auth/LoginPage.vue')
    },
    {
      name: 'Register',
      path: '/register',
      component: () => import('@/views/xac-thuc/auth/RegisterPage.vue')
    },
  ]
};

export default PublicRoutes;

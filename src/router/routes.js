
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {requiresAuth: true},
    children: [
      { path: '', component: () => import('pages/Index.vue'),meta: {requiresAuth: true}},
      { path: '/users', component: () => import('pages/Users.vue'),meta: {requiresAuth: true}},
      { path: '/courses', component: () => import('pages/Courses.vue'),meta: {requiresAuth: true}},
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/loginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageAuth.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

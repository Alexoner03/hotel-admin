
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {requiresAuth: true},
    children: [
      { path: '', component: () => import('pages/Index.vue'),meta: {requiresAuth: true}},
      { path: '/users', component: () => import('pages/Users.vue'),meta: {requiresAuth: true}},
      { path: '/clients-normals', component: () => import('pages/ClientsNormal.vue'),meta: {requiresAuth: true}},
      { path: '/clients-businness', component: () => import('pages/ClientsBusinness.vue'),meta: {requiresAuth: true}},
      { path: '/rooms-gest', component: () => import('pages/RoomGestion.vue'),meta: {requiresAuth: true}},
      { path: '/rooms-state', component: () => import('pages/RoomState.vue'),meta: {requiresAuth: true}},
      { path: '/rooms-reser', component: () => import('pages/RoomReser.vue'),meta: {requiresAuth: true}},
      { path: '/rooms-offer', component: () => import('pages/RoomOffer.vue'),meta: {requiresAuth: true}},
      { path: '/services', component: () => import('pages/Services.vue'),meta: {requiresAuth: true}},
      { path: '/comments', component: () => import('pages/Comments.vue'),meta: {requiresAuth: true}},
      { path: '/contacts', component: () => import('pages/Contacts.vue'),meta: {requiresAuth: true}},
      { path: '/reports', component: () => import('pages/Reports.vue'),meta: {requiresAuth: true}},
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


export default ({router}) => {
  router.beforeEach((to, from, next) => {
      if(!localStorage.getItem('loggedIn') && to.path !== '/login'){
        next('/login')
      }else if(localStorage.getItem('loggedIn') && to.path === '/login'){
        next('/')
      }else{
        next()
      }
  })
}

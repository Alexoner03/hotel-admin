
export default ({router}) => {
  router.beforeEach((to, from, next) => {
      if(localStorage.getItem('loggedIn') === 'false' && to.path !== '/login'){
        next('/login')
      }else{
        next()
      }
  })
}

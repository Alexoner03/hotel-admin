<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions,mapState } from "vuex";

export default {
  name: 'App',
  async created() {
    await this.checkAuth()
    if(!this.loggedIn){
      await this.$router.replace("/login")
    }
  },
  computed : {
    ...mapState('auth',['loggedIn'])
  },
  methods : {
    ...mapActions('auth', ['checkAuth'])
  }
}
</script>

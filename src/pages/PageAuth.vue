<template>
  <div class="q-pa-md flex flex-center bg-wall" style="height:92.4vh; overflow-y: hidden">
    <particles-bg color="#827560" num="2" type="fountain" :bg="true" />
    <div class="full-width flex justify-between items-center q-px-xl">
      <div style="width: 75%">
        <transition
          appear
          duration-500
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-carousel
            animated
            v-model="slide"
            navigation
            infinite
            :autoplay="autoplay"
            :arrows="false"
            :navigation="false"
            transition-prev="slide-right"
            transition-next="jump-right"
            class="bg-transparent"
          >
            <q-carousel-slide :name="1" class="text-white flex items-center">
              <p class="caruP">Pide tu torta Favorita</p>
            </q-carousel-slide>
            <q-carousel-slide :name="2" class="text-white flex items-center">
              <p class="caruP">Facil y Rapido</p>
            </q-carousel-slide>
            <q-carousel-slide :name="3" class="text-white flex items-center">
              <p class="caruP">Pide tu postre Favorito</p>
            </q-carousel-slide>
            <q-carousel-slide :name="4" class="text-white flex items-center">
              <p class="caruP">Conoce nuestro market</p>
            </q-carousel-slide>
          </q-carousel>
        </transition>
      </div>
      <form @submit.prevent="submitForm" style="width: 25%">
        <div class="bodyLogin q-pa-lg rounded-borders float-left">
          <p class="font-bold text-white">INICIO DE SESIÓN</p>
          <q-input input-class="text-white" label-color="white" v-model="formData.user" label="Ingrese Usuario"></q-input>
          <q-input input-class="text-white" label-color="white" class="q-mb-md" type="password" v-model="formData.password" label="Ingrese password"></q-input>
          <q-btn type="submit"  color="primary" class="float-right">Ingresar</q-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { ParticlesBg } from "particles-bg-vue";

export default {
  name: "PageAuth",
  components: {
    ParticlesBg
  },
  data() {
    return {
      formData: {user: 'admin', password: 'password'},
      slide: 1,
      autoplay: 5000
    }
  },
  methods:{
    ...mapActions('auth', ['loginUser']),
    async submitForm(){
      await this.loginUser(this.formData)

      if(this.loggedIn){
        await this.$router.replace("/")
      }else{
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Credenciales incorrectas'
        })
      }
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn'])
  }
}
</script>

<style scoped>
.bodyLogin{
  background: rgba(26, 25, 25, 0.5);
}
.caruP{
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
}
.inputStyle{
  font-size: 2rem;
}
.font-bold{
  font-weight: bold;
}
</style>

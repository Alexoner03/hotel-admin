<template>
  <div class="q-pa-md flex flex-center bg-wall" style="height:92.4vh; overflow-y: hidden">
    <particles-bg color="#004165" num="10" type="square" :bg="true"/>
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
            infinite
            :autoplay="autoplay"
            :arrows="false"
            :navigation="false"
            transition-prev="slide-right"
            transition-next="jump-right"
            class="bg-transparent"
          >
            <q-carousel-slide :name="1" class="text-white flex items-center">
              <p class="caruP">HOTEL</p>
            </q-carousel-slide>
            <q-carousel-slide :name="2" class="text-white flex items-center">
              <p class="caruP">ADMINISTRADOR</p>
            </q-carousel-slide>
            <q-carousel-slide :name="3" class="text-white flex items-center">
              <p class="caruP">LOS MEJORES SERVICIOS</p>
            </q-carousel-slide>
            <q-carousel-slide :name="4" class="text-white flex items-center">
              <p class="caruP">AQUÍ :)</p>
            </q-carousel-slide>
          </q-carousel>
        </transition>
      </div>
      <form @submit.prevent="submitForm" style="width: 25%">
        <div class="bodyLogin q-pa-lg rounded-borders float-left">
          <p class="font-bold text-white">INICIO DE SESIÓN</p>
          <q-input type="email" input-class="text-white" label-color="white" v-model="formData.user_name"
                   label="Ingrese Email"></q-input>
          <q-input input-class="text-white" label-color="white" class="q-mb-md" type="password"
                   v-model="formData.password" label="Ingrese password"></q-input>
          <q-btn type="submit" color="primary" class="float-right">Ingresar</q-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {ParticlesBg} from "particles-bg-vue";
import { QSpinnerCube } from 'quasar'

export default {
  name: "PageAuth",
  components: {
    ParticlesBg
  },
  data() {
    return {
      formData: {user_name: 'correo@correo.com', password: 'password'},
      slide: 1,
      autoplay: 5000
    }
  },
  methods: {
    ...mapActions('auth', ['loginUser']),
    async submitForm() {
      const dialog = this.$q.dialog({
        title: 'Iniciando Sesión',
        message: 'Espere por favor',
        progress: {
          spinner: QSpinnerCube,
          color: 'primary'
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      await this.loginUser(this.formData)

      if (this.loggedIn) {
        dialog.hide()
        await this.$router.replace("/")
      } else {
        dialog.hide()
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Credenciales incorrectas'
        })
      }
    },
  },
  computed: {
    ...mapState('auth', ['loggedIn'])
  }
}
</script>

<style scoped>
.bodyLogin {
  background: rgba(26, 25, 25, 0.5);
}

.caruP {
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
}

.inputStyle {
  font-size: 2rem;
}

.font-bold {
  font-weight: bold;
}
</style>

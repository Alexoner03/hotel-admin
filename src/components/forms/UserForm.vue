<template>
  <q-card style="min-width: 50vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">{{ edit ? 'Editar' : 'Registrar' }} Usuario</div>
      <q-space/>
      <q-btn icon="close" flat round dense @click="onClose"/>
    </q-card-section>

    <q-card-section>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md flex flex-wrap justify-around"
      >
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.nombres" label="Nombres"
                 :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.apellidos" label="Apellidos"
                 :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.password" label="Contraseña"
                 :rules="passValidate"
                 type="password" :type="isPwd ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.email" label="Email" type="email"
                 :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-select class="w-input"
                  :rules="[val => !!val || 'Este campo es requerido']"
                  map-options
                  standout="bg-primary text-white"
                  option-value="id"
                  option-label="descripcion"
                  v-model="user.role_id"
                  emit-value
                  :options="this.roles"
                  :disable="edit"
                  label="Rol"
        />
        <div class="full-width flex justify-end">
          <q-btn label="Generar Password" color="primary" flat class="q-mr-sm" @click="passwordRandom"/>
          <q-btn label="Limpiar" type="reset" color="negative" flat class="q-mr-sm"/>
          <q-btn :label="edit ? 'Editar' : 'Registrar'" type="submit" color="primary"/>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>

import links from '../../constantes/url'
import {mapState} from 'vuex'

export default {
  name: "UserForm",
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    userToEdit: Object,
    idUser : Number
  },
  async created() {
    if (this.edit) {
      this.user = this.userToEdit
    }
    const {url, headers} = links.roles
    const response = await this.$axios.get(url, {
      headers: {
        ...headers,
        'Authorization': `Bearer ${this.token}`
      }
    })

    if (response.status === 200) {
      const {data} = response
      this.roles = data.filter(rol => rol.descripcion !== 'ADMINISTRADOR')
    }

  },
  beforeMount() {
    let validate = []
    if(!this.edit){
      validate.push(val => !!val || 'Este campo es requerido')
      validate.push(val => val?.length >= 8 || 'Contraseña minima de 8 caracteres')
    }else{
      validate.push(val => (!val || (val?.length >= 8 || val?.length === 0))||'Contraseña minima de 8 caracteres')
    }
    this.passValidate = validate
  },
  data() {
    return {
      user: {
        email: null,
        password: null,
        nombres: null,
        apellidos: null,
        role_id: null,
      },
      roles: [],
      isPwd: true,
      passValidate : []
    }
  },
  methods: {
    async onSubmit() {
      this.edit ? await this.editUser() : await this.createUser()
    },
    async createUser(){
      try {
        const {descripcion} = this.roles.find(rol => rol.id === this.user.role_id)
        const {url, headers} = links.createUserUrl(descripcion.toLowerCase(),this.token)
        const config = {headers}

        const {status, data} = await this.$axios.post(url, this.user, config)

        if (status === 200 && data.res) {
          this.$emit('onReload',this.user.role_id)
          this.user = {
            email: null,
            password: null,
            nombres: null,
            apellidos: null,
            role_id: null,
          }
          this.$q.notify({
            message: data.message,
            color: 'positive'
          })
        } else {
          throw new Error('error en petición')
        }
        this.$emit('onClose')
      }
      catch (error) {
        this.$q.notify({
          message: 'Error enviando usuario',
          color: 'negative'
        })
      }
    },
    async editUser(){
      try {
        const {url, headers} = links.editUserUrl(this.idUser,this.token)
        const config = {headers}
        const {status, data} = await this.$axios.patch(url, this.user, config)

        if (status === 200 && data.res) {
          this.$emit('onReload',this.user.role_id)
          this.user = {
            email: null,
            password: null,
            nombres: null,
            apellidos: null,
            role_id: null,
          }
          this.$q.notify({
            message: data.message,
            color: 'positive'
          })
        } else {
          throw new Error('error en petición')
        }
        this.$emit('onClose')
      }
      catch (error) {
        this.$q.notify({
          message: 'Error enviando usuario',
          color: 'negative'
        })
      }
    },
    onReset() {
      this.user = {
        email: null,
        password: null,
        nombres: null,
        apellidos: null,
        role_id: null,
      }
    },
    onClose() {
      this.$emit('onClose')
    },
    passwordRandom(){
      this.user.password = this.makeid(8)
      this.isPwd = false
    },
    makeid(length) {
      let result           = '';
      let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  },
  computed: {
    ...mapState('auth', ['token'])
  }
}
</script>

<style scoped>
.w-input {
  width: 45%
}
</style>

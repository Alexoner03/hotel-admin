<template>
  <q-card style="min-width: 50vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">{{edit ? 'Editar' : 'Registrar'}} Usuario</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="onClose"/>
    </q-card-section>

    <q-card-section>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md flex flex-wrap justify-around"
      >
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.first_name" label="Nombres" />
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.last_name" label="Apellidos" />
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.address" label="Dirección" />
        <q-input class="w-input" standout="bg-primary text-white" v-model="user.email" label="Email" />
        <q-select class="w-input" standout="bg-primary text-white" v-model="user.department" :options="['LIMA','PUNO','CHICLAYO','...']" label="Departamento" />
        <q-select class="w-input" standout="bg-primary text-white" v-model="user.province" :options="['LIMA','HUARAL','CARAL','...']" label="Provincia" />
        <q-select class="w-input" standout="bg-primary text-white" v-model="user.district" :options="['SMP','ATE','SJL','...']" label="Distrito" />
        <q-select
          class="w-input"
          standout="bg-primary text-white"
          v-model="user.roles"
          multiple
          :options="['ADMINISTRADOR','VENDEDOR','CLIENTE','ALMACEN']"
          use-chips
          label="Roles"
        />

        <div class="full-width flex justify-end">
          <q-btn label="Limpiar" type="reset" color="negative" flat class="q-mr-sm" />
          <q-btn :label="edit ? 'Editar' : 'Registrar'" type="submit" color="primary"/>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "UserForm",
  props : {
    edit : {
      type : Boolean,
      default : false
    },
    userToEdit : Object
  },
  created() {
    if(this.edit){
      this.user = this.userToEdit
    }
  },
  data(){
    return {
      user : {
        first_name: null,
        last_name: null,
        enabled: false,
        email: null,
        address: null,
        roles: [],
        district : null,
        province : null,
        department : null
      },
    }
  },
  methods: {
    onSubmit () {
      this.$q.notify({
        message: 'Usuario Registrado correctamente',
        color: 'positive'
      })
      this.$emit('onClose')
    },
    onReset () {
      this.user = {
        first_name: null,
        last_name: null,
        enabled: false,
        email: null,
        address: null,
        roles: [],
        district : null,
        province : null,
        department : null
      }
    },
    onClose(){
      this.$emit('onClose')
    }
  }
}
</script>

<style scoped>
.w-input{
  width : 45%
}
</style>

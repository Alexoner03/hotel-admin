<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de usuarios</h1>
    <hr>
    <q-btn color="primary" icon="add" label="NUEVO USUARIO" @click="toggleRegisterModal"/>

    <users-table
      :columns="columnsAlumno"
      :data="dataAlumno"
      @onClickEdit="toggleEditModal"
      @onClickDelete="confirmDelete"
      title="Alumnos"
    />
    <users-table
      :columns="columnsDocente"
      :data="dataDocente"
      @onClickEdit="toggleEditModal"
      @onClickDelete="confirmDelete"
      title="Docentes"
    />

    <q-dialog v-model="register" persistent>
      <user-form @onReload="reload" @onClose="toggleRegisterModal"/>
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <user-form @onReload="reload" @onClose="toggleEditModal" :edit="true" :user-to-edit="userToEdit" :id-user="userSelected"/>
    </q-dialog>

  </q-page>
</template>

<script>
import UserForm from 'components/forms/UserForm'
import links from '../constantes/url'
import {mapState} from 'vuex'
import UsersTable from "components/UsersTable";
import {QSpinnerCube} from "quasar";

export default {
  name: "Users",
  components : {
    UserForm,
    UsersTable
  },
  created() {
    let interval = setInterval(_ => {
      if(this.token !== null){
        this.getData('alumno')
        this.getData('docente')
        clearInterval(interval)
      }
    },100)
  },
  data() {
    return {
      columnsAlumno: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          field: 'id',
        },
        {
          name: 'codigo',
          label: 'CODIGO',
          field: row => row.student.codigo,
        },
        { name: 'nombres', label: 'NOMBRES', field: 'nombres'},
        { name: 'apellidos', label: 'APELIIDOS', field: 'apellidos'},
        { name: 'email', label: 'CORREO', field: 'email' },
        { name: 'created_at', label: 'FEC. REGISTRO', field: 'created_at' },
        { name: 'role', label: 'ROL', field: row => row.role.descripcion },
      ],
      dataAlumno: [],

      columnsDocente: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          field: 'id',
        },
        {
          name: 'codigo',
          label: 'CODIGO',
          field: row => row.teacher.codigo,
        },
        { name: 'nombres', label: 'NOMBRES', field: 'nombres'},
        { name: 'apellidos', label: 'APELIIDOS', field: 'apellidos'},
        { name: 'email', label: 'CORREO', field: 'email' },
        { name: 'created_at', label: 'FEC. REGISTRO', field: 'created_at' },
        { name: 'role', label: 'ROL', field: row => row.role.descripcion },
      ],
      dataDocente: [],

      //register Dialog
      register : false,

      //edit Dialog
      edit : false,
      userToEdit  : null,
      userSelected : null
    }
  },
  methods : {
    toggleRegisterModal(){
      this.register = !this.register
    },
    toggleEditModal(row){
      if(!this.edit){
        this.userToEdit = {
          email: row.email,
          password: null,
          nombres: row.nombres,
          apellidos: row.apellidos,
          role_id: row.role.id,
        }
        this.userSelected = row.id
      }else{
        this.userToEdit = null
        this.userSelected = null
      }
      this.edit = !this.edit
    },
    async getData(role){
      const {headers,url} = links.listUsersByRol(role,this.token)
      try {
        const {status,data} = await this.$axios.get(url,{headers})
        if(status === 200){
          role === 'alumno' ? this.dataAlumno = data : this.dataDocente = data
        }
      }catch(error){
        console.error(error)
      }
    },
    confirmDelete(row){
      this.$q.dialog({
        title: 'Confirmar Eliminación',
        message: `Desea dar de baja al usuario ${row.nombres} ${row.apellidos}`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.deleteUser(row.id,row.role.id)
      })
    },
    async deleteUser(id,rol){
      const {url,headers} = links.deleteUserUrl(id,this.token)
      const dialog = this.$q.dialog({
        title: 'Eliminando',
        message: 'Espere por favor',
        progress: {
          spinner: QSpinnerCube,
          color: 'primary'
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })
      try {
        const {status,data} = await this.$axios.delete(url,{headers})
        if(status === 200){
          rol === 3 ? this.getData('alumno') : this.getData('docente')
          this.$q.notify({
            message: data.message,
            icon: 'announcement',
            color : 'positive'
          })
          dialog.hide()
        }
      }catch (error) {
        this.$q.notify({
          message: 'Ocurrió un error',
          icon: 'close',
          color : 'negative'
        })
        dialog.hide()
      }
    },
    async reload(rol_id){
      rol_id === 3 ? this.getData('alumno') : this.getData('docente')
    }
  },
  computed : {
    ...mapState('auth',['token'])
  }
}
</script>

<style lang="sass">
.firstColumnSticky
  max-width: 100%
  thead tr:first-child th:first-child
    background-color: #E87F4F
  td:first-child
    background-color: #E87F4F
  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

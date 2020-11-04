<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de usuarios</h1>
    <hr>

    <q-table
      class="firstColumnSticky q-mt-lg"
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:top>
        <q-btn color="primary" icon="add" label="NUEVO ENLACE" @click="toggleRegisterModal"/>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>Opciones</q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn class="q-mr-sm" size="sm" color="positive" round dense icon="edit" @click="toggleEditModal(props.row)" />
            <q-btn class="q-mr-sm" size="sm" color="negative" round dense icon="close" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="register" persistent>
      <user-form @onClose="toggleRegisterModal"/>
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <user-form @onClose="toggleEditModal" :edit="true" :user-to-edit="userToEdit" />
    </q-dialog>

  </q-page>
</template>

<script>
import UserForm from 'components/forms/UserForm'
export default {
  name: "Users",
  components : {
    UserForm
  },
  data() {
    return {
      filter: '',
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          field: 'id',
          sortable: true
        },
        {
          name: 'first_name',
          label: 'NOMBRES',
          field: 'first_name',
          sortable: true
        },
        { name: 'last_name', label: 'APELLIDOS', field: 'last_name', sortable: true },
        { name: 'enabled', label: 'ESTADO', field: 'enabled', format : val => val ? 'HABILITADO' : 'DESHABILITADO' },
        { name: 'email', label: 'CORREO', field: 'email' },
        { name: 'address', label: 'DIRECCIÓN', field: 'address' },
        { name: 'roles', label: 'ROLES', field: 'roles' },

      ],
      data: [
        {
          id: 1,
          first_name: 'Ciro Julio',
          last_name: 'ALgun Apellido',
          enabled: true,
          email: 'correo@correo.com',
          address: 'Jr Calle de por ahi 123',
          roles: 'rol1, rol2, rol3'
        },
        {
          id: 2,
          first_name: 'Ciro Juli2',
          last_name: 'ALgun Apellid2',
          enabled: true,
          email: 'corre2@correo.com',
          address: 'Jr Calle de por ahi 122',
          roles: 'rol1, rol2, rol3'
        },
        {
          id: 3,
          first_name: 'Ciro Juli3',
          last_name: 'ALgun Apellid3',
          enabled: true,
          email: 'corre3@correo.com',
          address: 'Jr Calle de por ahi 123',
          roles: 'rol1, rol2, rol3'
        },
        {
          id: 4,
          first_name: 'Ciro Juli4',
          last_name: 'ALgun Apellid4',
          enabled: true,
          email: 'corre4@correo.com',
          address: 'Jr Calle de por ahi 124',
          roles: 'rol1, rol2, rol3'
        },
        {
          id: 5,
          first_name: 'Ciro Juli5',
          last_name: 'ALgun Apellid5',
          enabled: true,
          email: 'corre5@correo.com',
          address: 'Jr Calle de por ahi 125',
          roles: 'rol1, rol2, rol3'
        },

      ],

      //register Dialog
      register : false,

      //edit Dialog
      edit : false,
      userToEdit  : null
    }
  },
  methods : {
    toggleRegisterModal(){
      this.register = !this.register
    },
    toggleEditModal(row){
      if(!this.edit){
        this.userToEdit = {
          address: row.address,
          email: row.email,
          enabled: row.enabled,
          first_name: row.first_name,
          id: row.id,
          last_name: row.last_name,
          roles: row.roles
        }
      }else{
        this.userToEdit = null
      }
      this.edit = !this.edit
    }
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

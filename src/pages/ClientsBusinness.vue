<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Clientes Empresariales</h1>
    <hr />

    <div class="q-my-md flex items-center">
      <q-btn
        class="q-mr-md"
        color="positive"
        icon="add"
        label="NUEVO CLIENTE"
        @click="register = !register"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="warning"
        icon="edit"
        label="EDITAR CLIENTE"
        @click="openEditForm"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="negative"
        icon="edit"
        label="ELIMINAR CLIENTE"
        @click="confirmDelete"
      />
    </div>

    <q-table
      :data="users"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :loading="loading"
    />

    <!-- MODALS  -->
    <q-dialog v-model="register" persistent>
      <form-client-enterprise @onSuccess="transactionSuccess" @onError="transactionError" />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <form-client-enterprise
        :formData="userToEdit"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import links from "../constantes/url";
import FormClientEnterprise from "src/components/clients/FormClientEnterprise";
import { QSpinnerCube } from "quasar";

export default {
  components: { FormClientEnterprise },
  name: "ClientsEnterprise",
  created() {
    let interval = setInterval(_ => {
      if (localStorage.getItem("token")) {
        this.getData();
        clearInterval(interval);
      }
    }, 100);
  },
  data() {
    return {

      loading : false,

      //table
      columns: [
        { name: "id", label: "Codigo", field: row => row.id },
        { name: "name", label: "Nombre", field: row => row.person.name },
        { name: "sex", label: "Sexo", field: row => row.person.sex },
        {
          name: "cellphone",
          label: "Celular",
          field: row => row.person.cellphone
        },
        { name: "dni", label: "Dni", field: row => row.person.dni },
        {
          name: "first_lastname",
          label: "Ap Pat",
          field: row => row.person.first_lastname
        },
        {
          name: "second_lastname",
          label: "Ap Mat",
          field: row => row.person.second_lastname
        },
        {
          name: "birthday",
          label: "Fec Nac",
          field: row => row.person.birthday
        },
        { name: "email", label: "Email", field: row => row.person.email },
        {
          name: "address",
          label: "Dirección",
          field: row => row.person.address
        },
                {
          name: "ruc",
          label: "RUC",
          field: row => row.person.ruc
        },
                {
          name: "businnes_name",
          label: "Razón social",
          field: row => row.person.business_name
        },
      ],
      users: [],
      selected: [],

      //register Dialog
      register: false,

      //edit Dialog
      edit: false,
      userToEdit : null
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      const { headers, url } = links.listBusinnesClients;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.users = data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    confirmDelete() {
      const user = this.selected[0];
      this.$q
        .dialog({
          title: "Confirmar Eliminación",
          message: `Desea dar de baja al cliente ${user.person.name} ${user.person.first_lastname}`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteUser(user.id);
        });
    },
    async deleteUser(id) {
      const { url, headers } = links.deleteClientUrl(id);
      const dialog = this.$q.dialog({
        title: "Eliminando",
        message: "Espere por favor",
        progress: {
          spinner: QSpinnerCube,
          color: "primary"
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      });
      try {
        const { status, data } = await this.$axios.delete(url, { headers });
        if (status === 200) {
          await this.getData();
          this.$q.notify({
            message: data.message,
            position : 'top-right',
            icon: "announcement",
            color: "positive"
          });
          dialog.hide();
        }
      } catch (error) {
        this.$q.notify({
          message: "Ocurrió un error",
          position : 'top-right',
          icon: "close",
          color: "negative"
        });
        dialog.hide();
      }
    },
    openEditForm(){
      this.userToEdit = {
        name : this.selected[0].person.name,
        sex : this.selected[0].person.sex,
        cellphone : this.selected[0].person.cellphone,
        dni : this.selected[0].person.dni,
        first_lastname : this.selected[0].person.first_lastname,
        second_lastname : this.selected[0].person.second_lastname,
        birthday : this.selected[0].person.birthday,
        email : this.selected[0].person.email,
        address : this.selected[0].person.address,
        ruc : this.selected[0].person.ruc,
        business_name : this.selected[0].person.business_name,
        id : this.selected[0].id
      }
      this.edit = true
    },
    async transactionSuccess({ form, data }) {

      this.getData()

      form === "create" ? (this.register = false) : (this.edit = false);

      this.$q.notify({
        color: "positive",
        message: data.message,
        position: "top-right"
      });

    },
    transactionError(data) {
      this.getData()
      console.error("[Error en request]", data.message);
      this.$root.$children[0].errorHandler(data.errors);
    }
  }
};
</script>

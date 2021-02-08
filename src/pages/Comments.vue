<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Tipo de Servicios</h1>
    <hr />

    <div class="q-my-md flex items-center">
      <q-btn
        class="q-mr-md"
        color="positive"
        icon="add"
        label="NUEVO TIPO"
        @click="register = !register"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="warning"
        icon="edit"
        label="EDITAR TIPO"
        @click="openEditForm"
      />
    </div>

    <q-table
      grid
      hide-header
      :data="typeServices"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :loading="loading"
    />

    <!-- MODALS  -->
    <q-dialog v-model="register" persistent>
      <form-type-service
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <form-type-service
        :formData="typeServiceToEdit"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import links from "../constantes/url";
import FormTypeService from "src/components/services/TypeServiceForm";

export default {
  components: { FormTypeService },
  name: "Commentsq",
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
      loading: false,

      //table
      columns: [
        { name: "id", label: "Codigo", field: row => row.id },
        { name: "description", label: "Nombre", field: row => row.description }
      ],
      typeServices: [],
      selected: [],

      //register Dialog
      register: false,

      //edit Dialog
      edit: false,
      typeServiceToEdit: null
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      const { headers, url } = links.listTypeService;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.typeServices = data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    openEditForm() {
      this.typeServiceToEdit = {
        id: this.selected[0].id,
        description: this.selected[0].description
      };
      this.edit = true;
    },
    async transactionSuccess({ form, data }) {
      this.getData();

      form === "create" ? (this.register = false) : (this.edit = false);

      this.$q.notify({
        color: "positive",
        message: data.message,
        position: "top-right"
      });
    },
    transactionError(data) {
      this.getData();
      console.error("[Error en request]", data.message);
      this.$root.$children[0].errorHandler(data.errors);
    }
  }
};
</script>

<template>
  <div class="full-width">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Servicios</h1>
    <hr />

    <div class="q-my-md flex items-center">
      <q-btn
        class="q-mr-md"
        color="positive"
        icon="add"
        label="NUEVO SERVICIO"
        @click="register = !register"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="warning"
        icon="edit"
        label="EDITAR SERVICIO"
        @click="openEditForm"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="negative"
        icon="edit"
        label="ELIMINAR SERVICIO"
        @click="confirmDelete"
      />
    </div>

    <q-table
      :data="services"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :loading="loading"
    />

    <!-- MODALS  -->
    <q-dialog v-model="register" persistent>
      <form-service
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <form-service
        :formData="serviceToEdit"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>
  </div>
</template>

<script>
import links from "../../constantes/url";
import FormService from "src/components/services/ServiceForm";
import { QSpinnerCube } from "quasar";

export default {
  components: { FormService },
  name: "ServicePageItem",
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
        { name: "id", label: "Codigo", field: "id" },
        { name: "name", label: "Nombre", field: "name" },
        { name: "description", label: "Descripción", field: "description" },
        { name: "price", label: "Precio", field: "price" },
        {
          name: "type_service_id",
          label: "Tipo de Servicio",
          field: row => row.type_service.id
        }
      ],
      services: [],
      selected: [],

      //register Dialog
      register: false,

      //edit Dialog
      edit: false,
      serviceToEdit: null
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      const { headers, url } = links.listServices;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.services = data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    confirmDelete() {
      const service = this.selected[0];
      this.$q
        .dialog({
          title: "Confirmar Eliminación",
          message: `Desea dar de baja al servicio ${service.name}`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteService(user.id);
        });
    },
    async deleteService(id) {
      const { url, headers } = links.deleteServicesUrl(id);
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
            position: "top-right",
            icon: "announcement",
            color: "positive"
          });
          dialog.hide();
        }
      } catch (error) {
        this.$q.notify({
          message: "Ocurrió un error",
          position: "top-right",
          icon: "close",
          color: "negative"
        });
        dialog.hide();
      }
    },
    openEditForm() {
      this.serviceToEdit = {
        name: this.selected[0].name,
        description: this.selected[0].description,
        price: this.selected[0].price,
        type_service_id: this.selected[0].type_service_id,
        id: this.selected[0].id
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

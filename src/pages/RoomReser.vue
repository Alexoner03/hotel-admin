<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Reservas</h1>
    <hr />

    <div class="q-my-md flex items-center">
      <q-btn
        class="q-mr-md"
        color="positive"
        icon="add"
        label="NUEVA RESERVA"
        @click="register = !register"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="warning"
        icon="edit"
        label="EDITAR RESERVA"
        @click="openEditForm"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="negative"
        icon="edit"
        label="ELIMINAR RESERVA"
        @click="confirmDelete"
      />
    </div>

    <q-table
      :data="reservations"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :loading="loading"
    />

    <!-- MODALS  -->
    <q-dialog v-model="register" persistent>
      <form-reser
        :rooms="rooms"
        :clients="clients"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <form-reser
        :rooms="rooms"
        :clients="clients"
        :formData="reservationToEdit"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import Moment from "moment";
import links from "../constantes/url";
import FormReser from "src/components/rooms/FormReser.vue";
import { QSpinnerCube } from "quasar";

export default {
  components: { FormReser },
  name: "Reservations",
  created() {
    let interval = setInterval(_ => {
      if (localStorage.getItem("token")) {
        this.getData();
        this.getRooms();
        this.getClients();
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
        {
          name: "client",
          label: "Cliente",
          field: row =>
            `${row.client.person.name} ${row.client.person.first_lastname} ${row.client.person.second_lastname}`
        },
        { name: "from", label: "Desde", field: "from" },
        { name: "to", label: "Hasta", field: "to" },
        { name: "room", label: "Habitacion", field: row => row.room.number }
      ],
      reservations: [],
      selected: [],

      //register Dialog
      register: false,

      //edit Dialog
      edit: false,
      reservationToEdit: null,

      //roomList
      rooms: [],
      clients: []
    };
  },
  methods: {
    async getRooms() {
      const { headers, url } = links.listRooms;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.rooms = data.data.map(room => {
            return {
              label: room.number,
              value: room.id
            };
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getClients() {
      const { headers, url } = links.listAllMappeds;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.clients = data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getData() {
      this.loading = true;
      const { headers, url } = links.listReservations;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.reservations = data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    confirmDelete() {
      const reserva = this.selected[0];
      this.$q
        .dialog({
          title: "Confirmar Eliminación",
          message: `Desea eliminar la reserva ${reserva.id} `,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteReservation(reserva.id);
        });
    },
    async deleteReservation(id) {
      const { url, headers } = links.deleteReservationUrl(id);
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
            icon: "announcement",
            position: "top-right",
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
      this.reservationToEdit = {
        id: this.selected[0].id,
        from: Moment(this.selected[0].from).format( "YYYY/MM/DD"),
        to: Moment(this.selected[0].to).format("YYYY/MM/DD"),
        room_id: this.selected[0].room_id,
        client_id: this.selected[0].client_id
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

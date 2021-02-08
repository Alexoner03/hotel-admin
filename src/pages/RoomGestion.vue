<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Habitaciones</h1>
    <hr />

    <div class="q-my-md flex items-center">
      <q-btn
        class="q-mr-md"
        color="positive"
        icon="add"
        label="NUEVA HABITACIÓN"
        @click="register = !register"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="warning"
        icon="edit"
        label="EDITAR HABITACIÓN"
        @click="openEditForm"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="negative"
        icon="edit"
        label="ELIMINAR HABITACIÓN"
        @click="confirmDelete"
      />
    </div>

    <q-table
      :data="rooms"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :loading="loading"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name !== 'image'">
              {{ col.value }}
            </span>
            <q-img
              v-else
              :src="col.value"
              style="height: 140px; max-width: 150px"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- MODALS  -->
    <q-dialog v-model="register" persistent>
      <form-room @onSuccess="transactionSuccess" @onError="transactionError" />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <form-room
        :formData="roomToEdit"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import links from "../constantes/url";
import FormRoom from "src/components/rooms/FormRoom.vue";
import { QSpinnerCube } from "quasar";

export default {
  components: { FormRoom },
  name: "RoomsGestion",
  created() {
    let interval = setInterval(_ => {
      if (localStorage.getItem("token")) {
        this.getData();
        clearInterval(interval);
      }
    }, 200);
  },
  data() {
    return {
      loading: true,

      //table
      columns: [
        { name: "id", label: "Codigo", field: "id" },
        { name: "number", label: "Numero", field: "number" },
        { name: "price", label: "Precio", field: "price" },
        {
          name: "description",
          label: "Descripción",
          field: "description"
        },
        {
          name: "type_room_id",
          label: "Tipo",
          field: row => row.type_room.name
        },
        {
          name: "disponibilidad",
          label: "Estado",
          field: "disponibilidad"
        },
        {
          name: "image",
          label: "Foto",
          field: row => row.image,
          format: val => `${links.baseUrl}/${val}`
        }
      ],
      rooms: [],
      selected: [],

      //register Dialog
      register: false,

      //edit Dialog
      edit: false,
      roomToEdit: null
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      const { headers, url } = links.listRooms;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.rooms = data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    confirmDelete() {
      const room = this.selected[0];
      this.$q
        .dialog({
          title: "Confirmar Eliminación",
          message: `Desea dar de baja la habitación ${room.number}`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRoom(room.id);
        });
    },
    async deleteRoom(id) {
      const { url, headers } = links.deleteRoomUrl(id);
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
      this.roomToEdit = {
        id: this.selected[0].id,
        number: this.selected[0].number,
        price: this.selected[0].price,
        description: this.selected[0].description,
        type_room_id: this.selected[0].type_room_id,
        disponibilidad: this.selected[0].disponibilidad
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

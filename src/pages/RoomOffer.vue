<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Ofertas</h1>
    <hr />

    <div class="q-my-md flex items-center">
      <q-btn
        class="q-mr-md"
        color="positive"
        icon="add"
        label="NUEVA OFERTA"
        @click="register = !register"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="warning"
        icon="edit"
        label="EDITAR OFERTA"
        @click="openEditForm"
      />

      <q-btn
        class="q-mr-md"
        :disable="selected.length === 0"
        color="negative"
        icon="edit"
        label="ELIMINAR OFERTA"
        @click="confirmDelete"
      />
    </div>

    <q-table
      :data="offers"
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
      <form-offer @onSuccess="transactionSuccess" @onError="transactionError" />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <form-offer
        :formData="offerToEdit"
        @onSuccess="transactionSuccess"
        @onError="transactionError"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import links from "../constantes/url";
import FormOffer from "src/components/rooms/FormOffer.vue";
import { QSpinnerCube } from "quasar";
import moment from 'moment'

export default {
  components: { FormOffer },
  name: "RoomsOffer",
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
        { name: "name", label: "Nombre", field: "name" },
        { name: "price", label: "Precio", field: "price" },
        { name: "description", label: "Descripción", field: "description" },
        { name: "from", label: "Desde", field: "from" },
        { name: "to", label: "Hasta", field: "to" },
        { name: "type_room_id", label: "Tipo de Habitación", field: row => row.type_room.name },
        {
          name: "image",
          label: "Foto",
          field: row => row.image,
          format: val => `${links.baseUrl}/${val}`
        }
      ],
      offers: [],
      selected: [],

      //register Dialog
      register: false,

      //edit Dialog
      edit: false,
      offerToEdit: null
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      const { headers, url } = links.listOffers;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.offers = data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    confirmDelete() {
      const offer = this.selected[0];
      this.$q
        .dialog({
          title: "Confirmar Eliminación",
          message: `Desea dar de baja la oferta ${offer.id}`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteOffer(offer.id);
        });
    },
    async deleteOffer(id) {
      const { url, headers } = links.deleteOfferUrl(id);
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
      this.offerToEdit = {
        id: this.selected[0].id,
        name: this.selected[0].name,
        description: this.selected[0].description,
        from: moment(this.selected[0].from).format('YYYY/MM/DD'),
        to: moment(this.selected[0].to).format('YYYY/MM/DD'),
        price: this.selected[0].price,
        type_room_id : this.selected[0].type_room.id,
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

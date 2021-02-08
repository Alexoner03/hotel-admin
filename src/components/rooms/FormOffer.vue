<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-py-md">
    <q-card-section>
      <div class="text-h6">
        {{ formData ? "Editar Oferta" : "Registrar Oferta" }}
      </div>
    </q-card-section>

    <q-card-section class="q-px-xl q-py-sm">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
        <q-input
          v-model="name"
          type="text"
          label="Nombre de Oferta"
          :rules="[
            val => !!val || 'Este Campo es Requerido',
          ]"
        />

        <q-date
          landscape
          v-model="dateModel"
          :options="rangeFn"
          range
        />

        <q-input
          v-model="price"
          type="number"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          hint="Inserte Precio Ejemplo 100.00"
          label="Precio"
          :rules="[
            val => !!val || 'Este Campo es Requerido',
            val => val > 0 || 'debe ser un numero mayor a 0'
          ]"
        />

        <q-input
          v-model="description"
          type="text"
          label="Descripcion"
          :rules="[val => !!val || 'Este Campo es Requerido']"
        />

        <q-file color="primary" v-model="image" label="Foto de Habitación">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <q-select
          map-options
          emit-value
          v-model="type_room_id"
          :options="typesRooms"
          label="Tipo de Habitacion"
        />

        <div class="flex justify-end">
          <q-btn
            :disable="loading"
            class="q-mr-sm"
            flat
            label="Cancelar"
            color="negative"
            v-close-popup
          />
          <q-btn
            :disable="loading"
            class="q-mr-sm"
            label="Limpiar"
            type="reset"
            color="primary"
            flat
          />
          <q-btn
            :disable="loading"
            label="Guardar"
            type="submit"
            color="primary"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import links from "../../constantes/url";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default {
  name: "FormOffer",
  props: {
    formData: Object
  },
  data() {
    return {
      id: null,
      name: null,
      description: null,
      dateModel: {
        from: null,
        to: null
      },
      price: null,
      type_room_id: null,
      image: null,

      typesRooms: [],

      //state manager
      loading: false
    };
  },
  created() {
    this.setOptionTypes();
    this.setFormData();
  },
  methods: {
    rangeFn(fecha) {
      const today = moment();
      const _fecha = moment(fecha);
      const _result = today.diff(_fecha, "days", true);
      return _result < 1;
    },
    async onSubmit() {
      this.loading = true;

      let body = new FormData();

      body.append("name", this.name);
      body.append("description", this.description);
      body.append("from", this.dateModel.from);
      body.append("to", this.dateModel.to);
      body.append("price", this.price);
      body.append("type_room_id", this.type_room_id);

      if (this.image) {
        body.append("image", this.image);
      }

      if (this.formData) {
        await this.edit(body);
      } else {
        await this.create(body);
      }

      this.loading = false;
    },
    onReset() {
      this.id = null;
      this.name = null;
      this.description = null;
      this.dateModel.from = null;
      this.dateModel.to = null;
      this.price = null;
      this.type_room_id = null;
    },
    async setOptionTypes() {
      const { url, headers } = links.listRoomsTypes;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.typesRooms = data.data.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          });
        }
      } catch (error) {
        console.error(error.response);
      }
    },
    setFormData() {
      if (this.formData) {
        this.id = this.formData.id;
        this.name = this.formData.name;
        this.description = this.formData.description;
        this.dateModel.from = this.formData.from;
        this.dateModel.to = this.formData.to;
        this.price = this.formData.price;
        this.type_room_id = this.formData.type_room_id;
      }
    },
    async create(body) {
      const { url, headers } = links.createOffer;
      try {
        const { status, data } = await this.$axios.post(url, body, { headers });
        if (status === 200) {
          this.$emit("onSuccess", { form: "create", data });
        }
      } catch (error) {
        this.$emit("onError", error.response.data);
      }
    },
    async edit(body) {
      const { url, headers } = links.editOfferUrl(this.formData.id);
      try {
        const { status, data } = await this.$axios.post(url, body, { headers });
        if (status === 200) {
          this.$emit("onSuccess", { form: "edit", data });
        }
      } catch (error) {
        this.$emit("onError", error.response.data);
      }
    }
  }
};
</script>

<style></style>

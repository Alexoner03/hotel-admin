<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-py-md">
    <q-card-section>
      <div class="text-h6">
        {{ formData ? "Editar Habitacion" : "Registrar Habitacion" }}
      </div>
    </q-card-section>

    <q-card-section class="q-px-xl q-py-sm">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
        <q-input
          v-model="number"
          :disable="!!formData"
          type="number"
          label="Numero de Hab."
          :rules="[
            val => !!val || 'Este Campo es Requerido',
            val => val > 0 || 'debe ser un numero mayor a 0'
          ]"
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
        emit-value
          map-options
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

export default {
  name: "FormRoom",
  props: {
    formData: Object
  },
  data() {
    return {
      number: null,
      price: null,
      description: null,
      type_room_id: 1,
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
    async onSubmit() {
      this.loading = true;

      let body = new FormData();

      body.append("number", this.number);
      body.append("price", this.price);
      body.append("description", this.description);
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
      number = null;
      price = null;
      description = null;
      type_room_id = 1;
      image = null;
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
        this.number = this.formData.number;
        this.price = this.formData.price;
        this.description = this.formData.description;
        this.type_room_id = this.formData.type_room_id;
      }
    },
    async create(body) {
      const { url, headers } = links.createRoom;
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
      const { url, headers } = links.editRoomUrl(this.formData.id);
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

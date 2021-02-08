<template>
  <q-card style="width: 700px; max-width: 80vw;" class="q-py-md">
    <q-card-section>
      <div class="text-h6">
        {{ formData ? "Editar Servicio" : "Registrar Servicio" }}
      </div>
    </q-card-section>

    <q-card-section class="q-px-xl q-py-sm">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
        <q-input
          v-model="name"
          type="text"
          label="Nombres"
          :rules="[
            val => !!val || 'Este Campo es Requerido',
            val => val.length > 2 || 'Este campo debe tener mas de 3 letras'
          ]"
        />

        <q-input
          v-model="description"
          type="text"
          label="Descripcion"
          :rules="[
            val => !!val || 'Este Campo es Requerido',
            val => val.length > 2 || 'Este campo debe tener mas de 3 letras'
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


        <q-select
          map-options
          emit-value
          v-model="type_service_id"
          :options="typesServices"
          label="Tipo de Servicio"
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
  name: "FormService",
  props: {
    formData: Object
  },
  data() {
    return {
      name: null,
      description: null,
      price: null,
      type_service_id: null,

      //state manager
      loading: false,
      typesServices : []
    };
  },
  created() {
    this.setFormData();
    this.loadTypes()
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const requestBody = {
        name: this.name,
        description: this.description,
        price: this.price,
        type_service_id: this.type_service_id
      };

      if (this.formData) {
        await this.edit(requestBody);
      } else {
        await this.create(requestBody);
      }

      this.loading = false;
    },
    onReset() {
      this.name = null;
      this.description = null;
      this.price = null;
      this.type_service_id = null;
    },
    setFormData() {
      if (this.formData) {
        this.name = this.formData.name;
        this.description = this.formData.description;
        this.price = this.formData.price;
        this.type_service_id = this.formData.type_service_id;
      }
    },
    async create(body) {
      const { url, headers } = links.createServices;
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
      const { url, headers } = links.editServicesUrl(this.formData.id);
      try {
        const { status, data } = await this.$axios.put(url, body, { headers });
        if (status === 200) {
          this.$emit("onSuccess", { form: "edit", data });
        }
      } catch (error) {
        this.$emit("onError", error.response.data);
      }
    },
    async loadTypes(){
      const { headers, url } = links.listTypeService;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.typesServices = data.data.map(item => {
              return {
                  label : item.description,
                  value : item.id
              }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style></style>

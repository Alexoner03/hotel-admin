<template>
  <q-card style="width: 700px; max-width: 80vw;" class="q-py-md">
    <q-card-section>
      <div class="text-h6">
        {{ formData ? "Editar Tipo" : "Registrar Tipo" }}
      </div>
    </q-card-section>

    <q-card-section class="q-px-xl q-py-sm">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
        <q-input
          v-model="description"
          type="text"
          label="Nombre"
          :rules="[val => !!val || 'Este Campo es Requerido']"
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
  name: "FormTypeService",
  props: {
    formData: Object
  },
  data() {
    return {
      description: null,
      //state manager
      loading: false
    };
  },
  created() {
    this.setFormData();
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const requestBody = {
        description: this.description,
      };

      if (this.formData) {
        await this.edit(requestBody);
      } else {
        await this.create(requestBody);
      }

      this.loading = false;
    },
    onReset() {
      this.description = null;
    },
    setFormData() {
      if (this.formData) {
          this.description = this.formData.description
      }
    },
    async create(body) {
      const { url, headers } = links.createTypeService;
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
      const { url, headers } = links.editTypeServiceUrl(this.formData.id);
      try {
        const { status, data } = await this.$axios.put(url, body, { headers });
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

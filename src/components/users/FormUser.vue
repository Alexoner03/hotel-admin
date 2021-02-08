<template>
  <q-card style="width: 700px; max-width: 80vw;" class="q-py-md">
    <q-card-section>
      <div class="text-h6">
        {{ formData ? "Editar Ususario" : "Registrar Ususario" }}
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
          v-model="first_lastname"
          type="text"
          label="Apellido Paterno"
          :rules="[val => !!val || 'Este Campo es Requerido']"
        />
        <q-input
          v-model="second_lastname"
          type="text"
          label="Apellido Materno"
          :rules="[val => !!val || 'Este Campo es Requerido']"
        />

        <q-input
          v-model="dni"
          :disable="!!formData"
          type="text"
          label="DNI"
          mask="########"
          hint="Ejemplo : 87627365"
          :rules="[
            val => !!val || 'Este Campo es Requerido',
            val => val.length === 8 || 'Deben ser 8 numeros'
          ]"
        />

        <q-input
          v-model="cellphone"
          type="text"
          label="Celular"
          mask="#########"
          hint="Ejemplo : 987654321"
          :rules="[
            val => !!val || 'Este Campo es Requerido',
            val => val.length === 9 || 'Deben ser 9 numeros',
            val => val[0] == '9' || 'Debe empezar por 9'
          ]"
        />

        <q-input
          v-model="birthday"
          mask="date"
          :rules="[
            val =>
              isValidDate(val) || 'Debes ser mayor de 18 años y menor de 70'
          ]"
          hint="Año/Mes/Dia Ingrese su fecha de Nacimiento"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="birthday"
                  :options="optionsDate"
                  :default-year-month="defaultMonth"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="email"
          :disable="!!formData"
          type="email"
          label="Correo Electronico"
          :rules="[val => !!val || 'Este Campo es Requerido', isValidEmail]"
        />
        <q-input
          v-model="address"
          type="text"
          label="Direccion"
          :rules="[val => !!val || 'Este Campo es Requerido']"
        />

        <div>
          <q-radio v-model="sex" val="M" label="Hombre" />
          <q-radio v-model="sex" val="F" label="Mujer" class="q-mr-xl" />
          <q-checkbox left-label v-model="admin" label="Admin?" />
        </div>

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
import { date } from "quasar";
import links from "../../constantes/url";

export default {
  name: "FormUser",
  props: {
    formData: Object
  },
  data() {
    return {
      admin: false,
      name: null,
      sex: "M",
      cellphone: null,
      dni: null,
      first_lastname: null,
      second_lastname: null,
      birthday: null,
      email: null,
      address: null,

      //date-Options :
      defaultMonth: null,

      //state manager
      loading: false
    };
  },
  created() {
    this.setDefaultMonth();
    this.setFormData();
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const requestBody = {
        admin: this.admin,
        name: this.name,
        sex: this.sex,
        cellphone: this.cellphone,
        dni: this.dni,
        first_lastname: this.first_lastname,
        second_lastname: this.second_lastname,
        birthday: this.birthday,
        email: this.email,
        address: this.address
      };

      if (this.formData) {
        await this.edit(requestBody);
      } else {
        await this.create(requestBody);
      }

      this.loading = false;
    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Debe ingresar un email valido";
    },
    isValidDate(inputDate) {
      const today = Date.now();
      const _inputDate = new Date(inputDate);
      let _18years = date.subtractFromDate(today, { year: 18 });
      let _70years = date.subtractFromDate(today, { year: 70 });

      const result = date.isBetweenDates(_inputDate, _70years, _18years, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true
      });

      return result && date.isValid(inputDate);
    },
    optionsDate(configDate) {
      const today = Date.now();
      let _18years = date.subtractFromDate(today, { year: 18 });
      _18years = date.formatDate(_18years, "YYYY/MM/DD");
      let _70years = date.subtractFromDate(today, { year: 70 });
      _70years = date.formatDate(_70years, "YYYY/MM/DD");
      return configDate >= _70years && configDate <= _18years;
    },
    onReset() {
      this.admin = false;
      this.name = null;
      this.sex = null;
      this.cellphone = null;
      this.dni = null;
      this.first_lastname = null;
      this.second_lastname = null;
      this.birthday = null;
      this.email = null;
      this.address = null;
    },
    setDefaultMonth() {
      let _18years = date.subtractFromDate(new Date(), { year: 18 });
      this.defaultMonth = date.formatDate(_18years, "YYYY/MM");
    },
    setFormData() {
      if (this.formData) {
        this.admin = this.formData.admin;
        this.name = this.formData.name;
        this.sex = this.formData.sex;
        this.cellphone = this.formData.cellphone;
        this.dni = this.formData.dni;
        this.first_lastname = this.formData.first_lastname;
        this.second_lastname = this.formData.second_lastname;
        this.birthday = this.formData.birthday;
        this.email = this.formData.email;
        this.address = this.formData.address;
      }
    },
    async create(body) {
      const { url, headers } = links.createUser;
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
      const { url, headers } = links.editUserUrl(this.formData.id);
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

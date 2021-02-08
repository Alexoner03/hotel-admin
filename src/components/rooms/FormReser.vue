<template>
  <q-card style="width: 700px; max-width: 80vw;" class="q-py-md">
    <q-card-section>
      <div class="text-h6">
        {{ formData ? "Editar Reserva" : "Registrar Reserva" }}
      </div>
    </q-card-section>

    <q-card-section class="q-px-xl q-py-sm">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
        <q-select
          v-model="room_id"
          :options="rooms"
          map-options
          emit-value
          @input="searchRanges = false"
          label="Habitación"
          :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-select
          v-model="client_id"
          :options="clients"
          @input="searchRanges = false"
          map-options
          emit-value
          label="Client"
          :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-space />

        <q-btn
          color="primary"
          icon="search"
          label="Buscar Disponibilidad"
          @click="loadRanges"
        />

        <p>
          Primero seleccione una habitación y un cliente, busque la
          disponibilidad y luego seleccione un rango de fechas para su reserva
          si solo desea reservar un dia haga click dos veces en la misma fecha
        </p>

        <q-date
          landscape
          v-model="dateModel"
          :options="rangeFn"
          :disable="!(!!client_id && !!room_id && searchRanges)"
          range
          @range-end="validateRange"
        />
        <q-separator />

        <div class="flex justify-end q-mt-md">
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
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import links from "../../constantes/url";

export default {
  name: "FormReser",
  props: {
    formData: Object,
    rooms: Array,
    clients: Array
  },
  data() {
    return {
      room_id: null,
      client_id: null,
      dateModel: {
        from: null,
        to: null
      },

      //date-Options :
      ranges: [],
      searchRanges : false,

      //state manager
      loading: false
    };
  },
  created() {
    this.setFormData();
  },
  methods: {
    rangeFn(fecha) {
      let result = true;
      const today = moment();
      this.ranges.forEach(item => {
        if (
          date.isBetweenDates(fecha, item[0], item[1], {
            inclusiveFrom: true,
            inclusiveTo: true,
            onlyDate: true
          })
        ) {
          result = false;
        }
      });

      const _fecha = moment(fecha);

      const _result = today.diff(_fecha, "days", true);

      return result && _result < 1;
    },
    validateRange(range) {
      const from = moment(
        `${range.from.year}/${range.from.month}/${range.from.day}`,
        "YYYY/MM/DD"
      );
      const to = moment(
        `${range.to.year}/${range.to.month}/${range.to.day}`,
        "YYYY/MM/DD"
      );
      const rangeSelected = moment.range(from, to);
      let result = true;
      this.ranges.forEach((rangeBack, i) => {
        const rangeItem = moment.range(
          moment(rangeBack[0], "YYYY/MM/DD"),
          moment(rangeBack[1], "YYYY/MM/DD")
        );
        if (rangeSelected.overlaps(rangeItem)) {
          result = false;
        }
      });

      if (!result) {
        this.dateModel = {
          from: null,
          to: null
        };
        this.$q.notify({
          color: "negative",
          message: "rango de fecha no disponible",
          position: "top-right"
        });
      }
    },
    async onSubmit() {
      this.loading = true;
      const requestBody = {
        from: this.dateModel.from,
        to: this.dateModel.to,
        room_id: this.room_id,
        client_id : this.client_id
      };

      if (this.formData) {
        await this.edit(requestBody);
      } else {
        await this.create(requestBody);
      }

      this.loading = false;
    },
    onReset() {
      this.from = null;
      this.to = null;
      this.dateModel.from = null;
      this.dateModel.to = null;
      this.room_id = null;
      this.searchRanges = false;
      this.ranges = [];
      this.loading = false
    },
    setFormData() {
      if (this.formData) {
        this.dateModel.from = this.formData.from;
        this.dateModel.to = this.formData.to;
        this.room_id = this.formData.room_id;
        this.client_id = this.formData.client_id;
      }

      this.loadRanges();
    },
    async loadRanges() {
      if (!(this.client_id && this.room_id)) {
        return;
      }

      const { headers, url } = links.getReservationRanges;
      const body = {
        room_id: this.room_id,
        client_id: this.client_id,
        edit : !!this.formData
      };
      try {
        const { status, data } = await this.$axios.post(url, body, { headers });
        if (status === 200) {
          this.ranges = data.data;
          this.searchRanges = true
        }
      } catch (error) {
        console.error(error);
      }
    },
    async create(body) {
      const { url, headers } = links.createReservation;
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
      const { url, headers } = links.editReservationUrl(this.formData.id);
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

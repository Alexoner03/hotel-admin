<template>
  <div
    class="item rounded-borders flex flex-center column"
    :class="[getBgColor(room.disponibilidad)]"
  >
    <p class="text-h6">{{ room.number }}</p>

    <q-select
    :disable="loading"
      outlined
      @input="changeState"
      v-model="optionSelected"
      :options="options"
      label="Estado"
      style="width : 80%"
    />
  </div>
</template>

<script>
import links from "../../constantes/url";
export default {
  props: {
    room: {
      type: Object,
      required: true
    },
    bgColors: {
      type: Array,
      default: [
        {
          name: "disponible",
          color: "bg-green-2"
        },
        {
          name: "ocupado",
          color: "bg-red-2"
        },
        {
          name: "check-in",
          color: "bg-deep-purple-2"
        },
        {
          name: "check-out",
          color: "bg-indigo-2"
        }
      ]
    }
  },
  created() {
    this.optionSelected = this.room.disponibilidad;
  },
  updated(){
      this.loading = false
  },
  data() {
    return {
        loading : false,
      optionSelected: null,
      options: ["disponible", "ocupado", "check-in", "check-out"]
    };
  },
  methods: {
    getBgColor(name) {
      return this.bgColors.find(item => item.name === name).color;
    },
    changeState(value){
        this.loading = true
        this.$emit('changeState',{
            value,
            id : this.room.id
        })
    }
  }
};
</script>

<style scoped>
.item {
  height: 300px;
  width: 300px;
}
</style>

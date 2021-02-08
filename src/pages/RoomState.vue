<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-mx-none q-mb-md q-mt-none">Estado de Habitaciones</h1>

    <div
      :class="[
        bgColor.color,
        'q-mr-md',
        'inline-block q-pa-sm text-center flex-center'
      ]"
      v-for="bgColor in bgColors"
      :key="bgColor.name"
      style="width : 100px"
    >
      {{ bgColor.name }}
    </div>
    <hr />

    <div
      class="flex justify-between flex-wrap q-mx-auto q-gutter-lg grid q-mt-xl"
    >
      <state-room-item
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        :bgColors="bgColors"
        @changeState="changeState"
      />
    </div>
  </q-page>
</template>

<script>
import links from "../constantes/url";
import StateRoomItem from "src/components/rooms/StateRoomItem.vue";
export default {
  components: { StateRoomItem },
  data() {
    return {
      rooms: [],
      bgColors: [
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
    };
  },
  created() {
    let interval = setInterval(_ => {
      if (localStorage.getItem("token")) {
        this.getData();
        clearInterval(interval);
      }
    }, 200);
  },
  methods: {
    async getData() {
      const { headers, url } = links.listRooms;
      try {
        const { status, data } = await this.$axios.get(url, { headers });
        if (status === 200) {
          this.rooms = data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async changeState({ value, id }) {
      const { headers, url } = links.changeStateUrl(id);
      try {
        const { status, data } = await this.$axios.patch(
          url,
          { disponibilidad: value },
          { headers }
        );
        if (status === 200) {
          const roomIndex = this.rooms.findIndex(
            room => room.id === data.data.id
          );
          this.$set(this.rooms, roomIndex, data.data);
          
          this.$q.notify({
            message: data.message,
            icon: "announcement",
            position: "top-right",
            color: "positive"
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.grid {
  max-width: 1000px;
}
</style>

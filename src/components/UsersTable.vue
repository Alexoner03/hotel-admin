<template>
  <q-table
    class="firstColumnSticky q-mt-lg"
    :data="data"
    :columns="columns"
    row-key="id"
    :title="title"
    :filter="filter"
  >
    <template v-slot:top-right>
        <q-input borderless dense debounce="300" color="primary" v-model="filter" label="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width>Opciones</q-th>
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn class="q-mr-sm" size="sm" color="positive" round dense icon="edit" @click="onClickEdit(props.row)" />
          <q-btn class="q-mr-sm" size="sm" color="negative" round dense icon="close" @click="onClickDelete(props.row)"/>
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  name: "UsersTable",
  props : {
    data : {
      type :Array,
      required : true
    },
    columns : {
      type : Array,
      required : true
    },
    title : {
      type : String,
      required : true
    }
  },
  data(){
    return {
      filter : ''
    }
  },
  methods : {
    onClickEdit(row){
      this.$emit('onClickEdit',row)
    },
    onClickDelete(row){
      this.$emit('onClickDelete',row)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <q-card style="width: 700px; max-width: 80vw;" v-if="course">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Detalles</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="onClose" />
    </q-card-section>

    <q-card-section>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="detalles" label="Detalles" />
        <q-tab name="alumnos" label="Alumnos" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="detalles">
          <q-scroll-area style="height: 200px; width: 100%">
            <q-markup-table v-if="course">
              <tbody>
              <tr>
                <td>Codigo</td><td>{{course.id}}</td>
              </tr>
              <tr>
                <td>Nombre</td><td>{{course.nombre}}</td>
              </tr>
              <tr>
                <td>Inicio</td><td>{{course.inicio}}</td>
              </tr>
              <tr>
                <td>Fin</td><td>{{course.fin}}</td>
              </tr>
              <tr>
                <td>Fec. Registro</td><td>{{course.created_at}}</td>
              </tr>
              <tr>
                <td>Codigo Docente</td><td>{{course.teacher.codigo}}</td>
              </tr>
              <tr>
                <td>Nombre Docente</td><td>{{course.teacher.user.nombres+' '+course.teacher.user.apellidos}}</td>
              </tr>
              </tbody>
            </q-markup-table>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="alumnos">
          <div class="text-h6">Matriculados : </div>
          <q-scroll-area style="height: 200px; width: 100%">
            <q-markup-table>
              <thead>
              <tr>
                <th style="text-align: left">Codigo</th>
                <th style="text-align: left">Nombres</th>
                <th style="text-align: left">Nota</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(item,i) in course.students" :key="i">
                  <td>{{item.codigo}}</td><td>{{item.user.nombres+' '+item.user.apellidos}}</td><td>{{item.pivot.nota ? item.pivot.nota : 'PENDIENTE' }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-scroll-area>
        </q-tab-panel>

      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script>
import links from '../constantes/url'
import {mapState} from "vuex";
export default {
  name: "DetailCourse",
  props : {
    idCourse : Number
  },
  data(){
    return {
      tab : 'detalles',
      course : null
    }
  },
  created() {
    this.getInfo(this.idCourse)
  },
  methods : {
    async getInfo() {
      try {
        const {url, headers} = links.detailCourseURl(this.idCourse, this.token)
        const config = {headers}
        const {status, data} = await this.$axios.get(url, config)

        if (status === 200) {
          this.course = data
        } else {
          throw new Error('error en petición')
        }
      } catch (error) {
        console.error(error)
      }
    },
    onClose() {
      this.$emit('onClose')
    }
  },
  computed: {
    ...mapState('auth', ['token'])
  }
}
</script>

<style scoped>

</style>

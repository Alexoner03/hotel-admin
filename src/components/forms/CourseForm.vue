<template>
  <q-card style="min-width: 50vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">{{ edit ? 'Editar' : 'Registrar' }} Curso</div>
      <q-space/>
      <q-btn icon="close" flat round dense @click="onClose"/>
    </q-card-section>

    <q-card-section>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md flex flex-wrap justify-around"
      >

        <q-input standout="bg-primary text-white" class="w-input" label="Inicio" filled v-model="course.inicio" mask="date" :rules="[val => !!val || 'Requerido']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="course.inicio">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input standout="bg-primary text-white" class="w-input" label="Fin" filled v-model="course.fin" mask="date" :rules="[val => !!val || 'Requerido']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="course.fin">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input class="w-input" standout="bg-primary text-white" v-model="course.nombre" label="Nombre"
                 :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-select class="w-input" v-if="teachers.length > 0"
          :rules="[val => !!val || 'Este campo es requerido']"
          map-options
          standout="bg-primary text-white"
          option-value="id"
          :option-label="item => item ? `${item.user.nombres} ${item.user.apellidos}` : null"
          v-model="course.teacher_id"
          emit-value
          :options="teachers"
          label="Docente"
        />

        <div class="full-width flex justify-end">
          <q-btn label="Limpiar" type="reset" color="negative" flat class="q-mr-sm"/>
          <q-btn :label="edit ? 'Editar' : 'Registrar'" type="submit" color="primary"/>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>

import links from '../../constantes/url'
import {mapState} from 'vuex'

export default {
  name: "CourseForm",
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    courseToEdit: Object,
    idCourse : Number
  },
  async created() {
    if (this.edit) {
      this.course = this.courseToEdit
    }
    const {url, headers} = links.listTeachersUrl(this.token)
    const {status,data} = await this.$axios.get(url, {headers})

    if (status === 200) {
      this.teachers = data.data
    }

  },
  data() {
    return {
      course : {
        nombre: null,
        inicio: null,
        fin: null,
        teacher_id: null,
      },
      teachers: []
    }
  },
  methods: {
    async onSubmit() {
      this.edit ? await this.editCourse() : await this.createCourse()
    },
    async createCourse(){
      try {
        const {url, headers} = links.createCourseUrl(this.token)
        const config = {headers}

        const {status, data} = await this.$axios.post(url, this.course, config)

        if (status === 200 && data.res) {
          this.$emit('onReload')
          this.course = {
            nombre: null,
            inicio: null,
            fin: null,
            teacher_id: null,
          }
          this.$q.notify({
            message: data.message,
            color: 'positive'
          })
        } else {
          throw new Error('error en petición')
        }
        this.$emit('onClose')
      }
      catch (error) {
        this.$q.notify({
          message: 'Error enviando usuario',
          color: 'negative'
        })
      }
    },
    async editCourse(){
      try {
        const {url, headers} = links.editCourseUrl(this.idCourse,this.token)
        const config = {headers}
        const {status, data} = await this.$axios.patch(url, this.course, config)

        if (status === 200 && data.res) {
          this.$emit('onReload')
          this.user = {
            nombre: null,
            inicio: null,
            fin: null,
            teacher_id: null,
          }
          this.$q.notify({
            message: data.message,
            color: 'positive'
          })
        } else {
          throw new Error('error en petición')
        }
        this.$emit('onClose')
      }
      catch (error) {
        this.$q.notify({
          message: 'Error enviando usuario',
          color: 'negative'
        })
      }
    },
    onReset() {
      this.user = {
        nombre: null,
        inicio: null,
        fin: null,
        teacher_id: null
      }
    },
    onClose() {
      this.$emit('onClose')
    },
  },
  computed: {
    ...mapState('auth', ['token'])
  }
}
</script>

<style scoped>
.w-input {
  width: 45%
}
</style>

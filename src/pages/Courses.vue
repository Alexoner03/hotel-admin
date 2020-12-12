<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h4 q-ma-none">Mantenimiento de Cursos</h1>
    <hr>
    <q-btn color="primary" icon="add" label="NUEVO CURSO" @click="toggleRegisterModal"/>

    <courses-table
      :columns="columns"
      :data="data"
      @onClickEdit="toggleEditModal"
      @onClickDelete="confirmDelete"
      @onClickDetaik="toggleDetailModal"
      title="Cursos"
    />

    <q-dialog v-model="register" persistent>
      <course-form @onReload="reload" @onClose="toggleRegisterModal" />
    </q-dialog>

    <q-dialog v-model="edit" persistent>
      <course-form @onReload="reload" @onClose="toggleEditModal" :edit="true" :course-to-edit="courseToEdit" :id-course="courseSelected" />
    </q-dialog>

    <q-dialog v-model="detail" persistent>
      <detail-course :id-course="courseSelected" @onClose="toggleDetailModal"/>
    </q-dialog>

  </q-page>
</template>

<script>

import CourseForm from "components/forms/CourseForm";
import CoursesTable from "components/CoursesTable";
import links from "src/constantes/url";
import {QSpinnerCube} from "quasar";
import {mapState} from "vuex";
import DetailCourse from "components/DetailCourse";

export default {
  name: "Products",
  components : {
    DetailCourse,
    CourseForm,
    CoursesTable
  },
  created() {
    let interval = setInterval(_ => {
      if(this.token !== null){
        this.getData()
        clearInterval(interval)
      }
    },100)
  },
  data() {
    return {
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          field: 'id',
        },
        {
          name: 'nombre',
          label: 'NOMBRE',
          field: 'nombre',
        },
        { name: 'inicio', label: 'INICIO', field: 'inicio'},
        { name: 'fin', label: 'FIN', field: 'fin'},
        { name: 'teacher', label: 'CODIGO-PROF', field: val => val.teacher.codigo },
        { name: 'created_at', label: 'FEC. REGISTRO', field: 'created_at' },
      ],
      data: [],

      //register Dialog
      register : false,

      //edit Dialog
      edit : false,
      courseToEdit  : null,
      courseSelected : null,

      //detail dialog
      detail : false
    }
  },
  methods : {
    toggleRegisterModal(){
      this.register = !this.register
    },
    toggleEditModal(row){
      if(!this.edit){
        this.courseToEdit = {
          nombre: row.nombre,
          inicio: row.inicio,
          fin: row.fin,
          teacher_id: row.teacher_id
        }
        this.courseSelected = row.id
      }else{
        this.courseToEdit = null
        this.courseSelected = null
      }
      this.edit = !this.edit
    },
    async getData(){
      const {headers,url} = links.listCoursesUrl(this.token)
      try {
        const {status,data} = await this.$axios.get(url,{headers})
        if(status === 200){
          this.data = data.data
        }
      }catch(error){
        console.error(error)
      }
    },
    confirmDelete(row){
      this.$q.dialog({
        title: 'Confirmar Eliminación',
        message: `Desea dar de baja al curso ${row.nombre}`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.deleteUser(row.id)
      })
    },
    async deleteUser(id){
      const {url,headers} = links.deleteCourseUrl(id,this.token)
      const dialog = this.$q.dialog({
        title: 'Eliminando',
        message: 'Espere por favor',
        progress: {
          spinner: QSpinnerCube,
          color: 'primary'
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })
      try {
        const {status,data} = await this.$axios.delete(url,{headers})
        if(status === 200){
          this.getData()
          this.$q.notify({
            message: data.message,
            icon: 'announcement',
            color : 'positive'
          })
          dialog.hide()
        }
      }catch (error) {
        this.$q.notify({
          message: 'Ocurrió un error',
          icon: 'close',
          color : 'negative'
        })
        dialog.hide()
      }
    },
    async reload(){
      this.getData()
    },
    toggleDetailModal(row) {
      if (this.detail) {
        this.courseSelected = null
      }else{
        this.courseSelected = row.id
      }
      this.detail = !this.detail
    }
  },
  computed : {
    ...mapState('auth',['token'])
  }
}
</script>

<style scoped>

</style>

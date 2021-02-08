<template>
  <q-layout view="lHr LpR lFf">
    <q-header reveal class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title>
          <q-avatar size="4rem">
            <q-icon name="fas fa-hotel" />
          </q-avatar>
          &nbsp; HOTEL ADMINISTRADOR
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :width="220"
      elevated
      :breakpoint="400"
      show-if-above
    >
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item to="/" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section>
              INICIO
            </q-item-section>
          </q-item>

          <q-item to="/users" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>

            <q-item-section>
              USUARIOS
            </q-item-section>
          </q-item>

          <q-expansion-item
            expand-separator
            icon="fas fa-user-friends"
            label="CLIENTES"
          >
            <q-item to="/clients-normals" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-male" />
              </q-item-section>

              <q-item-section>
                NORMALES
              </q-item-section>
            </q-item>
            <q-item to="/clients-businness" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-building" />
              </q-item-section>

              <q-item-section>
                EMPRESARIALES
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="fas fa-bed"
            label="HABITACIONES"
          >
            <q-item to="/rooms-gest" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-cogs" />
              </q-item-section>

              <q-item-section>
                GESTION
              </q-item-section>
            </q-item>
            <q-item to="/rooms-state" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-cogs" />
              </q-item-section>

              <q-item-section>
                ESTADO
              </q-item-section>
            </q-item>
            <q-item to="/rooms-reser" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-cogs" />
              </q-item-section>

              <q-item-section>
                RESERVAS
              </q-item-section>
            </q-item>
            <q-item to="/rooms-offer" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-cogs" />
              </q-item-section>

              <q-item-section>
                OFERTAS
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item to="/services" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="fas fa-concierge-bell" />
            </q-item-section>

            <q-item-section>
              SERVICIOS
            </q-item-section>
          </q-item>

          <q-item to="/comments" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="fas fa-comments" />
            </q-item-section>

            <q-item-section>
              COMENTARIOS
            </q-item-section>
          </q-item>

          <q-item to="/contacts" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="far fa-address-book" />
            </q-item-section>

            <q-item-section>
              CONTACTOS
            </q-item-section>
          </q-item>

          <q-item to="/reports" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="fas fa-file-alt" />
            </q-item-section>

            <q-item-section>
              REPORTES
            </q-item-section>
          </q-item>

          <q-item @click="logout" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="close" />
            </q-item-section>

            <q-item-section>
              CERRAR SESIÓN
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://picsum.photos/200/150"
        style="height: 150px"
        img-class="filter"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://picsum.photos/50/50" />
          </q-avatar>
          <div class="text-weight-bold">
            {{ nombres ? nombres : "Usuario" }}
          </div>
          <div>@{{ rol }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <transition
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutRight"
        appear
        mode="in-out"
        :duration="300"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { QSpinnerCube } from "quasar";
export default {
  name: "mainLayout",
  data() {
    return {
      left: false,
      drawer: false
    };
  },
  methods: {
    async logout() {
      const dialog = this.$q.dialog({
        title: "Cerrando Sesión",
        message: "Espere por favor",
        progress: {
          spinner: QSpinnerCube,
          color: "primary"
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      });
      await this.logoutUser();
      dialog.hide();
      await this.$router.replace("/login");
    },
    ...mapActions("auth", ["logoutUser"])
  },
  computed: {
    ...mapState("auth", ["nombres", "rol"])
  }
};
</script>
<style>
.filter {
  filter: blur(0.1rem) brightness(0.5);
}
</style>

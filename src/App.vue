<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  async created() {
    await this.checkAuth();
    if (!this.loggedIn) {
      await this.$router.replace("/login");
    }
  },
  computed: {
    ...mapState("auth", ["loggedIn"])
  },
  methods: {
    ...mapActions("auth", ["checkAuth"]),
    errorHandler(errors) {
      console.log(errors)
      for (const error in errors) {
        if (Object.hasOwnProperty.call(errors, error)) {
          const element = errors[error];

          //alert
          element.forEach(err => {
            this.$q.notify({
              color: "negative",
              icon: "fas fa-exclamation",
              position: "top-right",
              message: err
            });
          });
        }
      }
    }
  }
};
</script>

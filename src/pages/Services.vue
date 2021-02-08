<template>
  <q-page class="q-pa-lg">
    <service-page />
    
    <div style="height : 70px">
      &nbsp;
    </div>

    <type-service-page />
  </q-page>
</template>

<script>
import ServicePage from "src/components/services/ServicePage.vue";
import TypeServicePage from "src/components/services/TypeServicePage.vue";
export default {
  components: { TypeServicePage, ServicePage },
  name: "Service"
};
</script>

<style></style>

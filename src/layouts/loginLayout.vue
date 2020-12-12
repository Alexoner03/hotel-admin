<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary" elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar size="4rem">
            <img src="../assets/icons/logo-white.svg">
          </q-avatar> &nbsp;
          <span style="font-weight: 900">CONTROL DE NOTAS</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name : 'loginLayout',
  data () {
    return {
    }
  }
}
</script>


<template>
  <v-alert
    dark
    close-text="Close"
    icon="mdi-alert"
    transition="fade-transition"
    v-model="global.alertVisible"
  >
    <div class="d-flex align-center">
      <div class="mr-4 body-2">
        {{ global.alertText }}
      </div>
      <v-btn small icon @click="global.showAlert(false)" class="ml-auto">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Observer } from "mobx-vue";

import Global from "@/store/Global";

@Observer
@Component
export default class Alert extends Vue {
  public global = Global;
}
</script>

<style></style>

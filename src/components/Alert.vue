<template>
  <v-alert
    dark
    close-text="Close"
    icon="mdi-alert-outline"
    transition="fade-transition"
    v-model="global.alertVisible"
  >
    <div class="d-flex">
      <div class="mr-4">
        {{ global.alertText }}
      </div>
      <v-btn small icon @click="global.showAlert(false)" class="ml-auto">
        <v-icon>mdi-close-circle</v-icon>
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

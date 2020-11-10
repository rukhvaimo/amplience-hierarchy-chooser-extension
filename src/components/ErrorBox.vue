<template>
  <section class="error-box">
    <p class="grey--text text--darken-2 body-1">
      {{ message }}
    </p>

    <v-btn
      depressed
      text
      color="primary"
      class="text-capitalize"
      @click="action"
    >
      Take me back
    </v-btn>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";

import { ERROR_TYPE } from "@/store/Errors";

@Component
export default class ErrorBox extends Vue {
  @Prop({ type: String, default: ERROR_TYPE.UNKNOWN }) message!: string;

  @Emit("action")
  action(e: Event) {
    return e;
  }
}
</script>

<style lang="scss" scoped>
.error-box {
  display: flex;
  height: calc(100% - 40px);
  align-items: center;
  padding: 64px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    width: 100%;
  }
}
</style>

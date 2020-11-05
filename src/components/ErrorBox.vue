<template>
  <section class="error-box">
    <p>
      {{ message }}
    </p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { ERROR_TYPE } from "@/store/Errors";

@Component
export default class ErrorBox extends Vue {
  @Prop({ type: String, default: ERROR_TYPE.UNKNOWN }) message!: string;
}
</script>

<style lang="scss" scoped>
.error-box {
  border: dashed #ccc;
  display: flex;
  height: calc(100% - 40px);
  align-items: center;
  padding: 64px;
  border-radius: 8px;
  text-align: center;

  p {
    width: 100%;
  }
}
</style>

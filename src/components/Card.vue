<template>
  <v-card elevation="2">
    <div class="card-scale"></div>
    <v-btn class="mx-2" fab color="primary" @click="onAdd">
      <v-icon>
        mdi-plus
      </v-icon>
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";

@Component
export default class Card extends Vue {
  @Prop({ default: () => {} }) onClick!: Function;

  @Emit("add")
  onAdd(e: Event) {
    return e;
  }
}
</script>

<style scoped lang="scss">
.v-card {
  margin: 0 10px 10px 0;
  min-width: 220px;
  min-height: 220px;
  width: 100%;
  max-width: 350px;
}

.v-btn {
  &.v-btn {
    position: absolute;
  }
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card-scale {
  position: aboslute;
  top: 0;
  height: 0;
  padding-top: 100%;
}
</style>

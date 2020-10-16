<template>
  <div class="loading__wrapper">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<style lang="scss" scoped>
.loading__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .v-progress-circular {
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

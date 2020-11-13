<template>
  <div class="ml-auto">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon size="20" v-bind="attrs" v-on="on" class="ml-2 disabled-icon"
          >mdi-cancel</v-icon
        >
      </template>
      <span>Node is not a valid content type for addition</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.disabled-icon {
  color: #999;
  transform: translate(0, -1px);
}
</style>

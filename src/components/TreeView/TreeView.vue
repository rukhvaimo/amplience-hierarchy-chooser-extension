<template>
  <div class="am-taxonomy-tree__wrapper">
    <v-virtual-scroll
      class="am-taxonomy-tree__container"
      bench="5"
      :items="nodes"
      item-height="50"
    >
      <template v-slot:default="{ item }">
        <tree-node :node="item"></tree-node>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import TreeNode from "./TreeNode.vue";

export default Vue.extend({
  components: { TreeNode },
  data: () => ({
    nodes: [],
  }),
});
</script>

<style lang="scss" scoped></style>

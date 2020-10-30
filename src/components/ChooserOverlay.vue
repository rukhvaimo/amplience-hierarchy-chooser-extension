<template>
  <div>
    <v-toolbar flat dense class="tree-view">
      <p class="text-justify">
        Browse hierarchy and add content
      </p>
      <tree-view></tree-view>
      <v-btn depressed text @click="store.togglePanel">
        Cancel
      </v-btn>
      <v-btn depressed color="primary" @click="store.togglePanel">
        Add
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { Component, Vue } from "vue-property-decorator";
import { ContentItemModel } from "dc-extensions-sdk"; // eslint-disable-line no-unused-vars

import TreeView from "./TreeView/TreeView.vue";
import store from "@/store/DynamicContent";

@Observer
@Component({
  components: { TreeView },
})
export default class ChooserOverlay extends Vue {
  public store = store;
}
</script>

<style lang="scss">
.tree-view {
  .v-toolbar__content {
    display: flex;

    p {
      flex: 1;
      margin: 0;
    }
  }

  .v-btn {
    margin-left: 8px;
    min-width: 80px;
    text-transform: none;
  }
}
</style>

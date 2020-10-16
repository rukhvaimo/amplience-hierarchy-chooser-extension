<template>
  <v-toolbar flat dense class="tree-view">
    <p class="text-justify">
      Browse
    </p>
    <v-btn depressed text @click="togglePanel">
      Cancel
    </v-btn>
    <v-btn depressed color="primary" @click="togglePanel">
      Save
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { Component, Prop, Vue } from "vue-property-decorator";

import { ContentItemModel } from "dc-extensions-sdk"; // eslint-disable-line no-unused-vars

import store from "@/store/DynamicContent";

@Observer
@Component
export default class TreeView extends Vue {
  public store = store;
  public rootNode: ContentItemModel<{}> | null = null;

  @Prop(Function) togglePanel!: () => void;

  async created() {
    const rootNode = await this.store.fetchNode();

    this.rootNode = rootNode;
  }
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
    text-transform: none;
  }
}
</style>

<template>
  <div class="am-taxonomy-tree__wrapper">
    <v-virtual-scroll
      class="am-taxonomy-tree__container"
      bench="5"
      :items="treeStore.visibleNodes"
      item-height="50"
    >
      <template v-slot:default="{ item }">
        <tree-node :node="item"></tree-node>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Observer } from "mobx-vue";

import { compose, ifElse, isNil, not, when } from "ramda";
import TreeStore from "@/store/Tree";
import DynamicContentStore from "@/store/DynamicContent";
import Alert from "@/mixins/ShowAlert.mixin";
import TreeNode from "./TreeNode.vue";
import { notError } from "@/utils/helpers";
// eslint-disable-next-line no-unused-vars
import { HierarchyChildren, HierarchyNode } from "dc-management-sdk-js";

const loadTree: any = when(compose(not, isNil), TreeStore.loadTree);

@Observer
@Component({
  components: { TreeNode },
})
export default class TreeView extends mixins(Alert) {
  treeStore = TreeStore;

  created() {
    this.init();
  }

  async init() {
    const treeLoaded = ifElse(notError, this.setTree, () =>
      this.showAlert("Could not load tree")
    );

    treeLoaded(await this.loadTree());
  }

  async loadTree() {
    return await loadTree(DynamicContentStore.getNodeId());
  }

  setTree({
    children,
    ...node
  }: {
    children: HierarchyNode[];
    node: HierarchyNode;
  }) {
    TreeStore.setRootNode(node).setChildren(children);
    TreeStore.rootNode?.showChildren(true);
  }
}
</script>

<style lang="scss" scoped></style>

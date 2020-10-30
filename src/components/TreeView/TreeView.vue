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
import Component, { mixins } from "vue-class-component";
import { always, compose, ifElse, isNil, not, pipe, when } from "rambda";
import TreeStore from "@/store/Tree";
import { INode } from "@/store/Node";
import DynamicContentStore from "@/store/DynamicContent";
import Alert from "@/mixins/ShowAlert.mixin";
import TreeNode from "./TreeNode.vue";
import { ifNotError, isError } from "@/utils/helpers";

const loadTree = when(compose(not, isNil), TreeStore.loadTree);

// const setTree = ifElse(
//   isError,
//   ({ children, ...node }) => TreeStore.setRootNode(node).setChildren(children),
//   __
// );

@Component({
  components: { TreeNode },
  data: {
    nodes: [],
  },
})
export default class TreeView extends mixins(Alert) {
  created() {
    this.init();
  }

  async init() {
    const nodeId = DynamicContentStore.getNodeId();
    ifElse(ifNotError, this.setTree, () =>
      this.showAlert("Could not load tree")
    )(await loadTree(nodeId));
  }

  setTree({ children, ...node }: INode) {
    TreeStore.setRootNode(node).setChildren(children);
  }
}
</script>

<style lang="scss" scoped></style>

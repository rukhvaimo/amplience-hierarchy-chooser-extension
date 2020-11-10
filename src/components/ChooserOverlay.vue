<template>
  <div>
    <v-toolbar flat dense class="tree-view">
      <p class="text-left body-2 grey--text text--darken-2 mr-auto ">
        Browse hierarchy and add content...
      </p>
      <v-btn depressed text @click="store.togglePanel" class="text-capitalize">
        Cancel
      </v-btn>
      <v-btn
        depressed
        class="text-capitalize"
        :disabled="!tree.selectedNodes.length"
        color="primary"
        @click="add"
      >
        Add
        <v-expand-x-transition>
          <span v-if="tree.selectedNodes.length > 0">
            {{ " " }} ({{ tree.selectedNodes.length }})
          </span>
        </v-expand-x-transition>
      </v-btn>
    </v-toolbar>
    <tree-view></tree-view>
    <alert class="chooser-overlay__alert"></alert>
  </div>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { getSnapshot } from "mobx-state-tree";
import { Component, Vue } from "vue-property-decorator";
import { ContentItemModel } from "dc-extensions-sdk"; // eslint-disable-line no-unused-vars
import { CardModel } from "@/store/CardModel"; // eslint-disable-line no-unused-vars

import TreeView from "./TreeView/TreeView.vue";
import Alert from "./Alert.vue";

import store from "@/store/DynamicContent";
import TreeStore from "@/store/Tree";

@Observer
@Component({
  components: { Alert, TreeView },
})
export default class ChooserOverlay extends Vue {
  public store = store;
  public tree = TreeStore;
  add() {
    this.$emit("add", getSnapshot(this.tree.selectedNodes));
  }

  cancel() {
    this.store.togglePanel();
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
}
.chooser-overlay {
  &__alert {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>

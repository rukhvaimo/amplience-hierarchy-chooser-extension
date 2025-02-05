<template>
  <div class="chooser-overlay">
    <div v-if="!store.error" class="d-flex align-center px-6 pt-3">
      <h1
        class="text-truncate text-left body-2 grey--text text--darken-2 mr-auto"
      >
        Browse hierarchy and add content&hellip;
      </h1>
      <v-btn
        text
        @click="cancel"
        class="text-capitalize font-weight-regular"
        height="30"
      >
        Cancel
      </v-btn>
      <v-btn
        depressed
        class="text-capitalize font-weight-regular"
        :disabled="!tree.selectedNodes.length"
        color="primary"
        height="30"
        @click="add"
      >
        Add
        <v-expand-x-transition>
          <span v-if="tree.selectedNodes.length" class="ml-1">
            ({{ tree.selectedNodes.length }})
          </span>
        </v-expand-x-transition>
      </v-btn>
    </div>
    <tree-view v-if="!store.error"></tree-view>
  </div>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { reaction } from "mobx";
import { getSnapshot } from "mobx-state-tree";
import { Component, Emit, Mixins } from "vue-property-decorator";
import { ContentItemModel } from "dc-extensions-sdk"; // eslint-disable-line no-unused-vars
import { CardModel } from "@/store/CardModel"; // eslint-disable-line no-unused-vars

import TreeView from "./TreeView/TreeView.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Alert from "./Alert.vue";
import ShowAlert from "@/mixins/ShowAlert.mixin";

import store from "@/store/DynamicContent";
import TreeStore from "@/store/Tree";
import { ifElse, lte } from "ramda";

@Observer
@Component({
  components: { Alert, TreeView, ErrorBox },
})
export default class ChooserOverlay extends Mixins(ShowAlert) {
  public store = store;
  public tree = TreeStore;
  public watcher = reaction(
    () => this.tree.selectedNodes.length,
    this.checkLength
  );

  destroyed() {
    this.watcher();
  }

  @Emit("add")
  add() {
    return getSnapshot(this.tree.selectedNodes);
  }

  @Emit("cancel")
  cancel(e: Event) {
    return e;
  }

  checkLength(length: number) {
    ifElse(
      lte(this.store.remainingItems),
      () => {
        this.showAlert("Maximum number of content items has been reached");
        this.tree.disableTree();
      },
      this.tree.enableTree
    )(length);
  }
}
</script>

<style lang="scss">
.chooser-overlay {
  height: 100%;

  &__alert {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.v-navigation-drawer__content {
  overflow: hidden;
}
</style>

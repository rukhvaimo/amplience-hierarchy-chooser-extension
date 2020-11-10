<template>
  <div class="chooser-overlay">
    <v-toolbar flat dense class="tree-view" v-if="!store.error">
      <p class="truncate text-left body-2 grey--text text--darken-2 mr-auto ">
        Browse hierarchy and add content...
      </p>
      <v-btn depressed text @click="cancel" class="text-capitalize">
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
          <span v-if="tree.selectedNodes.length" class="ml-1">
            ({{ tree.selectedNodes.length }})
          </span>
        </v-expand-x-transition>
      </v-btn>
    </v-toolbar>
    <error-box
      v-if="store.error"
      :message="store.error.message"
      @action="cancel"
    ></error-box>
    <tree-view v-if="!store.error"></tree-view>
    <alert class="chooser-overlay__alert"></alert>
  </div>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { getSnapshot } from "mobx-state-tree";
import { Component, Emit, Vue } from "vue-property-decorator";
import { ContentItemModel } from "dc-extensions-sdk"; // eslint-disable-line no-unused-vars
import { CardModel } from "@/store/CardModel"; // eslint-disable-line no-unused-vars

import TreeView from "./TreeView/TreeView.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Alert from "./Alert.vue";

import store from "@/store/DynamicContent";
import TreeStore from "@/store/Tree";

@Observer
@Component({
  components: { Alert, TreeView, ErrorBox },
})
export default class ChooserOverlay extends Vue {
  public store = store;
  public tree = TreeStore;

  @Emit("add")
  add() {
    return getSnapshot(this.tree.selectedNodes);
  }

  @Emit("cancel")
  cancel(e: Event) {
    return e;
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

.truncate {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
.chooser-overlay {
  height: 100%;

  &__alert {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>

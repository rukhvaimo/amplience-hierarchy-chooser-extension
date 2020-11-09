<template>
  <div>
    <v-toolbar flat dense class="tree-view">
      <h1 class="text-left body-2 grey--text text--darken-2 mr-auto">
        Browse hierarchy and add content
      </h1>
      <v-btn text small @click="store.togglePanel">
        Cancel
      </v-btn>
      <v-btn
        depressed
        small
        :disabled="!tree.selectedNodes.length"
        color="primary"
        @click="add"
      >
        Add
        <v-expand-x-transition>
          <span v-if="tree.selectedNodes.length">
            ({{ tree.selectedNodes.length }})
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { ContentItemModel } from "dc-extensions-sdk"; // eslint-disable-line no-unused-vars
import { CardModel } from "@/store/CardModel"; // eslint-disable-line no-unused-vars

import TreeView from "./TreeView/TreeView.vue";
import Alert from "./Alert.vue";

import store from "@/store/DynamicContent";
import TreeStore from "@/store/Tree";
import { noop } from "vue-class-component/lib/util";

@Observer
@Component({
  components: { Alert, TreeView },
})
export default class ChooserOverlay extends Vue {
  public store = store;
  public tree = TreeStore;

  @Prop({ type: Function, default: noop }) add!: () => void;
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

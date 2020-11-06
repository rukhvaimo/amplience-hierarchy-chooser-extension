<template>
  <div>
    <v-toolbar flat dense class="tree-view">
      <p class="text-justify">
        Browse hierarchy and add content
      </p>
      <v-btn depressed text @click="store.togglePanel">
        Cancel
      </v-btn>
      <v-btn
        depressed
        :disabled="tree.selectedNodes.length === 0"
        color="primary"
        @click="add"
      >
        Add
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

  .v-btn {
    margin-left: 8px;
    min-width: 80px;
    text-transform: none;
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

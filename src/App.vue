<template>
  <v-app>
    <v-sheet
      class="app"
      :class="{
        'is-readonly': store.isReadOnly,
        'is-panel-open': store.panelOpen,
      }"
    >
      <v-row class="px-3">
        <p>{{ store.title }}</p>
      </v-row>

      <draggable
        v-if="!store.loading"
        v-model="store.listModel"
        class="row"
        :move="isDraggable"
        handle=".is-edit:not(.is-last),.is-new:not(.is-last)"
      >
        <v-col
          cols="auto"
          v-for="value in store.model"
          :key="value.contentItem.id || value.index"
        >
          <card :value="value" v-if="store.cardType !== 'CHIP'"></card>
          <chip :value="value" v-if="store.cardType === 'CHIP'"> </chip>
        </v-col>
      </draggable>

      <v-navigation-drawer
        v-model="store.panelOpen"
        absolute
        temporary
        right
        @input="onPanelChange"
        width="95vw"
      >
        <chooser-overlay v-if="store.panelOpen" @add="add" @cancel="cancel" />
      </v-navigation-drawer>
    </v-sheet>
  </v-app>
</template>

<script lang="ts">
import draggable, { MoveEvent } from "vuedraggable"; // eslint-disable-line no-unused-vars

import { equals } from "ramda";
import { Observer } from "mobx-vue";
import { Component, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";
import Chip from "@/components/Chip.vue";
import Loading from "@/components/Loading.vue";
import ChooserOverlay from "@/components/ChooserOverlay.vue";

import TreeStore from "@/store/Tree";

import store, { CardType } from "@/store/DynamicContent"; // eslint-disable-line no-unused-vars

import { CardModel, EmptyItem } from "./store/CardModel"; // eslint-disable-line no-unused-vars

@Observer
@Component({
  components: {
    Card,
    Chip,
    Loading,
    ChooserOverlay,
    draggable,
  },
})
export default class App extends Vue {
  public store = store;
  public tree = TreeStore;
  public originalModel!: Array<CardModel>;

  async created() {
    this.init();
  }

  async init() {
    await store.initialize();
  }

  async onPanelChange(open: Boolean) {
    if (open) {
      const OVERLAY_HEIGHT = 500;
      this.store.autoSizeComponent(false);
      this.store.setComponentHeight(OVERLAY_HEIGHT);
      this.originalModel = [...this.store.model];
    } else {
      this.store.autoSizeComponent(true);
      this.tree.clearSelectedNodes();

      const model = this.store.exportModel(this.originalModel);
      const value = await this.store.dcExtensionSdk.field.getValue();

      if (equals(model, value)) {
        return;
      }

      this.store.updateList(this.originalModel);
    }
  }

  async add() {
    const nodes = this.tree.selectedNodes;
    const oldValues = this.store.model.map((node) => node.toJSON());
    const newValues = nodes.map((node) => node.toJSON());

    if (!nodes.length) {
      return this.store.togglePanel();
    }

    try {
      const updatedValue = [oldValues, newValues]
        .flat()
        .filter((item) => !(item as EmptyItem)._empty);

      const model = await store.createModel(updatedValue);

      await this.store.updateList(model);
      this.originalModel = [...this.store.model];
    } catch (err) {
      this.originalModel = [...this.store.model];
    } finally {
      this.store.togglePanel();
    }
  }

  cancel() {
    this.store.togglePanel();
  }

  isDraggable($event: MoveEvent<HTMLElement>) {
    const to = this.store.model[$event.draggedContext.futureIndex];
    const from = this.store.model[$event.draggedContext.index];

    return !(this.store.isLast(to) || this.store.isLast(from));
  }
}
</script>

<style lang="scss">
html {
  overflow: hidden;
}

.app {
  padding-left: 1px;
}

.is-readonly {
  pointer-events: none;
  opacity: 0.9;
}
.v-btn {
  letter-spacing: normal;
}

.is-panel-open {
  height: 500px;
  overflow: hidden;
}
</style>

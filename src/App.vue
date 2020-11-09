<template>
  <v-app>
    <v-sheet class="app" :class="{ 'is-readonly': store.isReadOnly }">
      <v-row class="title-row">
        <p>{{ store.title }}</p>
      </v-row>

      <error-box v-if="store.error" :message="store.error.message"></error-box>

      <draggable
        v-model="store.listModel"
        v-if="!store.error"
        class="row"
        :move="isDraggable"
        handle=".is-edit:not(.is-last),.is-new:not(.is-last)"
      >
        <v-col cols="auto" v-for="value in store.model" :key="value.id">
          <card :value="value"></card>
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
        <chooser-overlay v-if="store.panelOpen" @add="add" />
      </v-navigation-drawer>
    </v-sheet>
  </v-app>
</template>

<script lang="ts">
import draggable, { MoveEvent } from "vuedraggable"; // eslint-disable-line no-unused-vars

import { clone } from "ramda";
import { Observer } from "mobx-vue";
import { Component, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";
import Loading from "@/components/Loading.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import ChooserOverlay from "@/components/ChooserOverlay.vue";
import TreeStore from "@/store/Tree";

import store from "@/store/DynamicContent";

import { CardModel } from "./store/CardModel"; // eslint-disable-line no-unused-vars

@Observer
@Component({
  components: {
    Card,
    Loading,
    ErrorBox,
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

  onPanelChange(open: Boolean) {
    if (open) {
      this.originalModel = clone(this.store.model);
    } else {
      this.store.updateList(this.originalModel);
    }
    this.tree.clearSelectedNodes();
  }

  async add() {
    const nodes = this.tree.selectedNodes;
    const value = nodes.map((node) => node.toJSON());

    if (!nodes.length) {
      return this.store.togglePanel();
    }

    const model = await store.createModel(value);

    await this.store.updateList(model);

    this.originalModel = clone(this.store.model);

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
.app {
  font-family: "Roboto", sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 16px;
  height: 100%;
}

.is-readonly {
  pointer-events: none;
  opacity: 0.9;
}

.title-row {
  padding: 0 12px;
}
</style>

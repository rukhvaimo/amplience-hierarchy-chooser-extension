<template>
  <v-app>
    <v-sheet
      class="app"
      :class="{
        'is-readonly': store.isReadOnly,
        'is-panel-open': store.panelOpen,
        'is-small': store.cardType === 'small',
        'is-large': store.cardType === 'large',
        'is-chip': store.cardType === 'chip',
        'is-dragging': isDragging,
      }"
    >
      <div class="v-chip__title">
        <h1 class="px-3 text-body-1">{{ store.title }}</h1>
        <v-btn
            @click="store.togglePanel()"
            class="v-chip v-chip--clickable v-chip--no-color theme--light v-size--small is-last is-new add"
            :disabled="store.model.length >= store.maxItems">
        <span class="v-chip__content">
          <i aria-hidden="true" class="v-icon notranslate v-chip__add-icon mdi mdi-plus theme--light"></i>
        </span>
      </v-btn>
      </div>
      <draggable
        v-if="!store.loading"
        v-model="store.listModel"
        class="row"
        :move="isDraggable"
        handle=".is-edit:not(.is-last),.is-new:not(.is-last)"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <v-col cols="auto" v-for="value in store.model" :key="value.index">
          <card :value="value" v-if="store.cardType !== 'chip'"></card>
          <chip :value="value" v-if="store.cardType === 'chip'"> </chip>
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
import { ContentItemModel } from "./store/FieldModel"; // eslint-disable-line no-unused-vars

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
  public isDragging = false;
  public originalModel!: Array<CardModel>;

  created() {
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

      try {
        await this.store.updateList(this.originalModel);
      } catch (err) {
        console.info("Invalid model value");
      }
    }
  }

  async add() {
    const nodes = this.tree.selectedNodes;
    const oldValues = this.store.model.map((node) => node.export());
    const newValues = nodes.map((node) => node.export()) as ContentItemModel[];

    if (!nodes.length) {
      return this.store.togglePanel();
    }

    try {
      const updatedValue = [oldValues, newValues].flat()

      const model = await store.createModel(updatedValue);

      await this.store.updateList(model);
      this.originalModel = [...this.store.model];
    } catch (err) {
      this.originalModel = [...this.store.model];
      console.info("Invalid model value");
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

.v-application--wrap {
  min-height: 100px;
}

.app {
  padding-left: 5px;
}

.v-btn {
  letter-spacing: normal;
}

.is-readonly {
  pointer-events: none;
  opacity: 0.9;
}

.is-panel-open {
  height: 500px;
  overflow: hidden;
}

.is-chip .col {
  padding: 8px;
}

.is-small .col {
  padding: 10px;
}

.is-dragging .v-chip {
  pointer-events: none;
}

.v-chip {
  transition: all 0.3s;
  &.is-new {
    .theme--light & {
      background-color: var(--v-primary-base);
      &:hover {
        background-color: #1ab0f0;
      }
    }
  }
  &__title {
    display: flex;
    align-items: center;
  }
  &.add {
    background-color: #1ab0f0!important;
  }
}
</style>

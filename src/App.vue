<template>
  <v-app>
    <v-sheet class="app" :class="{ 'is-readonly': store.isReadOnly }">
      <v-row class="title-row">
        <p>{{ store.title }}</p>
      </v-row>

      <draggable
        v-model="store.listModel"
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
        width="95vw"
      >
        <chooser-overlay v-if="store.panelOpen" />
      </v-navigation-drawer>
    </v-sheet>
    <v-alert
      dark
      dismissible
      close-text="Close"
      icon="mdi-alert-outline"
      transition="fade-transition"
      v-model="alertVisible"
      >{{ alertText }}</v-alert
    >
  </v-app>
</template>

<script lang="ts">
import draggable, { MoveEvent } from "vuedraggable"; // eslint-disable-line no-unused-vars

import { Observer } from "mobx-vue";
// import {reaction} from 'mobx-state-tree';
import Global from "@/store/Global";
import { Component, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";
import Loading from "@/components/Loading.vue";
import ChooserOverlay from "@/components/ChooserOverlay.vue";

import store, { ContentItemModel } from "@/store/DynamicContent"; // eslint-disable-line no-unused-vars
import { CardModel } from "@/store/CardModel"; // eslint-disable-line no-unused-vars

@Observer
@Component({
  components: {
    Card,
    Loading,
    ChooserOverlay,
    draggable,
  },
  computed: {
    alertText() {
      return Global.alertText;
    },
    alertVisible: {
      get() {
        return Global.alertVisible;
      },
      set(visible: boolean) {
        Global.showAlert(visible);
      },
    },
  },
})
export default class App extends Vue {
  public store = store;

  async created() {
    this.init();
  }

  async init() {
    await store.initialize();
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
  height: 500px;
}

.is-readonly {
  pointer-events: none;
  opacity: 0.9;
}

.title-row {
  padding: 0 12px;
}
</style>

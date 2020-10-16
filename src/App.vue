<template>
  <v-app>
    <loading v-if="store.loading" />
    <v-sheet class="app" v-show="!store.loading">
      <card v-on:add="togglePanel" />
      <v-navigation-drawer
        v-model="overlay"
        absolute
        temporary
        right
        width="95vw"
      >
        <tree-view v-if="overlay" :toggle-panel="togglePanel" />
      </v-navigation-drawer>
    </v-sheet>
  </v-app>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { Component, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";
import Loading from "@/components/Loading.vue";
import TreeView from "@/containers/TreeView.vue";

import store from "@/store/DynamicContent";

@Observer
@Component({
  components: {
    Card,
    Loading,
    TreeView,
  },
})
export default class App extends Vue {
  public store = store;

  public overlay: Boolean = false;

  public togglePanel() {
    this.overlay = !this.overlay;
  }
}
</script>

<style lang="scss">
.app {
  font-family: "Roboto", sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 16px;
}
</style>

<template>
  <div>
    <div
      class="am-taxonomy-tree-node"
      :style="{
        'padding-left': paddingLeft,
      }"
      :class="{
        'is-root': node.isRoot,
        'is-last': node.isLast,
        'is-selected': isSelected,
        'is-disabled': isDisabled,
      }"
    >
      <div class="am-taxonomy-tree-node__wrapper">
        <div
          class="am-taxonomy-tree-node__item am-taxonomy-tree-node__item--active"
          :click="setActive"
        >
          <div
            v-if="!node.isRoot"
            class="am-taxonomy-tree-node__connector"
          ></div>
          <div class="am-taxonomy-tree-node__toggle-btn-wrapper">
            <v-btn
              class="am-taxonomy-tree-node__toggle-btn"
              @click="toggleChildren"
              v-if="node.hasChildren"
              aria-label="Toggle children"
              icon
            >
              <v-icon
                class="am-taxonomy-tree-node__toggle-btn-icon"
                v-if="!loadingChildren"
              >
                mdi-chevron-right
              </v-icon>
              <v-progress-circular indeterminate v-else></v-progress-circular>
            </v-btn>
          </div>
          <div class="am-taxonomy-tree-node__label text-truncate">
            {{ node.label }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-repeat="level in nestingLevels"
      :key="level"
      v-if="!node.isRoot"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  computed: {
    paddingLeft() {
      return "0";
    },
    isDisabled() {
      false;
    },
    isSelected() {
      return false;
    },
    loadingChildren() {
      return false;
    },
    nestingLevels() {
      return [];
    }
  },
})
export default class TreeNode extends Vue {
  setActive() {},
  toggleChildren() {}
}
</script>

<style></style>

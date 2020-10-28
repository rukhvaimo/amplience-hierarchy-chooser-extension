<template>
  <div>
    <div
      class="am-taxonomy-tree-node"
      :style="{
        'padding-left': paddingLeft,
      }"
      :class="{
        'is-root': isRoot,
        'is-last': isLast,
        'is-selected': isSelected,
        'is-disabled': isDisabled,
      }"
    >
      <div class="am-taxonomy-tree-node__wrapper">
        <div
          class="am-taxonomy-tree-node__item am-taxonomy-tree-node__item--active"
          :click="setActive"
        >
          <div v-if="!isRoot" class="am-taxonomy-tree-node__connector"></div>
          <div class="am-taxonomy-tree-node__toggle-btn-wrapper">
            <md-button
              class="md-icon-button am-taxonomy-tree-node__toggle-btn"
              @click="toggleChildren"
              v-if="hasChildren"
              aria-label="Toggle children"
            >
              <v-icon
                class="am-taxonomy-tree-node__toggle-btn-icon"
                v-if="!loadingChildren"
              >
                mdi-chevron-right
              </v-icon>
              <!-- <am-spinner class="am-taxonomy-tree-node__loader" ng-if="$ctrl.loadingChildren"></am-spinner> -->
            </md-button>
          </div>
          <div
            class="am-taxonomy-tree-node__label text-truncate"
            v-if="!$ctrl.isEditing || $ctrl.isDisabled"
          >
            {{ node.label }}
          </div>
        </div>
      </div>
    </div>
    <div v-repeat="level in nestingLevels" :key="level" v-if="!isRoot"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {},
});
</script>

<style></style>

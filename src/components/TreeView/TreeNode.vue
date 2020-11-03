<template>
  <div
    class="taxonomy-tree-node"
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
    <div class="taxonomy-tree-node__wrapper">
      <div class="taxonomy-tree-node__item" :click="select">
        <div v-if="!node.isRoot" class="taxonomy-tree-node__connector"></div>
        <div class="taxonomy-tree-node__toggle-btn-wrapper">
          <v-btn
            class="taxonomy-tree-node__toggle-btn"
            @click="toggleChildren"
            v-if="node.hasChildren"
            aria-label="Toggle children"
            icon
          >
            <v-icon
              class="taxonomy-tree-node__toggle-btn-icon"
              v-if="!loadingChildren"
            >
              mdi-chevron-right
            </v-icon>
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </v-btn>
        </div>
        <div class="taxonomy-tree-node__label text-truncate">
          {{ node.label }}
        </div>
      </div>
    </div>
    <div v-for="level in nestingLevels" :key="level"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Observer } from "mobx-vue";
import TreeStore from "@/store/Tree";
import { multiply, range } from "ramda";

@Observer
@Component({
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  computed: {
    paddingLeft() {
      const PADDING = 31;
      //@ts-ignore
      return `${multiply(this.node.nestingLevel, PADDING)}px`;
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
      //@ts-ignore
      return range(0, this.node.nestingLevel);
    },
  },
})
export default class TreeNode extends Vue {
  treeStore = TreeStore;
  select() {
    // this.treeStore.selectNode(this.node.id);
  }
  toggleChildren() {}
}
</script>

<style lang="scss" scoped>
.taxonomy-tree-node {
  padding-bottom: 18px;
  min-height: 50px;
  max-width: 100%;
  will-change: transform, opacity;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;

  &__wrapper {
    position: relative;
  }

  &__item {
    height: 32px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    border: 2px solid transparent;
    outline: none;
    background: #e5e5e5;
    min-width: 160px;
    position: relative;
    z-index: 1;

    color: #666666;
    user-select: none;
    .taxonomy-tree-node:not(.is-disabled):hover & {
      background-color: rgba(#039be5, 0.2);
      color: #039be5;
      cursor: pointer;
      am-publish-status am-status-icon md-icon {
        fill: #039be5;
      }
    }

    .is-disabled & {
      background-color: rgba(#e5e5e5, 0.8);
      color: #999;
      am-publish-status am-status-icon md-icon {
        fill: #999;
      }
    }

    am-publish-status am-status-icon {
      background-color: transparent;
      md-icon {
        transition: fill 0.3s;
        fill: #666666;
      }
    }
  }
  &__connector {
    position: absolute;
    left: -29px;
    height: 50px;
    width: 27px;
    top: -16px;
    user-select: none;
    &::before {
      content: "";
      display: block;
      width: 12px;
      height: 1px;
      border-bottom: 1px solid #ccc;
      position: absolute;
      right: 4px;
      top: 28px;
      .level-active & {
        border-bottom: 1px solid #1ab0f9;
      }
      .level-disabled & {
        border-bottom: 1px dashed #ccc;
        opacity: 0.5;
      }
    }
    &::after {
      content: "";
      transition: all 0.3s;
      border-left: 1px solid #ccc;
      width: 1px;
      position: absolute;
      right: 15px;
      height: 100%;
      .drag-active & {
        border-left: 1px dashed #1ab0f9;
      }
      .level-active & {
        border-left: 1px solid #1ab0f9;
      }
      .level-disabled & {
        border-left: 1px dashed #ccc;
        opacity: 0.5;
      }
    }

    .is-root & {
      display: none;
    }

    .is-last & {
      height: 30px !important;
    }
  }

  &__label {
    transform: translate(0, -1px);
    margin-left: 5px;
    min-width: 60px;
  }
}
</style>

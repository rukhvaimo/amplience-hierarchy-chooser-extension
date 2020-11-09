<template>
  <div
    class="tree-node"
    :style="{
      'padding-left': paddingLeft,
    }"
    :class="{
      'children-hidden': !node.childrenVisible,
      'is-root': node.isRoot,
      'is-last': node.isLast,
      'is-selected': isSelected,
      'is-disabled': isDisabled,
    }"
  >
    <v-icon v-if="isDisabled" small class="mr-2">
      mdi-cancel
    </v-icon>
    <v-checkbox
      v-else-if="!node.isRoot"
      v-model="isSelected"
      color="primary"
      @click="select(isSelected)"
      class="ma-0 tree-node__checkbox"
    ></v-checkbox>
    <v-tooltip
      bottom
      :activator="$refs.node"
      v-model="tooltipVisible"
      v-if="isDisabled"
    >
      Node is not a valid content type for addition.
    </v-tooltip>
    <div
      class="tree-node__item"
      @click="select(!isSelected)"
      @mouseover="showTooltip"
      @mouseleave="hideTooltip"
      ref="node"
    >
      <div v-if="!node.isRoot" class="tree-node__connector"></div>
      <div class="tree-node__toggle-btn-wrapper">
        <v-btn
          class="tree-node__toggle-btn"
          @click.stop="toggleChildren"
          v-if="node.hasChildren"
          aria-label="Toggle children"
          icon
        >
          <v-fade-transition mode="out-in">
            <span v-if="loadingChildren">
              <v-progress-circular
                indeterminate
                :size="16"
                color="grey"
                width="2"
              ></v-progress-circular>
            </span>
            <span v-else>
              <v-icon class="tree-node__toggle-btn-icon">
                mdi-chevron-right
              </v-icon>
            </span>
          </v-fade-transition>
        </v-btn>
      </div>
      <div class="tree-node__label text-truncate">
        {{ node.label }}
      </div>
    </div>
    <div
      v-for="level in nestingLevels"
      :key="level"
      class="tree-node__level"
    ></div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Observer } from "mobx-vue";
import {
  __,
  always,
  compose,
  concat,
  ifElse,
  includes,
  multiply,
  not,
  pipe,
  range,
  toString,
  when,
} from "ramda";
import TreeStore from "@/store/Tree";
import DynamicContent from "@/store/DynamicContent";
import { hasChildren } from "@/utils/tree";
import { notError } from "@/utils/helpers";
import Alert from "@/mixins/ShowAlert.mixin";

@Observer
@Component({
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  computed: {
    paddingLeft(): string {
      const PADDING = 26;
      return pipe(
        multiply(PADDING),
        toString,
        concat(__, "px")
        //@ts-ignore
      )(this.node.nestingLevel);
    },
    isDisabled() {
      return compose(
        not,
        includes(
          __,
          //@ts-ignore
          this.dynamicContent.allowedTypes
        )
        //@ts-ignore
      )(this.node.contentTypeUri);
    },
    nestingLevels(): number[] {
      //@ts-ignore
      return range(0, this.node.nestingLevel - 1);
    },
  },
  data: () => ({
    allowedTypes: [],
    isSelected: false,
    loadingChildren: false,
    tooltipVisible: false,
  }),
  created() {
    //@ts-ignore
    this.isSelected = this.treeStore.isSelected(this.node.id);
  },
})
export default class TreeNode extends mixins(Alert) {
  treeStore = TreeStore;
  dynamicContent = DynamicContent;
  hideTooltip() {
    //@ts-ignore
    when(always(this.isDisabled), () => {
      //@ts-ignore
      this.tooltipVisible = false;
    });
  }
  async loadChildren() {
    //@ts-ignore
    this.loadingChildren = true;

    ifElse(
      notError,
      this.toggleChildren,
      compose(this.showAlert, always("Could not load children"))
      //@ts-ignore
    )(await this.node.loadChildren());

    //@ts-ignore
    this.loadingChildren = false;
  }
  select(selected: boolean) {
    //@ts-ignore
    this.isSelected = selected;
    ifElse(
      always(selected),
      this.treeStore.selectNode,
      this.treeStore.deselctNode
      //@ts-ignore
    )(this.node.id);
  }
  showTooltip() {
    //@ts-ignore
    when(always(this.isDisabled), () => {
      //@ts-ignore
      this.tooltipVisible = true;
    });
  }
  toggleChildren() {
    ifElse(
      hasChildren,
      (node) => node.showChildren(!node.childrenVisible),
      this.loadChildren
      //@ts-ignore
    )(this.node);
  }
}
</script>

<style lang="scss" scoped>
.tree-node {
  padding-bottom: 18px;
  height: 50px;
  max-width: 100%;
  will-change: transform, opacity;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;

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
    padding-right: 15px;
    z-index: 1;

    color: #666666;
    user-select: none;
    .tree-node:not(.is-disabled):hover & {
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

    .is-selected & {
      background-color: #1ab0f9;
      color: white;
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
    left: -53px;
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
      top: 30px;
    }
    &::after {
      content: "";
      transition: all 0.3s;
      border-left: 1px solid #ccc;
      width: 1px;
      position: absolute;
      right: 15px;
      height: 100%;
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

  &__toggle-btn-icon {
    transition: all 0.3s;
    transform: rotate(90deg);
    .children-hidden & {
      transform: none;
    }

    .is-selected &,
    .is-disabled.is-selected & {
      color: white;
    }

    .tree-node:not(.is-disabled):hover & {
      color: #039be5;
    }
  }

  &__level {
    display: block;
    position: absolute;
    top: -14px;
    left: -1px;
    width: 40px;
    height: 50px;
    user-select: none;
    &::before {
      content: "";
      position: absolute;
      left: 19px;
      height: 50px;
      width: 1px;
      border-left: 1px solid #ccc;
      pointer-events: none;
      transition: all 0.3s;
    }
  }

  &__checkbox {
    transform: translate(7px, 9px);
  }
}
</style>

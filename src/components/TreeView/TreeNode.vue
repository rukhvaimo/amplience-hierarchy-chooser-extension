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
      'is-disabled': isInvalid || preventSelection,
      'is-invalid': isInvalid,
      'has-children': node.hasChildren,
    }"
  >
    <v-checkbox
      v-if="!isInvalid"
      v-model="isSelected"
      color="primary"
      @click="select(isSelected)"
      class="ma-0 tree-node__checkbox"
      :disabled="preventSelection"
    ></v-checkbox>
    <div class="tree-node__item" @click="select(!isSelected)" ref="node">
      <div v-if="!node.isRoot" class="tree-node__connector"></div>
      <div class="tree-node__toggle-btn-wrapper">
        <v-btn
          class="tree-node__toggle-btn"
          @click.stop="toggleChildren"
          v-if="node.hasChildren"
          aria-label="Toggle children"
          icon
          small
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
      <div class="body-2 text-left text-truncate tree-node__label">
        {{ node.label }}
      </div>
      <status-icon
        :status="node.publishingStatus"
        v-if="showStatusIcon"
      ></status-icon>
    </div>

    <div
      v-for="level in nestingLevels"
      :key="level"
      class="tree-node__level"
      :style="{
        left: getPadding(level),
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { reaction } from "mobx";
import { Observer } from "mobx-vue";
import {
  __,
  always,
  and,
  compose,
  forEach,
  gte,
  equals,
  ifElse,
  includes,
  length,
  not,
  nth,
  pipe,
  propEq,
  range,
  reject,
  subtract,
  when,
  where,
} from "ramda";
import TreeStore from "@/store/Tree";
// eslint-disable-next-line no-unused-vars
import { INode } from "@/store/Node";
import DynamicContent from "@/store/DynamicContent";
import { hasChildren } from "@/utils/tree";
import { notError } from "@/utils/helpers";
import { getPadding } from "@/utils/tree";
import Alert from "@/mixins/ShowAlert.mixin";
import StatusIcon from "./StatusIcon.vue";

@Observer
@Component({
  components: {
    StatusIcon,
  },
})
export default class TreeNode extends Mixins(Alert) {
  @Prop({ type: Object, required: true })
  node!: INode;

  get paddingAmount() {
    return this.isInvalid ? 56 : 26;
  }

  get paddingLeft(): string {
    return getPadding(this.paddingAmount, this.node.nestingLevel);
  }
  get isInvalid() {
    return compose(
      not,
      includes(
        __,

        this.dynamicContent.allowedTypes
      )
    )(this.node.contentTypeUri);
  }
  get nestingLevels(): number[] {
    //@ts-ignore
    const isLast = pipe(nth(__, this.node.path), propEq("isLast", true));

    return pipe(
      range(0),
      //@ts-ignore
      reject(isLast)
      //@ts-ignore
    )(this.node.nestingLevel);
  }
  get selected(): object[] {
    //@ts-ignore
    return this.treeStore.selectedNodes;
  }

  get showStatusIcon(): boolean {
    //@ts-ignore
    return not(equals(this.node.publishingStatus, "NONE"));
  }

  treeStore = TreeStore;
  dynamicContent = DynamicContent;
  allowedTypes: string[] = [];
  isSelected: boolean = false;
  loadingChildren: boolean = false;
  preventSelection: boolean = false;
  tooltipVisible: boolean = false;
  watchers: Function[] = [];

  created() {
    this.isSelected = this.treeStore.isSelected(this.node.id);
    this.watchers = [
      reaction(
        () => this.treeStore.selectedNodes.length,
        () => {
          this.preventSelection = and(
            not(this.isSelected),
            pipe(
              //@ts-ignore
              length,
              gte(__, this.dynamicContent.remainingItems)
              //@ts-ignore
            )(this.treeStore.selectedNodes)
          );
        },
        { fireImmediately: true }
      ),
    ];
  }

  destroyed() {
    forEach((watcher) => watcher(), this.watchers);
  }

  getPadding(nestingLevel: number) {
    return pipe(
      subtract(__, 1),
      //@ts-ignore
      getPadding(this.paddingAmount)
      //@ts-ignore
    )(nestingLevel);
  }

  async loadChildren() {
    this.loadingChildren = true;

    ifElse(notError, this.toggleChildren, () =>
      this.showAlert("Could not load children")
    )(await this.node.loadChildren());

    this.loadingChildren = false;
  }
  select(selected: boolean) {
    when(
      where({
        isInvalid: equals(false),
        preventSelection: equals(false),
      }),
      () => {
        this.isSelected = selected;
        ifElse(
          always(selected),
          this.treeStore.selectNode,
          this.treeStore.deselctNode
        )(this.node.id);
      }
    )({
      isInvalid: this.isInvalid,
      preventSelection: this.preventSelection,
    });
  }

  toggleChildren() {
    ifElse(
      hasChildren,
      (node) => node.showChildren(!node.childrenVisible),
      this.loadChildren
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
    padding: 0 10px 0 28px;
    z-index: 1;
    color: #666666;
    user-select: none;

    .tree-node:not(.is-disabled):hover & {
      background-color: rgba(#039be5, 0.2);
      color: #039be5;
      cursor: pointer;
    }

    .is-disabled & {
      background-color: rgba(#e5e5e5, 0.8);
      color: #999;
    }

    .is-selected & {
      background-color: #1ab0f9;
      color: white;
    }
    .has-children & {
      padding-left: 0;
    }
  }
  &__connector {
    position: absolute;
    left: -53px;
    height: 57px;
    width: 27px;
    top: -23px;
    user-select: none;

    &::before {
      content: "";
      display: block;
      width: 12px;
      height: 1px;
      border-bottom: 1px solid #ccc;
      position: absolute;
      right: 4px;
      top: 37px;
      .is-invalid & {
        top: 30px;
        right: -20px;
        width: 35px;
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
    }

    .is-root & {
      display: none;
    }

    .is-last & {
      height: 37px;
    }

    .is-invalid & {
      top: -16px;
      height: 50px;
    }

    .is-last.is-invalid & {
      height: 31px;
    }
  }

  &__label {
    transform: translate(0, -1px);
    min-width: 60px;
  }

  &__toggle-btn-icon {
    transition: transform 0.3s;
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
    width: 1px;
    height: 50px;
    user-select: none;
    margin-left: 18px;
    border-left: 1px solid #ccc;
    .is-invalid & {
      margin-left: 16px;
    }
  }

  &__checkbox {
    transform: translate(7px, 9px);
  }
}
</style>

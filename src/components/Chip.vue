<template>
  <v-chip
    small
    :close="!value.isEmpty()"
    :class="{
      'is-last': store.isLast(value),
      'is-edit': isEdit,
      'is-new': !isEdit,
    }"
    :ripple="false"
    close-icon="mdi-window-close"
    @click:close="store.removeItem(value.index)"
    @click="!isEdit ? store.togglePanel() : noop"
  >
    <v-tooltip
      v-if="!value.isEmpty()"
      content-class="chip-tooltip"
      :bottom="true"
      :disabled="hideTooltip"
      :open-on-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on" @mousedown="setHideTooltip(true)">{{
          label
        }}</span>
      </template>

      <span v-for="(item, index) in tooltip" :key="index">{{ item }}</span>
    </v-tooltip>
    <span v-if="value.isEmpty() && !store.isLast(value)">{{
      value.index + 1
    }}</span>
    <span class="v-chip__add" v-if="value.isEmpty() && store.isLast(value)">
      Add
    </span>
    <v-icon class="v-chip__add-icon">mdi-plus</v-icon>
  </v-chip>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { CardModel } from "@/store/CardModel"; // eslint-disable-line no-unused-vars
import { ContentItemModel } from "@/store/FieldModel"; // eslint-disable-line no-unused-vars

import store from "@/store/DynamicContent";

@Observer
@Component
export default class Chip extends Vue {
  public store = store;
  public noop = () => {};
  public hideTooltip: boolean = false;
  public label: string = "";

  @Prop(Object) value!: CardModel;

  get isEdit() {
    return !this.value.isEmpty();
  }

  get isDisabled() {
    return this.value.index === this.store.maxItems;
  }

  get tooltip() {
    if (this.isEdit) {
      return [...this.value.path, this.label];
    }

    return [];
  }

  setHideTooltip(value: boolean) {
    this.hideTooltip = value;

    setTimeout(() => (this.hideTooltip = false), 100);
  }

  @Watch("value.contentItem", { immediate: true })
  async fetchLabel(val: ContentItemModel, old: ContentItemModel) {
    if (this.isEdit && (!this.label || val.id !== old.id)) {
      const { label } = await this.store.dcManagementSdk.contentItems.get(
        (this.value.contentItem as ContentItemModel).id
      );

      this.label = label;
    }
  }
}
</script>

<style lang="scss">
.theme--light {
  .v-chip {
    min-width: 48px;
    padding: 0 4px;
    font-weight: 700;

    .v-chip__content {
      width: 100%;
      color: white;
      justify-content: center;

      .v-icon {
        color: white;
      }
    }

    &__add {
      margin-right: 4px;
    }

    &__content {
      padding: 0 4px;
    }

    &.is-new:not(.is-last) {
      background-color: rgba(0, 0, 0, 0.12);

      .v-chip__add-icon {
        display: none;
      }
    }

    &.is-edit {
      background-color: #f2f2f2;

      .v-chip__content {
        font-weight: 400;
        color: #7f7f77;
      }

      .v-chip__close {
        color: #7f7f7f;
      }

      .v-chip__add-icon {
        display: none;
      }
    }

    &.is-last {
      background-color: #bfbfbf;
    }

    &.is-new:hover {
      background-color: var(--v-primary-base);
    }
  }

  .chip-tooltip {
    height: auto;
    word-break: break-all;

    & > span:not(:last-child)::after {
      content: " / ";
    }

    & > span:last-child {
      font-weight: 700;
    }
  }
}
</style>

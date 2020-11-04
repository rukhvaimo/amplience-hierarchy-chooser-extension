<template>
  <v-breadcrumbs :items="crumbs" divider="/" ref="breadcrumbs">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item>
        {{ item.hidden ? "..." : item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import { pipe } from "ramda";
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";

export interface BreadcrumbModel {
  text: string;
  hidden: Boolean;
  width: number;
}

type BreadcrumbReducer = {
  crumbs: Array<BreadcrumbModel>;
  crumbsWidth: number;
};

@Component
export default class Breadcrumbs extends Vue {
  private crumbs: Array<BreadcrumbModel> = [];
  private handleCrumbs = pipe(this.measure, this.collapse);

  @Ref("breadcrumbs") breadcrumbs!: any;
  @Prop({ type: Array, default: [] }) items!: Array<string>;

  @Watch("items", { immediate: true })
  process(items: Array<string>) {
    if (!this.breadcrumbs) {
      requestAnimationFrame(() => this.process(items));
      return;
    }
    this.crumbs = this.handleCrumbs([...items]);
  }

  private collapse(items: Array<BreadcrumbModel>) {
    const DIVIDER_WIDTH = 33;
    const totalDividerWidth = (items.length - 1) * DIVIDER_WIDTH;
    const crumbsWidth = this.breadcrumbWidth(items) + totalDividerWidth;

    if (crumbsWidth > this.breadcrumbs.$el.offsetWidth) {
      const { crumbs } = items.reduce<BreadcrumbReducer>(this.handleCrumb, {
        crumbs: [],
        crumbsWidth,
      });

      return crumbs;
    } else {
      return items;
    }
  }

  private measure(items: Array<string>): Array<BreadcrumbModel> {
    return items.map((node) => {
      const el = document.createElement("span");
      const app = document.querySelector(".v-application");

      el.classList.add("breadcrumbs__measure");
      el.innerText = node;

      (app as Element).appendChild(el);

      const width = el.scrollWidth;

      el.remove();

      return {
        width,
        text: node,
        hidden: false,
      };
    });
  }

  private handleCrumb(
    { crumbsWidth, crumbs }: BreadcrumbReducer,
    item: BreadcrumbModel
  ) {
    const BASE_WIDTH = 20;

    if (crumbsWidth <= this.breadcrumbs.$el.offsetWidth) {
      const resizedCrumbs = [...crumbs, item];

      return {
        crumbs: resizedCrumbs,
        crumbsWidth,
      };
    }

    const resizedCrumbs = [...crumbs, { ...item, hidden: true }];

    return {
      crumbs: resizedCrumbs,
      crumbsWidth: crumbsWidth - item.width + BASE_WIDTH,
    };
  }

  private breadcrumbWidth(items: Array<BreadcrumbModel>) {
    return items.reduce((width, crumb) => width + crumb.width, 0);
  }
}
</script>

<style scoped lang="scss">
.v-breadcrumbs {
  padding: 8px 0;
}
.breadcrumbs {
  &__measure {
    position: absolute;
    left: 0;
    display: inline;
    visibility: hidden;
    white-space: nowrap;
  }
}
</style>

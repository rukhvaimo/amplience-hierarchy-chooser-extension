<template>
  <v-breadcrumbs divider="/" :items="crumbs" ref="breadcrumbs">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item>
        {{ shouldCollapse(item) ? "..." : item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import {
  apply,
  pipe,
  insert,
  ifElse,
  always,
  thunkify,
  when,
  isNil,
  gt,
  identity,
  reduce,
  where,
  prop,
  values,
  allPass,
  equals,
  subtract,
  __,
  length,
  gte,
  assoc,
  nth,
  reject,
  props,
  applySpec,
  indexOf,
  complement,
  lt,
} from "ramda";
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { notEmpty } from "@/utils/helpers";

// eslint-disable-next-line no-unused-vars
import { BreadcrumbModel, handleHide, hideCrumbs } from "@/utils/breadcrumbs";
import { reduceIdx } from "@/utils/helpers";
import {
  getTailCrumbsWidth,
  getTotalBreadcrumbsWidth,
  shouldCollapse,
} from "@/utils/breadcrumbs";

type BreadcrumbReducer = {
  crumbs: BreadcrumbModel[];
  crumbsWidth: number;
};

@Component
export default class Breadcrumbs extends Vue {
  private crumbs: Array<BreadcrumbModel> = [];
  private handleCrumbs = pipe(this.measure, this.collapse);

  DIVIDER_WIDTH = 12;

  @Ref("breadcrumbs") breadcrumbs!: any;
  @Prop({ type: Array, default: [] }) items!: Array<string>;

  @Watch("items", { immediate: true })
  process(items: Array<string>) {
    pipe(
      ifElse(
        always(isNil(this.breadcrumbs)),
        pipe(thunkify(this.process), requestAnimationFrame, always([])),
        this.handleCrumbs
      ),
      when(notEmpty, (crumbs) => {
        this.crumbs = crumbs;
      })
    )(items);
  }

  shouldCollapse(item: BreadcrumbModel) {
    return shouldCollapse(this.crumbs, item);
  }

  private collapse(items: Array<BreadcrumbModel>): Array<BreadcrumbModel> {
    const crumbsWidth = getTotalBreadcrumbsWidth(this.DIVIDER_WIDTH, items);
    const offsetWidth = this.breadcrumbs.$el.offsetWidth;

    return ifElse(
      //@ts-ignore
      always(gt(crumbsWidth, offsetWidth)),
      pipe(
        reduce(this.handleCrumb, { crumbs: [], crumbsWidth }),
        ifElse(
          where({
            crumbsWidth: gt(__, offsetWidth),
          }),
          //@ts-ignore
          pipe(props(["crumbs", "crumbsWidth"]), apply(this.hide)),
          prop("crumbs")
        )
      ),
      identity
    )(items);
  }

  private hide(items: Array<BreadcrumbModel>, width: number) {
    return pipe(
      reduceIdx(
        //@ts-ignore
        handleHide(this.breadcrumbs.$el.offsetWidth, this.DIVIDER_WIDTH, items),
        {
          crumbs: items,
          crumbsWidth: getTailCrumbsWidth(width, items),
        }
      ),
      prop("crumbs"),
      hideCrumbs(items)
      //@ts-ignore
    )(items);
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
        collapse: false,
      };
    });
  }

  private handleCrumb(
    { crumbsWidth, crumbs }: BreadcrumbReducer,
    item: BreadcrumbModel
  ) {
    const BASE_WIDTH = 10;

    if (crumbsWidth <= this.breadcrumbs.$el.offsetWidth) {
      const resizedCrumbs = [...crumbs, item];

      return {
        crumbs: resizedCrumbs,
        crumbsWidth,
      };
    }

    const resizedCrumbs = [...crumbs, { ...item, collapse: true }];

    return {
      crumbs: resizedCrumbs,
      crumbsWidth: crumbsWidth - item.width + BASE_WIDTH,
    };
  }
}
</script>

<style lang="scss">
.v-breadcrumbs {
  width: 100%;
  display: flex;
  padding: 8px 0;
  flex-wrap: nowrap;

  li:nth-child(even) {
    padding: 0 4px;
    max-width: 12px;
  }

  li {
    min-width: 10px;
  }

  &__item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    min-width: 0;
    float: left;
  }
}

ul.v-breadcrumbs {
  padding-left: 0;
}

.breadcrumbs {
  &__measure {
    position: absolute;
    left: 0;
    display: inline;
    visibility: collapse;
    white-space: nowrap;
  }
}
</style>

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
  __,
  props,
  map,
} from "ramda";
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { notEmpty } from "@/utils/helpers";

/* eslint-disable no-unused-vars */
import {
  BreadcrumbModel,
  BreadcrumbReducer,
  handleCrumb,
  handleHide,
  hideCrumbs,
  measure,
} from "@/utils/breadcrumbs";
/* eslint-enable no-unused-vars */
import { reduceIdx } from "@/utils/helpers";
import {
  getTailCrumbsWidth,
  getTotalBreadcrumbsWidth,
  shouldCollapse,
} from "@/utils/breadcrumbs";

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
        //@ts-ignore
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
    return map(measure(document), items);
  }

  private handleCrumb(breadcrumbs: BreadcrumbReducer, item: BreadcrumbModel) {
    const BASE_WIDTH = 10;

    return handleCrumb(
      breadcrumbs,
      BASE_WIDTH,
      this.breadcrumbs.$el.offsetWidth,
      item
    );
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

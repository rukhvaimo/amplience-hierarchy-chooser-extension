<template>
  <v-breadcrumbs divider="/" :items="crumbs" ref="breadcrumbs">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item>
        {{
          item.collapse && !isLast(item) && !isFirst(item) ? "..." : item.text
        }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import { pipe, insert, reject } from "ramda";
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";

export interface BreadcrumbModel {
  text: string;
  collapse: Boolean;
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

  isLast(item: BreadcrumbModel) {
    return this.crumbs.indexOf(item) === this.crumbs.length - 1;
  }

  isFirst(item: BreadcrumbModel) {
    return this.crumbs.indexOf(item) === 0;
  }

  private collapse(items: Array<BreadcrumbModel>): Array<BreadcrumbModel> {
    const DIVIDER_WIDTH = 12;
    const totalDividerWidth = (items.length - 1) * DIVIDER_WIDTH;
    const crumbsWidth = this.breadcrumbWidth(items) + totalDividerWidth;

    if (crumbsWidth > this.breadcrumbs.$el.offsetWidth) {
      const { crumbs, crumbsWidth: width } = items.reduce<BreadcrumbReducer>(
        this.handleCrumb,
        {
          crumbs: [],
          crumbsWidth,
        }
      );

      if (width > this.breadcrumbs.$el.offsetWidth) {
        const hidden = this.hide(crumbs, width);

        return hidden;
      }

      return crumbs;
    } else {
      return items;
    }
  }

  private hide(items: Array<BreadcrumbModel>, width: number) {
    const DIVIDER_WIDTH = 12;
    const crumbsWidth = width + items[items.length - 1].width + items[0].width;

    const handleHide = (
      { crumbsWidth, crumbs }: BreadcrumbReducer,
      item: BreadcrumbModel,
      index: number
    ) => {
      if (
        crumbsWidth > this.breadcrumbs.$el.offsetWidth &&
        index < items.length - 2 &&
        index !== 0
      ) {
        return {
          crumbs: reject(
            (item: BreadcrumbModel) => items.indexOf(item) === index,
            crumbs
          ),
          crumbsWidth: crumbsWidth - DIVIDER_WIDTH,
        };
      }

      return {
        crumbs,
        crumbsWidth,
      };
    };

    const { crumbs } = items.reduce<BreadcrumbReducer>(handleHide, {
      crumbs: [...items],
      crumbsWidth,
    });

    if (items.length >= 2 && crumbs.length === 2) {
      return insert(
        1,
        Object.assign({}, items[items.length - 2], { collapse: true }),
        crumbs
      );
    }

    return crumbs;
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

  private breadcrumbWidth(items: Array<BreadcrumbModel>) {
    return items.reduce((width, crumb) => width + crumb.width, 0);
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

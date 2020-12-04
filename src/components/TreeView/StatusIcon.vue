<template>
  <div class="ml-auto">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon size="20" class="ml-2 status-icon" v-bind="attrs" v-on="on">
          {{ icon }}
        </v-icon>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { prop } from "ramda";
import { Component, Prop, Vue } from "vue-property-decorator";

import { ARCHIVED, EARLY, LATEST } from "@/assets/icons";

@Component
export default class StatusIcon extends Vue {
  @Prop({ required: true, type: String })
  status!: string;

  statuses = {
    ARCHIVED,
    EARLY,
    LATEST,
  };
  tooltips = {
    EARLY: "Published (early)",
    LATEST: "Published (latest)",
  };

  get icon() {
    //@ts-ignore
    return prop(this.status, this.statuses);
  }
  get tooltip() {
    //@ts-ignore
    return prop(this.status, this.tooltips);
  }
}
</script>

<style lang="scss" scoped>
.status-icon {
  color: #666666;
  transition: color 0.3s;
  transform: translate(0, -1px);
  .is-selected & {
    color: white;
  }

  .tree-node:not(.is-disabled):hover & {
    color: var(--v-primary-base);
  }

  .is-disabled & {
    color: #999;
  }
}
</style>

<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon small class="ml-auto status-icon" v-bind="attrs" v-on="on">
        {{ icon }}
      </v-icon>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { prop } from "ramda";
import Vue from "vue";
import Component from "vue-class-component";
import { ARCHIVED, EARLIER, LATEST } from "@/assets/icons";

@Component({
  props: {
    status: { required: true, type: String },
  },
  computed: {
    icon() {
      //@ts-ignore
      return prop(this.status, this.statuses);
    },
    tooltip() {
      //@ts-ignore
      return prop(this.status, this.tooltips);
    },
  },
  data: () => ({
    statuses: {
      ARCHIVED,
      EARLIER,
      LATEST,
    },
    tooltips: {
      EARLIER: "Published (earlier)",
      LATEST: "Published (latest)",
    },
  }),
})
export default class StatusIcon extends Vue {}
</script>

<style lang="scss" scoped>
.status-icon {
  color: #666666;
  transition: color 0.3s;

  .is-selected & {
    color: white;
  }

  .tree-node:not(.is-disabled):hover & {
    color: #039be5;
  }

  .is-disabled & {
    color: #999;
  }
}
</style>

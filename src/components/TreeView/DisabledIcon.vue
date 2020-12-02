<template>
  <div class="ml-auto">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon size="20" v-bind="attrs" v-on="on" class="ml-2 disabled-icon"
          >mdi-cancel</v-icon
        >
      </template>
      <span v-if="node.status === 'ARCHIVED'">
        Node is archived
      </span>
      <span v-else>Node is not a valid content type for addition</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import { INode } from "@/store/Node";

@Component
export default class extends Vue {
  @Prop({ type: Object, required: true })
  node!: INode;
}
</script>

<style lang="scss" scoped>
.disabled-icon {
  color: #999;
  transform: translate(0, -1px);
}
</style>

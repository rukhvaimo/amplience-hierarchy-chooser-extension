<template>
  <transition
    name="node-transition"
    @before-enter="beforeEnter"
    @enter="enter"
    @before-leave="leave"
    @leave="leave"
  >
    <slot></slot>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  // beforeEnter(el: HTMLElement) {}
  // enter(el: HTMLElement, done: Function) {}
  // beforeLeave(el: HTMLElement) {}
  // leave(el: HTMLElement, done: Function) {}
}
</script>

<style lang="scss" scoped></style>

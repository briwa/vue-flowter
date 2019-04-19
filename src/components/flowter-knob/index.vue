<template>
<div
  class="flowter-knob"
  :style="knobStyle"
  @mousedown="$emit('mousedown')" >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :view-box.camel="viewBox">
    <circle
      :cx="size"
      :cy="size"
      :r="size - strokeWidth"
      :stroke-width="strokeWidth"
      fill="#ffffff"
      stroke="#000000" />
  </svg>
</div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-knob {
  position: absolute;
  pointer-events: initial;
  cursor: pointer;
}
</style>

<template>
  <div
    class="flowter-node-parent"
    :style="nodeStyle"
    @click="$emit('click', id)"
    @mouseenter="$emit('mouseenter', id)"
    @mouseleave="$emit('mouseleave', id)">
    <div class="flowter-node-text">
      <span v-html="text" />
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :view-box.camel="viewBox">
      <ellipse
        stroke="#000000"
        :stroke-width="strokeWidth"
        :fill="bgcolor"
        :cx="halfWidth"
        :cy="halfHeight"
        :rx="nodeCenter.x"
        :ry="nodeCenter.y"
      />
    </svg>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-parent {
  position: absolute;
  z-index: 1;
}

.flowter-edge-child span {
  position: absolute;

}
.flowter-edge-child path {
  cursor: pointer;
}
</style>

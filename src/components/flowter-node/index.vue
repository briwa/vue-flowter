<template>
  <div
    class="flowter-node-parent"
    :style="nodeStyle"
    @click="onClick"
    @mouseenter="$emit('mouseenter', id)"
    @mouseleave="$emit('mouseleave', id)">
    <div class="flowter-node-text">
      <span v-html="text" />
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :view-box.camel="viewBox">
      <ellipse
        v-if="isNodeEllipse"
        stroke="#000000"
        :stroke-width="strokeWidth"
        :fill="bgcolor"
        :cx="halfWidth"
        :cy="halfHeight"
        :rx="nodeCenter.x"
        :ry="nodeCenter.y"
      />
      <path
        v-else
        stroke="#000000"
        :stroke-width="strokeWidth"
        :fill="bgcolor"
        :d="nodePoints" />
    </svg>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-node-parent {
  position: absolute;
  z-index: 2;
  overflow: hidden;
}

.flowter-node-parent:hover {
  cursor: pointer;
}

.flowter-node-parent span {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}

.flowter-node-parent .flowter-node-text {
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
}
</style>

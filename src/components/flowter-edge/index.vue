<template>
  <div
    class="flowter-edge-parent"
    :style="edgeStyle">
    <div class="flowter-edge-child">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :view-box.camel="viewBox">
        <defs>
          <marker
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
            :id="arrowId">
            <path
              d="M 0 0 L 9 5 L 0 10 z"
              :fill="color"
              :stroke="color" />
          </marker>
        </defs>
        <path
          class="editing-path"
          fill="none"
          :stroke-width="strokeWidth * 10"
          :stroke="color"
          :shape-rendering="shapeRendering"
          :d="edgePoints"
          :marker-start="markerStart"
          :marker-end="markerEnd"
          @click="onClick"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave" />
        <path
          class="rendering-path"
          fill="none"
          :stroke-width="strokeWidth"
          :stroke="color"
          :shape-rendering="shapeRendering"
          :d="edgePoints"
          :marker-start="markerStart"
          :marker-end="markerEnd" />
      </svg>
      <span
        v-if="text"
        :style="textStyle">
        {{ text }}
      </span>
      <slot name="edit" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-parent {
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

.flowter-edge-child {
  position: relative;
}

.flowter-edge-child span {
  position: absolute;
}

.flowter-edge-parent .editing-path {
  opacity: 0;
  pointer-events: initial;
  cursor: pointer;
}
</style>

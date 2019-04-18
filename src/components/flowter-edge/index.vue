<template>
  <div
    class="flowter-edge-parent"
    :style="edgeStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave">
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
          class="clickable"
          fill="none"
          :stroke-width="strokeWidth"
          :stroke="color"
          :shape-rendering="shapeRendering"
          :d="edgePoints"
          :marker-start="markerStart"
          :marker-end="markerEnd" />
      </svg>
      <span
        class="clickable"
        v-if="text"
        :style="textStyle">
        {{ text }}
      </span>
      <slot
        class="clickable"
        v-bind="relativePosition" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-parent {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.flowter-edge-child .clickable {
  position: relative;
  pointer-events: auto;
}

.flowter-edge-child span {
  position: absolute;
}

.flowter-edge-child path {
  cursor: pointer;
}
</style>

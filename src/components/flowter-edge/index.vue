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
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
            :fill="color">
            <path d="M 0 0 L 9 5 L 0 10 z" />
          </marker>
        </defs>
        <polyline
          fill="none"
          stroke-width="2"
          :stroke="color"
          :shape-rendering="shapeRendering"
          :points="polylinePoints"
          :marker-start="markerStart"
          :marker-end="markerEnd"
          @click="onClick" />
      </svg>
      <span
        v-if="text"
        :style="textStyle">
        {{ text }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-parent {
  position: absolute;
  z-index: 1;
}

.flowter-edge-child svg polyline {
  cursor: pointer;
}

.flowter-edge-child {
  position: relative;
}

.flowter-edge-child span {
  position: absolute;
}
</style>

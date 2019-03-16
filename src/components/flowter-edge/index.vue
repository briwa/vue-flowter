<template>
  <div 
    class="flowter-edge"
    :style="edgeStyle">
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
          orient="auto-start-reverse">
          <path d="M 0 0 L 9 5 L 0 10 z" />
        </marker>
      </defs>
      <polyline
        fill="none"
        stroke="black"
        stroke-width="2"
        :points="polylinePoints"
        :marker-start="markerStart"
        :marker-end="markerEnd" />
    </svg>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge {
  position: absolute;
}
</style>

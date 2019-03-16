<template>
  <div class="flowter-container">
    <img class="bg" src="./assets/grid.png"/>
    <div
      :style="containerStyle"
      class="flowter-parent">
      <div
        v-for="(row, rowIdx) in renderedNodes"
        :key="rowIdx">
        <div
          v-for="node in row"
          :key="node.id">
          <flowter-node
            :id="node.id"
            :text="node.text"
            :top="node.top"
            :left="node.left" />
          <flowter-edge
            v-for="edge in getEdges(node)"
            :key="`edge-${edge.from}-${edge.to}`"
            :start-point="edge.startPoint"
            :end-point="edge.endPoint"
            :marker="edge.marker"
            :direction="edge.direction"
            :center-point="centerPoint" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./flowter.ts"></script>
<style>
.flowter-container {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.1;
}

.flowter-parent {
  position: relative;
}
</style>

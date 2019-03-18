<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div
      v-for="(row, rowIdx) in renderedNodes"
      :key="rowIdx">
      <div
        v-for="node in row"
        :key="`container-${node.id}`">
        <flowter-node
          :id="node.id"
          :key="`node-${node.id}`"
          :text="node.text"
          :x="node.x"
          :y="node.y"
          :width="node.width"
          :height="node.height" />
        <flowter-edge
          v-for="edge in getEdges(node)"
          :key="`edge-${edge.from}-${edge.to}`"
          :start-point="edge.startPoint"
          :end-point="edge.endPoint"
          :marker="edge.marker"
          :direction="edge.direction"
          :center-point="centerPoint"
          :mode="mode"
          :edge-type="edgeType" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-container {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.flowter-parent {
  position: relative;
}
</style>

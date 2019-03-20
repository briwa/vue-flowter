<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div
      class="flowter-scale"
      :style="scaleStyle">
      <template v-for="row in renderedNodes">
        <template v-for="node in row">
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
            :key="edge.id"
            :start-point="edge.startPoint"
            :end-point="edge.endPoint"
            :marker="edge.marker"
            :direction="edge.direction"
            :center-point="centerPoint"
            :mode="mode"
            :edge-type="edgeType" />
        </template>
      </template>
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
  overflow: hidden;
}
</style>

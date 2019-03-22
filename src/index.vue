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
            :key="`node-${node.id}`"
            :id="node.id"
            :text="node.text"
            :x="node.x"
            :y="node.y"
            :width="node.width"
            :height="node.height"
            @edit="onEditingNode" />
          <flowter-edge
            v-for="edge in getEdges(node)"
            :key="edge.id"
            :id="edge.id"
            :start-point="edge.startPoint"
            :end-point="edge.endPoint"
            :text="edge.text"
            :marker="edge.marker"
            :direction="edge.direction"
            :center-point="centerPoint"
            :mode="mode"
            :edge-type="edgeType" />
        </template>
      </template>
      <flowter-node-selection
        v-show="editingNode"
        :node="editingNode"
        :mode="mode"
        @resize="onResizeNode"
        @move="onMoveNode"
        @exit-editing="onExitEditingNode" />
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

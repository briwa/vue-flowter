<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div
      class="flowter-scale"
      :style="scaleStyle">
      <template v-for="(row, rowIdx) in renderedNodes">
        <template v-for="(node, colIdx) in row">
          <flowter-node
            v-bind="node"
            :key="`node-${node.id}`"
            :font-size="fontSize"
            @edit="onEditingNode" />
          <flowter-edge
            v-for="edge in getEdges(node, rowIdx, colIdx, row.length)"
            v-bind="edge"
            :key="edge.id"
            :font-size="fontSize"
            :mode="mode"
            :edge-type="edgeType" />
        </template>
      </template>
      <flowter-node-selection
        v-show="editingNodeId"
        v-bind="editingNodeDetails"
        :mode="mode"
        @resize="onResizeNode"
        @move="onMoveNode"
        @exit-editing="onExitEditingNode" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-parent {
  position: relative;
}
</style>

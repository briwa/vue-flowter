<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div
      class="flowter-scale"
      :style="scaleStyle">
      <template v-for="{ node } in renderedNodesDict">
        <flowter-node
          v-bind="node"
          :key="`node-${node.id}`"
          :font-size="fontSize"
          @click="onEditingNode"
          @mouseenter="onMouseOverNode"
          @mouseleave="onMouseOverNode()" />
      </template>
      <template v-for="edge in edges">
        <flowter-edge
          :key="`edge-${edge.from}-${edge.to}`"
          :id="`edge-${edge.from}-${edge.to}`"
          :from="renderedNodesDict[edge.from]"
          :to="renderedNodesDict[edge.to]"
          :mode="mode"
          :font-size="fontSize"
          :edge-type="edgeType"
          @mouseenter="onEditEdge({ type: 'hover-start', payload: $event })"
          @click="onEditEdge({ type: 'edit-start', payload: $event })" />
      </template>
      <flowter-node-selection
        v-show="editingNodeId"
        :node="editingNodeDetails.node"
        :bounds="editingNodeDetails.bounds"
        :mode="mode"
        @resize="onResizeNode"
        @move="onMoveNode"
        @exit-editing="onEditingNode()" />
      <flowter-edge-selection
        :from="editingEdgeFrom"
        :to="editingEdgeTo"
        :showing="editingEdgeDetails.showing"
        :editing="editingEdgeDetails.editing"
        :dragging="editingEdgeDetails.dragging"
        :mode="mode"
        :font-size="fontSize"
        :edge-type="edgeType"
        @edit="onEditEdge" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-parent {
  position: relative;
}
</style>

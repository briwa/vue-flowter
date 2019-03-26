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
          @click="onEditingNode" />
      </template>
      <template v-for="edge in renderedEdgesDict">
        <flowter-edge
          v-bind="edge"
          :key="edge.id"
          :font-size="fontSize"
          :mode="mode"
          :edge-type="edgeType" />
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

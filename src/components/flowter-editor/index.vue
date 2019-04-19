<template>
  <flowter-flowchart
    :style="flowchartStyle"
    :mode="mode"
    :nodes="nodes"
    :edges="edges"
    @node-click="onEditNode({ type: 'edit-start', payload: $event })"
    @node-mouseenter="onEditNode({ type: 'hover-start', payload: $event })"
    @node-mouseleave="onEditNode({ type: 'hover-end', payload: $event })">
    <template #edge-elements="{ start, end }">
      <flowter-knob
        v-show="showKnob(start.id)"
        :x="start.x"
        :y="start.y"
        @mousedown="onEditEdge({ type: 'drag-start', payload: { from: start.id, to: end.id, draggingType: 'from' } })" />
      <flowter-knob
        v-show="showKnob(end.id)"
        :x="end.x"
        :y="end.y"
        @mousedown="onEditEdge({ type: 'drag-start', payload: { from: start.id, to: end.id, draggingType: 'to' } })" />
    </template>
    <template #flowchart-elements="{ renderedNodes }">
      <flowter-node-selection
        :mode="mode"
        :editing="isEditingNode"
        :node-details="renderedNodes[editingNodeId]"
        @update="onEditNode({ type: 'update', payload: $event })"
        @exit="onEditNode({ type: 'edit-end', payload: $event })" />
      <flowter-edge-selection
        :mode="mode"
        :editing="isEditingEdge"
        :edge-type="edgeType"
        :font-size="fontSize"
        :to="renderedNodes[editingEdgeToId]"
        :from="renderedNodes[editingEdgeFromId]"
        @drag-end="onEditEdge({ type: 'drag-end' })" />
    </template>
  </flowter-flowchart>
</template>
<script lang="ts" src="./index.ts"></script>

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        class="flowter-knob"
        :style="knobStyle(start)"
        :view-box.camel="`0 0 20 20`">
        <circle
          cx="10"
          cy="10"
          r="10"
          fill="#00ff00"
          stroke="none"
          @mousedown="onEditEdge({ type: 'drag-start', payload: { from: start.id, to: end.id, draggingType: 'from' } })" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        class="flowter-knob"
        :style="knobStyle(end)"
        :view-box.camel="`0 0 20 20`">
        <circle
          cx="10"
          cy="10"
          r="10"
          fill="#00ff00"
          stroke="none"
          @mousedown="onEditEdge({ type: 'drag-start', payload: { from: start.id, to: end.id, draggingType: 'to' } })" />
      </svg>
    </template>
    <template #flowchart-elements="{ renderedNodes }">
      <flowter-node-selection
        :mode="mode"
        :editing="editing === 'node'"
        :node-details="renderedNodes[editingNodeId]"
        @update="onEditNode({ type: 'update', payload: $event })"
        @exit="onEditNode({ type: 'edit-end', payload: $event })" />
      <flowter-edge-selection
        :mode="mode"
        :edge-type="edgeType"
        :font-size="fontSize"
        :to="renderedNodes[editingEdgeToId]"
        :from="renderedNodes[editingEdgeFromId]"
        :editing="editing === 'edge'"
        @drag-end="onEditEdge({ type: 'drag-end' })"/>
    </template>
  </flowter-flowchart>
</template>
<script lang="ts" src="./index.ts"></script>

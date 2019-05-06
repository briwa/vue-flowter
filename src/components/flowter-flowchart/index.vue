<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div class="flowter-nodes-container">
      <template v-for="nodeDetails in renderedNodes">
        <flowter-node
          v-bind="nodeDetails.node.current"
          :key="`node-${nodeDetails.node.current.id}`"
          :font-size="fontSize"
          @click="$emit('node-click', $event)"
          @mouseenter="$emit('node-mouseenter', $event)"
          @mouseleave="$emit('node-mouseleave', $event)" />
        <flowter-edge
          v-for="edge in nodeDetails.to.edge"
          :key="`edge-${edge.from}-${edge.to}`"
          v-bind="getRenderedEdge(renderedNodes[edge.from], renderedNodes[edge.to])"
          @mouseenter="$emit('edge-mouseenter', $event)"
          @mouseleave="$emit('edge-mouseleave', $event)">
        </flowter-edge>
      </template>
    </div>
    <slot
      name="flowchart-elements"
      :rendered-nodes="renderedNodes" />
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-nodes-container {
  position: relative;
}
</style>

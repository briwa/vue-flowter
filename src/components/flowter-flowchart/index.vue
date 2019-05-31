<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div class="flowter-nodes-container">
      <slot
        name="content"
        :rendered-nodes="renderedNodes">
        <template v-for="nodeDetails in renderedNodes">
          <flowter-node
            :key="`node-${nodeDetails.node.current.id}`"
            v-bind="nodeDetails.node.current" />
          <flowter-edge
            v-for="edge in nodeDetails.to.edge"
            :key="`edge-${edge.from}-${edge.to}`"
            v-bind="getRenderedEdge(renderedNodes[edge.from], renderedNodes[edge.to])" />
        </template>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-nodes-container {
  position: relative;
}
</style>

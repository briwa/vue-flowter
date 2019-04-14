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
          @click="$emit('node-click', $event)"
          @mouseenter="$emit('node-mouseenter', $event)"
          @mouseleave="$emit('node-mouseleave', $event)" />
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
          @click="$emit('edge-click', $event)"
          @mouseenter="$emit('edge-mouseenter', $event)"
          @mouseleave="$emit('edge-mouseleave', $event)" />
      </template>
      <slot name="flowchart-elements" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-parent {
  position: relative;
}
</style>

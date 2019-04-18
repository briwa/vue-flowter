<template>
  <div
    :style="containerStyle"
    class="flowter-parent">
    <div
      class="flowter-scale"
      :style="scaleStyle">
      <template v-for="{ node } in renderedNodes">
        <flowter-node
          v-bind="node.current"
          :key="`node-${node.current.id}`"
          :font-size="fontSize"
          @click="$emit('node-click', $event)"
          @mouseenter="$emit('node-mouseenter', $event)"
          @mouseleave="$emit('node-mouseleave', $event)" />
      </template>
      <template v-for="edge in edges">
        <flowter-edge
          :key="`edge-${edge.from}-${edge.to}`"
          :id="`edge-${edge.from}-${edge.to}`"
          :from="renderedNodes[edge.from]"
          :to="renderedNodes[edge.to]"
          :mode="mode"
          :font-size="fontSize"
          :edge-type="edgeType"
          @click="$emit('edge-click', $event)"
          @mouseenter="$emit('edge-mouseenter', $event)"
          @mouseleave="$emit('edge-mouseleave', $event)">
          <template #default="relativePosition">
            <slot
              name="edge-elements"
              v-bind="relativePosition" />
          </template>
        </flowter-edge>
      </template>
      <slot
        name="flowchart-elements"
        :rendered-nodes="renderedNodes" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-parent {
  position: relative;
}
</style>

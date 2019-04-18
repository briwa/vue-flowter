<template>
  <flowter-edge
    v-show="editing"
    id="flowter-edge-edit"
    :from="from"
    :to="to"
    :mode="mode"
    :color="`#00ff00`"
    :font-size="fontSize"
    :edge-type="edgeType">
  </flowter-edge>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-editing {
  z-index: 3;
}

.flowter-edge-showing {
  pointer-events: none;
}

.flowter-edge-edit-controls span {
  position: absolute;
  font-size: 12px;
  top: 0;
  right: -12px;
  opacity: 1;
  cursor: pointer;
  pointer-events: initial;
}

.flowter-knob {
  position: absolute;
  pointer-events: initial;
  cursor: pointer;
}
</style>

<template>
  <flowter-edge-straight
    v-if="style === 'straight'"
    v-bind="$props" />
  <flowter-edge-bent-forward
    v-else-if="style === 'bent-forward'"
    v-bind="$props" />
  <flowter-edge-bent-backward
    v-else-if="style === 'bent-backward'"
    v-bind="$props" />
  <flowter-edge-circular
    v-else-if="style === 'circular'"
    v-bind="$props" />
  <span v-else>
    Invalid edge style {{ style }}
  </span>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-parent {
  position: absolute;
  z-index: 1;
}

.flowter-edge-child span {
  position: absolute;

}
.flowter-edge-child path {
  cursor: pointer;
}
</style>

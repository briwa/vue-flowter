<template>
  <flowter-edge />
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-parent {
  position: absolute;
  z-index: 1;
}

.flowter-edge-child svg polyline {
  cursor: pointer;
}

.flowter-edge-child {
  position: relative;
}

.flowter-edge-child span {
  position: absolute;
}
</style>

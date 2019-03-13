<template>
  <div class="flowter-node-parent">
    <div class="flowter-node"
    :style="nodeStyle">
      {{ text }}
    </div>
    <slot :orient-point="orientPoints.s" />
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-node-parent {
  position: absolute;
  top: 0px;
  left: 200px;
}

.flowter-node {
  box-sizing: border-box;
  border: 2px solid #000000;
  position: relative;
}
</style>

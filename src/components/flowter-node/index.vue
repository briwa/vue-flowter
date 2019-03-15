<template>
  <div
    class="flowter-node-parent"
    :style="containerStyle">
    <div
      class="flowter-node"
      :style="nodeStyle">
      <span>{{ text }}</span>
    </div>
    <slot :orient-point="orientPoints.s" />
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-node-parent {
  position: absolute;
}

.flowter-node {
  box-sizing: border-box;
  border: 2px solid #000000;
  position: relative;
  text-align: center;
}

.flowter-node span {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}
</style>

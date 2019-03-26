<template>
  <div
    class="flowter-node-parent"
    :style="containerStyle"
    @click="onClick">
    <div
      class="flowter-node"
      :style="nodeStyle"
      @mouseover.self="onMouseOver">
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-node-parent {
  position: absolute;
  z-index: 2;
}

.flowter-overlay {
  display: none;
  background-color: #00ff00;
  opacity: .3;
}

.flowter-node-parent:hover {
  cursor: pointer;
}

.flowter-node {
  box-sizing: border-box;
  border: 2px solid #000000;
  position: relative;
  text-align: center;
  overflow: hidden;
  background-color: #ffffff;
}

.flowter-node span {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}
</style>

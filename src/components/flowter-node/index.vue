<template>
  <div
    class="flowter-node-parent"
    :style="containerStyle">
    <div
      class="flowter-node"
      :style="nodeStyle">
      <span>{{ text }}</span>
    </div>
    <span
      class="flowter-edit-span"
      @click="onClick">
      Edit
    </span>
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

.flowter-node-parent.flowter-editing {
  user-select: none;
}

.flowter-edit-span {
  position: absolute;
  font-size: 12px;
  top: -14px;
  right: 0;
  display: none;
}

.flowter-node-parent:hover .flowter-edit-span {
  display: block;
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

<template>
  <div
    v-show="editing"
    class="flowter-node-edit"
    :style="containerStyle">
    <div
      class="flowter-node-edit-overlay"
      :style="overlayStyle">
      <div
        class="flowter-node-resize-n"
        @mousedown="onMouseDown($event, 'resize-n')" />
      <div
        class="flowter-node-resize-s"
        @mousedown="onMouseDown($event, 'resize-s')" />
      <div
        class="flowter-node-resize-w"
        @mousedown="onMouseDown($event, 'resize-w')" />
      <div
        class="flowter-node-resize-e"
        @mousedown="onMouseDown($event, 'resize-e')" />
      <div
        class="flowter-node-resize-move"
        @mousedown="onMouseDown($event, 'move')" />
    </div>
    <span
      class="flowter-exit-edit-span"
      @click="onClickExit">
      Exit
    </span>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-node-edit {
  z-index: 3;
  position: relative;
}

.flowter-node-edit-overlay {
  background-color: #00ff00;
  opacity: .3;
  position: absolute;
}

.flowter-node-edit .flowter-node-resize-w {
  position: absolute;
  width: 20%;
  height: 80%;
  top: 10%;
  bottom: 10%;
  left: 0;
  cursor: w-resize;
}

.flowter-node-edit .flowter-node-resize-e {
  position: absolute;
  width: 20%;
  height: 80%;
  top: 10%;
  bottom: 10%;
  right: 0;
  cursor: e-resize;
}

.flowter-node-edit .flowter-node-resize-n {
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  right: 10%;
  top: 0;
  cursor: n-resize;
}

.flowter-node-edit .flowter-node-resize-s {
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  right: 10%;
  bottom: 0;
  cursor: s-resize;
}

.flowter-node-edit .flowter-node-resize-move {
  position: absolute;
  width: 60%;
  height: 60%;
  left: 20%;
  right: 20%;
  bottom: 20%;
  top: 20%;
  cursor: move;
}

.flowter-exit-edit-span {
  position: absolute;
  font-size: 12px;
  top: -14px;
  left: 0;
  opacity: 1;
  cursor: pointer;
}
</style>
<template>
  <div
    class="flowter-edit"
    :style="containerStyle">
    <div
      class="flowter-edit-overlay"
      :style="overlayStyle">
      <div
        class="flowter-resize-n"
        @mousedown="onMouseDown($event, 'resize-n')" />
      <div
        class="flowter-resize-s"
        @mousedown="onMouseDown($event, 'resize-s')" />
      <div
        class="flowter-resize-w"
        @mousedown="onMouseDown($event, 'resize-w')" />
      <div
        class="flowter-resize-e"
        @mousedown="onMouseDown($event, 'resize-e')" />
      <div
        class="flowter-resize-move"
        @mousedown="onMouseDown($event, 'move')" />
    </div>
    <span
      class="flowter-exit-edit-span"
      @click="onClick">
      Exit
    </span>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edit {
  z-index: 3;
  position: absolute;
}

.flowter-edit-overlay {
  background-color: #00ff00;
  opacity: .3;
  position: absolute;
}

.flowter-edit .flowter-resize-w {
  position: absolute;
  width: 20%;
  height: 80%;
  top: 10%;
  bottom: 10%;
  left: 0;
  cursor: w-resize;
}

.flowter-edit .flowter-resize-e {
  position: absolute;
  width: 20%;
  height: 80%;
  top: 10%;
  bottom: 10%;
  right: 0;
  cursor: e-resize;
}

.flowter-edit .flowter-resize-n {
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  right: 10%;
  top: 0;
  cursor: n-resize;
}

.flowter-edit .flowter-resize-s {
  position: absolute;
  width: 80%;
  height: 20%;
  left: 10%;
  right: 10%;
  bottom: 0;
  cursor: s-resize;
}

.flowter-edit .flowter-resize-move {
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